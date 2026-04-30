<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Http;

class ThemedImageController extends Controller
{
    public function edit(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'image'                => 'required|image|mimes:jpg,jpeg,png,webp|max:20480',
            'theme'                => 'required|string|max:255',
            'image_size'           =>'required|in:1:1,16:9,3:4,9:16,4:5',
            'optional_text'        => 'nullable|string|max:255',
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


            $sizeMapping = [
                '1:1'   => 'square_hd',
                '16:9'  => 'landscape_16_9',
                '9:16'  => 'portrait_16_9',
                '4:5'   => 'portrait_4_5',
                '3:4'   => 'portrait_4_5',
            ];

            $userSize = $request->input('image_size', '1:1');
            $falImageSize = $sizeMapping[$userSize] ?? 'square_hd';


            $prompt = $this->buildThemeImagePrompt($request);

            $submitResponse = Http::withHeaders([
                'Authorization' => 'Key ' . $falKey,
                'Accept'        => 'application/json',
            ])
                ->withoutVerifying()
                ->timeout(300)
                ->post('https://queue.fal.run/fal-ai/flux-pro/kontext', [
                    'image_url'      => $imageDataUri,
                    'prompt'         => $prompt,
                    'image_size'     => $falImageSize,
                    'aspect_ratio'   => $request->input('image_size'),
                    'guidance_scale' => 3.5,
                    'num_images'     => 1,
                    'enable_safety_checker' => true,
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

            $requestModel = $user->themedImageRequests()->create([
                'source_image'        => $path,

                'theme'               => $request->theme,
                'image_size'          => $request->image_size,
                'optional_text'       => $request->optional_text,
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


    private function buildThemeImagePrompt(Request $request): string
    {
        $theme = trim((string)$request->input('theme', 'seasonal theme'));
        $userText = trim((string)$request->input('optional_text', ''));
        $imageSize = trim((string)$request->input('image_size', '1:1'));

        $secondaryText = $this->getSecondaryText($theme);

        // تعريف المنتج الأساسي
        $productSubject = "a premium luxury product sample (hero object)";

        // الأساس: وضع المنتج مباشرة على السطح بدون منصة مع ظلال واقعية
        $prompt = "CORE SUBJECT: A detailed high-quality marketing photograph of {$productSubject} placed directly on the floor surface. No pedestal, no stand. The product sits naturally with realistic soft contact shadows. ";

        switch ($theme) {
            case "Christmas":
                $prompt .= "BACKGROUND: A deep, rich red floor and background. SCENE: Dense pine branches adorned with small red ornaments frame the top and bottom of the image. Hanging and falling red and white decorative balls fill the upper space. Professional studio lighting.";
                break;

            case "Ramadan":
            case "Eid al-Fitr":
                $prompt .= "BACKGROUND: A dark navy blue floor reflecting the scene. Night sky with shimmering stars. SCENE: Above the product, hanging golden ornate lanterns, a decorative crescent moon, and stars are visible. Golden geometric patterns decorate the bottom corners. Professional photorealistic lighting.";
                break;

            case "Valentine's Day":
                $prompt .= "BACKGROUND: A soft pink floor and wall with artistic plant-like shadows. SCENE: A forest of hanging red paper hearts from above and scattered heart-shaped petals on the surface around the product. Flanking pink floral bushes frame the scene. Soft, romantic lighting.";
                break;

            case "Eid al-Adha":
                $prompt .= "BACKGROUND: A light stone-textured floor. Beige wall with a massive, deeply carved 3D mandala pattern. SCENE: Above the product, a garland of hanging wooden sheep figures is visible. Bowls of dates and prayer beads are placed on the surface in the foreground. Warm, natural light.";
                break;

            case "Black Friday":
                $prompt .= "BACKGROUND: A polished black marble floor with sharp reflections and dark textured charcoal marble wall. SCENE: A complex cascade of floating gold and clear spheres, hanging dollar signs, percentage symbols, and small shopping bags fills the air. Dramatic high-contrast lighting.";
                break;

            case "New Year":
                $prompt .= "BACKGROUND: A dark polished wood floor. SCENE: A small decorated green fir tree stands behind the product. The background is filled with dynamic, colorful fireworks exploding with sharp light trails. Festive and celebratory energy.";
                break;

            case "Graduation":
                $prompt .= "BACKGROUND: A dark reflective navy floor. SCENE: Majestic night blue background with sharp God-rays of light beaming from the top. A dark blue graduation cap with a gold tassel and a rolled diploma are placed on the floor next to the product. Achievement-focused lighting.";
                break;

            case "Mother's Day":
                $prompt .= "BACKGROUND: A soft luxurious pink floor. SCENE: Soft pink wall. Beautiful blooming magnolia bushes frame the product from the left and right sides. Soft, warm, feminine lighting.";
                break;

            case "Back to School":
                $prompt .= "BACKGROUND: A light yellow floor meeting a deep blue chalkboard wall. SCENE: Hand-drawn chalk sketches on the wall. A variety of school supplies (pencil case, rulers, books, compasses) are arranged on the floor around the product. Bright, crisp natural lighting.";
                break;

            default:
                $prompt .= "BACKGROUND: A clean, minimal professional studio background with realistic lighting.";
                break;
        }

        // ✍️ منطق النصوص: النص المدخل (كبير) ثم النص الثابت (أصغر)
        if (!empty($userText)) {
            $prompt .= " OVERLAY TEXT: In the upper third of the frame, the text '{$userText}' is written in a VERY LARGE, bold, premium elegant font. ";

            if (!empty($secondaryText)) {
                $prompt .= "Directly below it, the fixed text '{$secondaryText}' is written in a SMALLER, sophisticated font. ";
            }

            $prompt .= "Both texts are in a bright, clean white with a subtle glow, perfectly centered with generous space above the product to avoid overlap.";
        }

        $prompt .= " TECHNICAL SPECS: Ultra-realistic, 8K resolution, cinematic lighting, sharp focus, ray-tracing reflections, aspect ratio {$imageSize}.";

        return trim(preg_replace('/\s+/', ' ', $prompt));
    }

    /**
     * النصوص الثابتة (Secondary Text) لكل ثيم
     */
    private function getSecondaryText(string $theme): string
    {
        switch ($theme) {
            case "Ramadan": return "Ramadan Kareem";
            case "Eid al-Fitr": return "Happy Eid";
            case "Eid al-Adha": return "Happy Eid Al-Adha";
            case "Christmas": return "Merry Christmas";
            case "Valentine's Day": return "With Love";
            case "Black Friday": return "Exclusive Offer";
            case "Graduation": return "Class of 2024";
            case "New Year": return "Happy New Year";
            case "Mother's Day": return "Happy Mother's Day";
            case "Back to School": return "Ready to Learn";
            default: return "";
        }
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
