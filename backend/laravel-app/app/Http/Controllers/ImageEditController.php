<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;
use App\Services\UsageLimitService;
use Illuminate\Validation\ValidationException;
use OpenApi\Attributes as OA;
class ImageEditController extends Controller
{

    #[OA\Post(
        path: '/api/image/edit',
        summary: 'Edit a product image using AI',
        description: 'Uploads a product image and applies AI-powered editing including background replacement, lighting, style, text overlay, and camera angle adjustments. Free plan users are limited to 3 generations per month.',
        tags: ['Tools - Image Enhancement'],
        security: [['sanctum' => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\MediaType(
                mediaType: 'multipart/form-data',
                schema: new OA\Schema(
                    required: ['image', 'product_name', 'target_audience', 'background_type', 'background_blur', 'light_type', 'style_type', 'extra_prompt'],
                    properties: [
                        new OA\Property(
                            property: 'image',
                            type: 'string',
                            format: 'binary',
                            description: 'Product image file. Accepted formats: jpg, jpeg, png, webp. Max size: 20MB.'
                        ),
                        new OA\Property(
                            property: 'product_name',
                            type: 'string',
                            maxLength: 255,
                            description: 'Name of the product.',
                            example: 'Luxury Perfume Bottle'
                        ),
                        new OA\Property(
                            property: 'target_audience',
                            type: 'string',
                            maxLength: 255,
                            description: 'The intended audience for the product.',
                            example: 'Young women aged 18-35'
                        ),
                        new OA\Property(
                            property: 'product_description',
                            type: 'string',
                            maxLength: 1000,
                            nullable: true,
                            description: 'Optional short description of the product.',
                            example: 'A premium oud-based perfume with a gold cap.'
                        ),
                        new OA\Property(
                            property: 'background_type',
                            type: 'string',
                            maxLength: 500,
                            description: 'Description of the desired background.',
                            example: 'Soft white marble surface with rose petals'
                        ),
                        new OA\Property(
                            property: 'background_blur',
                            type: 'integer',
                            minimum: 0,
                            maximum: 10,
                            description: 'Background blur intensity from 0 (no blur) to 10 (maximum blur).',
                            example: 5
                        ),
                        new OA\Property(
                            property: 'light_type',
                            type: 'string',
                            maxLength: 255,
                            description: 'Lighting style to apply.',
                            example: 'Soft studio lighting'
                        ),
                        new OA\Property(
                            property: 'style_type',
                            type: 'string',
                            maxLength: 255,
                            description: 'Photography or visual style.',
                            example: 'Luxury commercial photography'
                        ),
                        new OA\Property(
                            property: 'text_on_image',
                            type: 'string',
                            maxLength: 255,
                            nullable: true,
                            description: 'Optional text to overlay on the image.',
                            example: 'Limited Edition'
                        ),
                        new OA\Property(
                            property: 'text_position',
                            type: 'string',
                            maxLength: 50,
                            nullable: true,
                            description: 'Position of the text overlay on the image.',
                            example: 'bottom-left'
                        ),
                        new OA\Property(
                            property: 'text_size',
                            type: 'integer',
                            minimum: 12,
                            maximum: 100,
                            nullable: true,
                            description: 'Font size of the overlay text in pixels.',
                            example: 48
                        ),
                        new OA\Property(
                            property: 'camera_angle',
                            type: 'string',
                            maxLength: 255,
                            nullable: true,
                            description: 'Camera angle for the shot.',
                            example: 'eye level'
                        ),
                        new OA\Property(
                            property: 'image_ratio',
                            type: 'string',
                            nullable: true,
                            enum: ['1:1', '16:9', '3:4', '9:16', '4:5'],
                            description: 'Desired output image aspect ratio.',
                            example: '1:1'
                        ),
                        new OA\Property(
                            property: 'extra_prompt',
                            type: 'string',
                            maxLength: 1500,
                            description: 'Additional instructions or creative directions for the AI.',
                            example: 'Add a subtle golden shimmer to the background.'
                        ),
                        new OA\Property(
                            property: 'num_images',
                            type: 'integer',
                            minimum: 1,
                            maximum: 3,
                            nullable: true,
                            description: 'Number of image variations to generate (1–3). Defaults to 1.',
                            example: 2
                        ),
                    ]
                )
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'Image edited successfully.',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'success', type: 'boolean', example: true),
                        new OA\Property(property: 'message', type: 'string', example: 'Image edited and saved successfully.'),
                        new OA\Property(
                            property: 'data',
                            type: 'object',
                            properties: [
                                new OA\Property(property: 'request_id', type: 'integer', example: 42),
                                new OA\Property(property: 'original_url', type: 'string', format: 'uri', example: 'https://example.com/storage/uploads/image.jpg'),
                                new OA\Property(
                                    property: 'edited_urls',
                                    type: 'array',
                                    items: new OA\Items(type: 'string', format: 'uri'),
                                    example: ['https://cdn.fal.ai/result1.jpg', 'https://cdn.fal.ai/result2.jpg']
                                ),
                                new OA\Property(property: 'prompt_used', type: 'string', example: 'Professional luxury e-commerce product photography of Luxury Perfume Bottle...'),
                                new OA\Property(property: 'raw_result', type: 'object', description: 'Raw response from fal.ai'),
                            ]
                        ),
                    ]
                )
            ),
            new OA\Response(
                response: 401,
                description: 'Unauthenticated.',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'success', type: 'boolean', example: false),
                        new OA\Property(property: 'message', type: 'string', example: 'Unauthenticated.'),
                    ]
                )
            ),
            new OA\Response(
                response: 403,
                description: 'Free plan monthly limit reached (max 3 generations).',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'success', type: 'boolean', example: false),
                        new OA\Property(property: 'message', type: 'string', example: 'You have reached the maximum limit of 3 generations for the free plan.'),
                    ]
                )
            ),
            new OA\Response(
                response: 422,
                description: 'Validation failed.',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'success', type: 'boolean', example: false),
                        new OA\Property(property: 'message', type: 'string', example: 'Validation failed.'),
                        new OA\Property(
                            property: 'errors',
                            type: 'object',
                            example: ['image' => ['The image field is required.']]
                        ),
                    ]
                )
            ),
            new OA\Response(
                response: 500,
                description: 'Server error or FAL_KEY missing.',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'success', type: 'boolean', example: false),
                        new OA\Property(property: 'message', type: 'string', example: 'Image editing failed.'),
                        new OA\Property(property: 'error', type: 'string', example: 'Connection timed out.'),
                    ]
                )
            ),
            new OA\Response(
                response: 502,
                description: 'fal.ai returned an error or timed out.',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'success', type: 'boolean', example: false),
                        new OA\Property(property: 'message', type: 'string', example: 'Failed to submit request to fal.ai'),
                        new OA\Property(property: 'fal_error', type: 'object', description: 'Error payload from fal.ai'),
                    ]
                )
            ),
        ]
    )]
    public function edit(Request $request)
    {
        set_time_limit(300);

        $validator = Validator::make($request->all(), [
            'image'                => 'required|image|mimes:jpg,jpeg,png,webp|max:20480',
            'product_name'         => 'required|string|max:255',
            'target_audience'      => 'required|string|max:255',
            'product_description'  => 'nullable|string|max:1000',

            'background_type'      => 'required|string|max:500',
            'background_blur'      => 'required|integer|min:0|max:10',

            'light_type'           => 'required|string|max:255',
            'style_type'           => 'required|string|max:255',

            'text_on_image'        => 'nullable|string|max:255',
            'text_position'        => 'nullable|string|max:50',
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

        $subscription = $user->subscriptions()
            ->where('status', 'active')
            ->latest()
            ->first();

        $planId = $subscription?->plan_id ?? 1;

        if ($planId == 1) {
            $usageCounter = $user->usageCounters()
                ->where('type', 'enhance_image')
                ->where('year', now()->year)
                ->where('month', now()->month)
                ->first();

            $used = $usageCounter?->used ?? 0;

            if ($used >= 3) {
                return response()->json([
                    'success' => false,
                    'message' => 'You have reached the maximum limit of 3 generations for the free plan.',
                ], 403);
            }
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
                '1:1'  => 'square_hd',
                '16:9' => 'landscape_16_9',
                '9:16' => 'portrait_16_9',
                '4:5'  => 'portrait_4_3',
                '3:4'  => 'portrait_4_3',
            ];

            $userSize = $request->input('image_ratio', '1:1');
            $falImageSize = $sizeMapping[$userSize] ?? 'square_hd';

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
                    'image_size'     => $falImageSize,
                    'aspect_ratio'   => $userSize,
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

            $requestModel = $user->enhanceImageRequests()->create([
                'source_image'        => $path,

                'product_name'        => $request->product_name,
                'target_audience'     => $request->target_audience,
                'product_description' => $request->product_description,

                'background_type'     => $request->background_type,
                'background_blur'     => $request->background_blur,

                'light_type'          => $request->light_type,
                'style_type'          => $request->style_type,

                'text_on_image'       => $request->text_on_image,
                'text_position'       => $request->text_position,
                'text_size'           => $request->text_size,

                'camera_angle'        => $request->camera_angle,
                'image_ratio'         => $request->image_ratio,

                'extra_prompt'        => $request->extra_prompt,
            ]);



           if ($planId == 1) {
    $counter = $user->usageCounters()->firstOrCreate(
        [
            'type'  => 'enhance_image',
            'year'  => now()->year,
            'month' => now()->month,
        ],
        ['used' => 0]
    );
    $counter->increment('used');
}


            foreach ($editedUrls as $index => $url) {
                $requestModel->responses()->create([
                    'image_path'   => $url,
                    'result_order' => $index + 1,
                ]);
            }



            return response()->json([
                'success' => true,
                'message' => 'Image edited and saved successfully.',
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
        $backgroundBlur = $request->input('background_blur');
        $lighting = trim((string) $request->input('light_type', 'soft studio lighting'));
        $photoStyle = trim((string) $request->input('style_type', 'luxury commercial photography'));
        $textOnImage = trim((string) $request->input('text_on_image', ''));
        $textPosition = $request->input('text_position', 'bottom-left');
        $textSize = (int)$request->input('text_size', 48);
        $cameraAngle = trim((string)$request->input('camera_angle', 'eye level'));
        $aspectRatio = $request->input('image_ratio', '');
        $extraPrompt = trim((string) $request->input('extra_prompt', ''));

        $prompt = "Professional luxury e-commerce product photography of {$productName}, ultra realistic, 8K commercial quality.";

        if ($description) {
            $prompt .= " {$description}.";
        }

        $prompt .= " Keep the exact {$productName} with perfect details, exact colors, exact logos, exact textures. ";
        $prompt .= "Do not change or deform the product at all. Product standing perfectly straight and upright.";

        if ($extraPrompt) {
            $prompt .= " {$extraPrompt}.";
        }

        $bgDesc = $background;

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

            if (!$statusResponse->successful()) {
                throw new \Exception('Failed to check fal status.');
            }

            $statusData = $statusResponse->json();
            $status = $statusData['status'] ?? null;

            if ($status === 'COMPLETED') {
                $resultResponse = Http::withHeaders([
                    'Authorization' => 'Key ' . $falKey,
                ])
                    ->withoutVerifying()
                    ->timeout(180)
                    ->get($responseUrl);

                if (!$resultResponse->successful()) {
                    throw new \Exception('Failed to fetch fal result.');
                }

                return $resultResponse->json();
            }

            if (in_array($status, ['FAILED', 'ERROR', 'CANCELLED'], true)) {
                throw new \Exception('fal failed with status ' . $status);
            }

            sleep($sleepSeconds);
        }

        throw new \Exception('fal request timed out.');
    }
}
