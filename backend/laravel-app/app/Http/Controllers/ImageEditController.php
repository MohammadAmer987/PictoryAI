<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;

class ImageEditController extends Controller
{
    public function edit(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'image'                => 'required|image|mimes:jpg,jpeg,png,webp|max:20480',
            'product_name'         => 'required|string|max:255',
            'target_audience'      => 'required|string|max:255',
            'product_description'  => 'nullable|string|max:1000',

            'background_type'      => 'required|string|max:500',
            'background_color'     => ['nullable', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'background_blur'      => 'required|integer|min:0|max:10',

            'light_type'           => 'required|string|max:255',
            'style_type'           => 'required|string|max:255',

            'text_on_image'        => 'nullable|string|max:255',
            'text_position'        => 'nullable|string|max:50',
            'text_color'           => ['nullable', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'text_size'            => 'nullable|integer|min:12|max:100',

            'camera_angle'         => 'nullable|string|max:255',
            'image_ratio'          => 'nullable|in:1:1,16:9,3:4,9:16,4:5',

            'extra_prompt'         => 'required|string|max:1500',
            'num_images'           => 'nullable|integer|min:1|max:3',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated.',
            ], 401);
        }

        $falKey = config('services.fal.key');

        if (!$falKey) {
            return response()->json([
                'success' => false,
                'message' => 'FAL_KEY is missing.',
                'debug_info' => 'Check config/services.php and run php artisan config:clear',
            ], 500);
        }

