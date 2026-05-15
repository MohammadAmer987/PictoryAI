<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use OpenApi\Attributes as OA;
use Illuminate\Http\Request;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;

class ImageGeneratorController extends Controller
{
    private const IMAGE_DIMENSIONS = [
        'post'      => ['width' => 1024, 'height' => 1024, 'ratio' => '1:1'],
        'story'     => ['width' => 1024, 'height' => 1792, 'ratio' => '9:16'],
        'banner'    => ['width' => 1792, 'height' => 1024, 'ratio' => '16:9'],
        'portrait'  => ['width' => 1024, 'height' => 1280, 'ratio' => '4:5'],
        'landscape' => ['width' => 1536, 'height' => 1024, 'ratio' => '3:2'],
        'cinema'    => ['width' => 1792, 'height' => 768,  'ratio' => '21:9'],
    ];

    // Free plan: 3 generations max
    private const FREE_LIMIT = 3;

    // fal.ai model to use
    private const FAL_MODEL = 'fal-ai/flux/schnell';

   
    #[OA\Post(
        path: '/api/image-generator/generate',
        summary: 'Generate an AI image based on project details',
        description: <<<DESC
Generates a professional AI image using **fal.ai** (Flux model) based on project name, content, color, and image type.

### Plan Limits
- **Free plan**: maximum **3 generations** total.
- **Pro plan**: **unlimited** generations (active subscription required).

Returns base64 image data along with metadata.
DESC,
        tags: ['Tools - Image Generation'],
        security: [['bearerAuth' => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['projectName'],
                properties: [
                    new OA\Property(
                        property: 'projectName',
                        type: 'string',
                        maxLength: 255,
                        description: 'The name of the project to display in the image',
                        example: 'My Brand'
                    ),
                    new OA\Property(
                        property: 'content',
                        type: 'string',
                        maxLength: 1000,
                        nullable: true,
                        description: 'Additional content description for image generation',
                        example: 'A modern coffee shop with warm lighting'
                    ),
                    new OA\Property(
                        property: 'color',
                        type: 'string',
                        maxLength: 100,
                        nullable: true,
                        description: 'Brand color to dominate the image palette (hex or color name)',
                        example: '#3B82F6'
                    ),
                    new OA\Property(
                        property: 'colorText',
                        type: 'string',
                        maxLength: 255,
                        nullable: true,
                        description: 'Additional color instructions in natural language',
                        example: 'Use deep navy blue tones'
                    ),
                    new OA\Property(
                        property: 'imageType',
                        type: 'string',
                        nullable: true,
                        enum: ['post', 'story', 'banner', 'portrait', 'landscape', 'cinema'],
                        description: "Image format/layout type:\n- `post` → 1024×1024 (1:1)\n- `story` → 1024×1792 (9:16)\n- `banner` → 1792×1024 (16:9)\n- `portrait` → 1024×1280 (4:5)\n- `landscape` → 1536×1024 (3:2)\n- `cinema` → 1792×768 (21:9)",
                        example: 'post'
                    ),
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'Image generated successfully',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'success', type: 'boolean', example: true),
                        new OA\Property(
                            property: 'image',
                            type: 'string',
                            description: 'Base64 encoded image with data URI prefix',
                            example: 'data:image/jpeg;base64,/9j/4AAQSkZJRg...'
                        ),
                        new OA\Property(
                            property: 'image_url',
                            type: 'string',
                            description: 'Original fal.ai image URL',
                            example: 'https://fal.media/files/...'
                        ),
                        new OA\Property(property: 'color', type: 'string', nullable: true, example: '#3B82F6'),
                        new OA\Property(property: 'image_type', type: 'string', example: 'post'),
                        new OA\Property(
                            property: 'size',
                            type: 'object',
                            properties: [
                                new OA\Property(property: 'width', type: 'integer', example: 1024),
                                new OA\Property(property: 'height', type: 'integer', example: 1024),
                                new OA\Property(property: 'ratio', type: 'string', example: '1:1'),
                            ]
                        ),
                        new OA\Property(property: 'prompt', type: 'string', description: 'The full prompt sent to the AI'),
                        new OA\Property(property: 'seed', type: 'integer', description: 'Random seed used for generation', example: 482910573),
                        new OA\Property(property: 'provider', type: 'string', example: 'fal.ai'),
                        new OA\Property(
                            property: 'usage',
                            type: 'object',
                            nullable: true,
                            description: 'Usage info (only returned for free plan)',
                            properties: [
                                new OA\Property(property: 'used', type: 'integer', example: 1),
                                new OA\Property(property: 'limit', type: 'integer', example: 3),
                                new OA\Property(property: 'remaining', type: 'integer', example: 2),
                            ]
                        ),
                    ]
                )
            ),
            new OA\Response(
                response: 401,
                description: 'Unauthenticated',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'success', type: 'boolean', example: false),
                        new OA\Property(property: 'message', type: 'string', example: 'Unauthenticated.'),
                    ]
                )
            ),
            new OA\Response(
                response: 403,
                description: 'Free limit reached or subscription expired',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'success', type: 'boolean', example: false),
                        new OA\Property(
                            property: 'error',
                            type: 'string',
                            enum: ['free_limit_reached', 'subscription_expired'],
                            example: 'free_limit_reached'
                        ),
                        new OA\Property(property: 'message', type: 'string', example: 'You have used all 3 free generations.'),
                        new OA\Property(property: 'used', type: 'integer', nullable: true, example: 3),
                        new OA\Property(property: 'limit', type: 'integer', nullable: true, example: 3),
                    ]
                )
            ),
            new OA\Response(
                response: 422,
                description: 'Validation error',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'message', type: 'string', example: 'The project name field is required.'),
                        new OA\Property(property: 'errors', type: 'object'),
                    ]
                )
            ),
            new OA\Response(
                response: 500,
                description: 'Server or generation error',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'success', type: 'boolean', example: false),
                        new OA\Property(property: 'error', type: 'string', example: 'Image generation failed.'),
                    ]
                )
            ),
        ]
    )]

    // -------------------------------------------------------------------------
    // MAIN ENDPOINT
    // -------------------------------------------------------------------------

    public function generate(Request $request)
    {
        try {
            // 1. Auth check
            $user = $request->user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated.',
                ], 401);
            }

            // 2. Validate input
            $request->validate([
                'projectName' => 'required|string|max:255',
                'content'     => 'nullable|string|max:1000',
                'color'       => 'nullable|string|max:100',
                'colorText'   => 'nullable|string|max:255',
                'imageType'   => 'nullable|string|in:post,story,banner,portrait,landscape,cinema',
            ]);

            // 3. Check plan limits
            $limitCheck = $this->checkPlanLimit($user);
            if ($limitCheck !== null) {
                return $limitCheck;
            }

            // 4. Build prompt & generate
            $selectedColor   = $request->color ? trim($request->color) : null;
            $colorDescriptor = $selectedColor ?: 'the selected color';

            $prompt = $this->buildPrompt(
                $request->projectName,
                $request->content,
                $selectedColor,
                $colorDescriptor,
                $request->imageType,
                $request->colorText
            );

            $dimensions = $this->resolveDimensions($request->imageType);
            $seed       = random_int(100000, 999999999);

            return $this->generateWithFal(
                $prompt,
                $selectedColor,
                $request->imageType ?? 'post',
                $dimensions,
                $seed,
                $request,
                $user
            );

        } catch (\Illuminate\Validation\ValidationException $e) {
            throw $e; // Let Laravel handle 422
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'error'   => 'Image request failed on the server. ' . $e->getMessage(),
            ], 500);
        }
    }

    // -------------------------------------------------------------------------
    // PLAN LIMIT CHECK
    // -------------------------------------------------------------------------

    /**
     * Returns a JSON response if the user is NOT allowed to generate, null if they can.
     */
    private function checkPlanLimit($user): ?\Illuminate\Http\JsonResponse
    {
        $subscription = $user->activeSubscription()->with('plan')->first();
        $plan         = $subscription?->plan;
        $planName     = strtolower($plan?->name ?? 'free');

        if ($planName === 'free') {
            $limit = self::FREE_LIMIT;
            $used  = \App\Models\ImageGenerationRequest::where('user_id', $user->id)->count();

            if ($used >= $limit) {
                return response()->json([
                    'success' => false,
                    'error'   => 'free_limit_reached',
                    'message' => 'You have used all ' . $limit . ' free generations. Please upgrade to Pro for unlimited access.',
                    'used'    => $used,
                    'limit'   => $limit,
                ], 403);
            }

            return null; // Allowed
        }

        // Pro (or any paid plan): require active subscription
        if (!$subscription || $subscription->status !== 'active') {
            return response()->json([
                'success' => false,
                'error'   => 'subscription_expired',
                'message' => 'Your Pro subscription has expired. Please renew to continue.',
            ], 403);
        }

        if ($subscription->end_date && now()->isAfter($subscription->end_date)) {
            return response()->json([
                'success' => false,
                'error'   => 'subscription_expired',
                'message' => 'Your Pro subscription has expired. Please renew to continue.',
            ], 403);
        }

        return null; // Pro user, allowed
    }

    // -------------------------------------------------------------------------
    // FAL.AI GENERATION
    // -------------------------------------------------------------------------

    private function generateWithFal(
        string $prompt,
        ?string $selectedColor,
        string $imageType,
        array $dimensions,
        int $seed,
        Request $request,
        $user
    ) {
        $falKey = trim((string) config('services.fal.key'));

        if ($falKey === '') {
            return response()->json([
                'success' => false,
                'error'   => 'fal.ai API key is not configured.',
            ], 500);
        }

        // Call fal.ai API
        $falResponse = Http::timeout(120)
            ->connectTimeout(15)
            ->withHeaders([
                'Authorization' => 'Key ' . $falKey,
                'Content-Type'  => 'application/json',
            ])
            ->post('https://fal.run/' . self::FAL_MODEL, [
                'prompt'     => $prompt,
                'image_size' => [
                    'width'  => $dimensions['width'],
                    'height' => $dimensions['height'],
                ],
                'seed'       => $seed,
                'num_images' => 1,
            ]);

        if ($falResponse->failed()) {
            return response()->json([
                'success' => false,
                'error'   => 'fal.ai error (' . $falResponse->status() . '): ' . $falResponse->body(),
            ], 500);
        }

        $imageUrl = $falResponse->json('images.0.url');

        if (!$imageUrl) {
            return response()->json([
                'success' => false,
                'error'   => 'fal.ai did not return an image URL. Response: ' . $falResponse->body(),
            ], 500);
        }

        // Download image and encode to base64
        try {
            $imageData    = Http::timeout(60)->get($imageUrl);
            $base64Image  = 'data:' . $imageData->header('Content-Type', 'image/jpeg') . ';base64,' . base64_encode($imageData->body());
        } catch (\Throwable $e) {
            // Return URL only if download fails
            $base64Image = null;
        }

        // Save to DB
        $imageRequest = \App\Models\ImageGenerationRequest::create([
            'user_id'      => $user->id,
            'project_name' => $request->projectName,
            'content'      => $request->content,
            'color'        => $selectedColor,
            'image_type'   => $imageType,
            'prompt_used'  => $prompt,
        ]);

        \App\Models\ImageGenerationResponse::create([
            'request_id'   => $imageRequest->id,
            'image_path'   => $imageUrl,
            'result_order' => 1,
        ]);

        // Build usage info for free users
        $subscription = $user->activeSubscription()->with('plan')->first();
        $planName     = strtolower($subscription?->plan?->name ?? 'free');
        $usageInfo    = null;

        if ($planName === 'free') {
            $used      = \App\Models\ImageGenerationRequest::where('user_id', $user->id)->count();
            $usageInfo = [
                'used'      => $used,
                'limit'     => self::FREE_LIMIT,
                'remaining' => max(0, self::FREE_LIMIT - $used),
            ];
        }

        return response()->json(array_filter([
            'success'    => true,
            'image'      => $base64Image,
            'image_url'  => $imageUrl,
            'color'      => $selectedColor,
            'image_type' => $imageType,
            'size'       => [
                'width'  => $dimensions['width'],
                'height' => $dimensions['height'],
                'ratio'  => $dimensions['ratio'],
            ],
            'prompt'     => $prompt,
            'seed'       => $seed,
            'provider'   => 'fal.ai',
            'usage'      => $usageInfo,
        ], fn($v) => $v !== null));
    }

    // -------------------------------------------------------------------------
    // PROMPT BUILDER
    // -------------------------------------------------------------------------

    private function buildPrompt(
        ?string $name,
        ?string $content,
        ?string $color,
        string $colorDescriptor,
        ?string $imageType,
        ?string $colorText = null
    ): string {
        $dimensions   = $this->resolveDimensions($imageType);
        $requirements = [];
        $restrictions = [];

        if ($imageType) {
            $requirements[] = 'Output format must be a ' . $imageType . ' style image.';
            $requirements[] = 'The composition must fit a ' . $dimensions['ratio'] . ' layout.';
            $requirements[] = 'Frame the composition for exactly ' . $dimensions['width'] . ' by ' . $dimensions['height'] . ' output proportions.';
        }

        if ($name) {
            $requirements[] = 'Project name: "' . $name . '".';
            $requirements[] = 'Include only this exact English text in the image: "' . $name . '".';
            $requirements[] = 'Place the project name on the product or packaging in clear English lettering.';
        }

        if ($content) {
            $requirements[] = 'The image must follow this user content exactly: "' . $content . '".';
            $requirements[] = 'Do not ignore, replace, or reinterpret the user content with a different concept.';
        }

        if ($color) {
            $requirements[] = 'Mandatory color rule: the dominant primary color must be ' . $colorDescriptor . '.';
            $requirements[] = 'Use this selected brand color exactly: ' . $color . ' (' . $colorDescriptor . ').';
            $requirements[] = 'The overall palette must stay anchored around ' . $colorDescriptor . '.';
            $requirements[] = 'The dominant accents, lighting accents, and key visual emphasis must use ' . $colorDescriptor . '.';
            $requirements[] = 'Prefer a mostly monochromatic palette centered on ' . $colorDescriptor . ' with only neutral support tones if needed.';
            $restrictions[] = 'Do not switch the dominant palette to pink, rose, purple, magenta, or any unrelated color.';
        }

        if ($colorText) {
            $requirements[] = 'User color instruction: ' . $colorText;
        }

        $requirements[] = 'Priority rule: if any style choice conflicts with the user inputs, obey the user inputs first.';
        $requirements[] = 'Create one coherent image only.';

        $restrictions[] = 'Do not add visual elements that contradict the project name, content, selected color, or layout.';
        $restrictions[] = 'Do not treat the user inputs as optional.';
        $restrictions[] = 'Do not include any text other than the exact project name in English.';

        $promptSections = [
            'STRICT IMAGE GENERATION INSTRUCTIONS.',
            'Follow every user requirement exactly.',
            'Requirements: ' . implode(' ', $requirements),
            'Restrictions: ' . implode(' ', $restrictions),
            'Render quality: high quality, professional, detailed, clean composition.',
        ];

        return implode(' ', array_filter($promptSections));
    }

    // -------------------------------------------------------------------------
    // HELPERS
    // -------------------------------------------------------------------------

    private function resolveDimensions(?string $imageType): array
    {
        return self::IMAGE_DIMENSIONS[$imageType] ?? self::IMAGE_DIMENSIONS['post'];
    }
}