        try {
            $imageFile = $request->file('image');

            $path = $imageFile->store('uploads', 'public');
            $uploadedImageUrl = asset('storage/' . $path);

            $imageContent = file_get_contents($imageFile->getRealPath());
            $base64Image  = base64_encode($imageContent);
            $mimeType     = $imageFile->getMimeType() ?? 'image/jpeg';
            $imageDataUri = "data:{$mimeType};base64,{$base64Image}";

            $prompt = $this->buildDynamicProfessionalPrompt($request);

            $numImages = (int) $request->input('num_images', 1);

            $submitResponse = Http::withHeaders([
                'Authorization' => 'Key ' . $falKey,
                'Accept'        => 'application/json',
            ])
                ->withoutVerifying()
                ->timeout(300)
                ->post('https://queue.fal.run/fal-ai/flux-pro/kontext', [
                    'image_url'      => $imageDataUri,
                    'prompt'         => $prompt,
                    'guidance_scale' => 3.5,
                    'num_images'     => $numImages,
                    'seed'           => null,
                    'output_format'  => 'jpeg',
                ]);

            if (!$submitResponse->successful()) {
                return response()->json([
                    'success'   => false,
                    'message'   => 'Failed to submit request to fal.ai',
                    'fal_error' => $submitResponse->json() ?: $submitResponse->body(),
                ], 502);
            }

            $submitData = $submitResponse->json();

            $statusUrl   = $submitData['status_url'] ?? null;
            $responseUrl = $submitData['response_url'] ?? null;

            if (!$statusUrl || !$responseUrl) {
                return response()->json([
                    'success' => false,
                    'message' => 'Missing status_url or response_url',
                ], 502);
            }

            $resultData = $this->pollFalResult($statusUrl, $responseUrl, $falKey);

            $editedUrls = isset($resultData['images']) && is_array($resultData['images'])
                ? array_column($resultData['images'], 'url')
                : [];

            if (empty($editedUrls)) {
                return response()->json([
                    'success'     => false,
                    'message'     => 'No edited image returned from fal.ai',
                    'fal_result'  => $resultData,
                    'prompt_used' => $prompt,
                ], 502);
            }

            // نفس فكرة CaptionController:
            // $request->user()->captionGenerations()->create(...)
            $requestModel = $user->enhanceImageRequests()->create([
                'source_image'        => $path,

                'product_name'        => $request->product_name,
                'target_audience'     => $request->target_audience,
                'product_description' => $request->product_description,

                'background_type'     => $request->background_type,
                'background_color'    => $request->background_color ?? '#ffffff',
                'background_blur'     => $request->background_blur,

                'light_type'          => $request->light_type,
                'style_type'          => $request->style_type,

                'text_on_image'       => $request->text_on_image,
                'text_position'       => $request->text_position,
                'text_color'          => $request->text_color,
                'text_size'           => $request->text_size,

                'camera_angle'        => $request->camera_angle,
                'image_ratio'         => $request->image_ratio,

                'extra_prompt'        => $request->extra_prompt,
            ]);

            foreach ($editedUrls as $index => $url) {
                $requestModel->responses()->create([
                    'image_path'   => $url,
                    'result_order' => $index + 1,
                ]);
            }

            return response()->json([
                'success'      => true,
                'message'      => 'Image edited and saved successfully.',
                'data' => [
                    'request_id'   => $requestModel->id,
                    'original_url' => $uploadedImageUrl,
                    'edited_urls'  => $editedUrls,
                    'prompt_used'  => $prompt,
                    'raw_result'   => $resultData,
                ],
            ]);

        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Image editing failed.',
                'error'   => $e->getMessage(),
                'line'    => $e->getLine(),
                'file'    => $e->getFile(),
            ], 500);
        }
    }

    private function buildDynamicProfessionalPrompt(Request $request): string
    {
        $productName = trim((string)$request->input('product_name', 'the product'));
        $audience = trim((string)$request->input('target_audience', ''));
        $description = trim((string)$request->input('product_description', ''));
        $background = trim((string)$request->input('background_type', ''));
        $backgroundColor = trim((string)$request->input('background_color', ''));
        $backgroundBlur = $request->input('background_blur');
        $lighting = trim((string)$request->input('light_type', 'soft studio lighting'));
        $photoStyle = trim((string)$request->input('style_type', 'luxury commercial photography'));
        $textOnImage = trim((string)$request->input('text_on_image', ''));
        $textPosition = $request->input('text_position', 'bottom-left');
        $textColor = trim((string)$request->input('text_color', '#ffffff'));
        $textSize = (int)$request->input('text_size', 48);
        $cameraAngle = trim((string)$request->input('camera_angle', 'eye level'));
        $aspectRatio = $request->input('image_ratio', '');
        $extraPrompt = trim((string)$request->input('extra_prompt', ''));

        $prompt = "Professional luxury e-commerce product photography of {$productName}, ultra realistic, 8K commercial quality.";

        if ($description) {
            $prompt .= " {$description}.";
        }

        $prompt .= " Keep the exact {$productName} with perfect details, exact colors, exact logos, exact textures — do not change or deform the product at all. Product standing perfectly straight and upright.";

        if ($extraPrompt) {
            $prompt .= " {$extraPrompt}.";
        }

        $bgDesc = $background;

        if ($backgroundColor) {
            $bgDesc .= " with {$backgroundColor} tone";
        }

        if ($bgDesc) {
            $prompt .= " Background is " . trim($bgDesc) . ".";
        }

        if ($cameraAngle) {
            $prompt .= " Shot from {$cameraAngle} angle.";
        }

        $prompt .= " {$lighting}, {$photoStyle}, shallow depth of field, soft cinematic bokeh, high-end luxury advertisement.";

        if ($textOnImage) {
            if ($textSize >= 70) {
                $textWeight = "very large, prominent, bold";
            } elseif ($textSize >= 50) {
                $textWeight = "large, prominent";
            } elseif ($textSize >= 35) {
                $textWeight = "medium-large, clear";
            } else {
                $textWeight = "medium sized, elegant";
            }

            $prompt .= " Add the EXACT text: '{$textOnImage}' ";
            $prompt .= "in the {$textPosition} of the image. ";
            $prompt .= "Make this text {$textWeight}, modern luxury font, ";
            $prompt .= "EXACT color {$textColor}, highly visible, sharp edges, ";
            $prompt .= "excellent readability, soft glow effect, high contrast.";
        }

        if ($backgroundBlur !== null && $backgroundBlur > 0) {
            $prompt .= " Soft cinematic background blur intensity {$backgroundBlur}/10.";
        }

        if ($aspectRatio) {
            $prompt .= " Composition in {$aspectRatio} aspect ratio.";
        }

        if ($audience) {
            $prompt .= " Targeted at {$audience}.";
        }

        $prompt .= " Do not add any extra props, people, or objects unless explicitly written in the prompt. Clean focus on the product.";

        return trim(preg_replace('/\s+/', ' ', $prompt));
    }

    private function pollFalResult(string $statusUrl, string $responseUrl, string $falKey): array
    {
        $maxAttempts = 70;
        $sleepSeconds = 2;

        for ($i = 0; $i < $maxAttempts; $i++) {
            $statusResponse = Http::withHeaders([
                'Authorization' => 'Key ' . $falKey,
            ])
                ->withoutVerifying()
                ->timeout(60)
                ->get($statusUrl);

            $statusData = $statusResponse->json();
            $status = $statusData['status'] ?? null;

            if ($status === 'COMPLETED') {
                $resultResponse = Http::withHeaders([
                    'Authorization' => 'Key ' . $falKey,
                ])
                    ->withoutVerifying()
                    ->timeout(180)
                    ->get($responseUrl);

                return $resultResponse->json();
            }

            if (in_array($status, ['FAILED', 'ERROR', 'CANCELLED'])) {
                throw new \Exception('fal failed with status ' . $status);
            }

            sleep($sleepSeconds);
        }

        throw new \Exception('fal request timed out.');
    }
}
