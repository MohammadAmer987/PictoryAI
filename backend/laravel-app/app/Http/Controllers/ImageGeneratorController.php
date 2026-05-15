<?php

declare(strict_types=1);
namespace App\Http\Controllers;
use OpenApi\Attributes as OA;
use Illuminate\Http\Request;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;

use App\Services\UsageLimitService;
use Illuminate\Validation\ValidationException;

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
 #[OA\Post(
        path: '/api/image-generator/generate',
        summary: 'Generate an AI image based on project details',
        description: 'Generates a professional AI image using Pollinations API based on project name, content, color, and image type. Returns base64 image data along with metadata.',
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
                            description: 'Original Pollinations image URL',
                            example: 'https://image.pollinations.ai/prompt/...'
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
                        new OA\Property(property: 'prompt', type: 'string', description: 'The full prompt sent to the AI', example: 'STRICT IMAGE GENERATION INSTRUCTIONS...'),
                        new OA\Property(property: 'seed', type: 'integer', description: 'Random seed used for generation', example: 482910573),
                        new OA\Property(property: 'provider', type: 'string', example: 'pollinations'),
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
                response: 429,
                description: 'Image service is busy (queue full)',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'success', type: 'boolean', example: false),
                        new OA\Property(property: 'error', type: 'string', example: 'The free image service is busy right now. Please wait a moment and try again.'),
                    ]
                )
            ),
            new OA\Response(
                response: 500,
                description: 'Server or generation error',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'success', type: 'boolean', example: false),
                        new OA\Property(property: 'error', type: 'string', example: 'Image request failed on the server.'),
                    ]
                )
            ),
            new OA\Response(response: 401, description: 'Unauthenticated'),
        ]
    )]
    public function generate(Request $request)
    {
        try {
            $request->validate([
                'projectName' => 'required|string|max:255',
                'content'     => 'nullable|string|max:1000',
                'color'       => 'nullable|string|max:100',
                'colorText'   => 'nullable|string|max:255',
                'imageType'   => 'nullable|string|in:post,story,banner,portrait,landscape,cinema',
            ]);

            $user = $request->user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated.',
                ], 401);
            }

            try {
                app(UsageLimitService::class)->assertCanGenerate($user, 'image');
            } catch (ValidationException $e) {
                return response()->json([
                    'success' => false,
                    'message' => 'You have reached your image generation limit. Please subscribe to continue.',
                    'upgrade_required' => true,
                    'errors' => $e->errors(),
                ], 403);
            }

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

            return $this->generateWithPollinations(
                $prompt,
                $selectedColor,
                $colorDescriptor,
                $request->imageType ?? 'post',
                $dimensions,
                $seed,
                $request
            );
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'error'   => 'Image request failed on the server. ' . $e->getMessage(),
            ], 500);
        }
    }

    private function buildPrompt($name, $content, $color, $colorDescriptor, $imageType, $colorText = null): string
    {
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

    private function resolveDimensions(?string $imageType): array
    {
        return self::IMAGE_DIMENSIONS[$imageType] ?? self::IMAGE_DIMENSIONS['post'];
    }

    private function generateWithPollinations(
        string $prompt,
        ?string $selectedColor,
        string $colorDescriptor,
        string $imageType,
        array $dimensions,
        int $seed,
        Request $request
    ) {
        $pollinationsKey = trim((string) config('services.pollinations.key'));

        $queryParams = [
            'width'  => $dimensions['width'],
            'height' => $dimensions['height'],
            'nologo' => 'true',
            'seed'   => $seed,
        ];

        if ($pollinationsKey !== '') {
            $queryParams['key'] = $pollinationsKey;
        }

        $query = http_build_query($queryParams);
        $imageUrls = $this->buildPollinationsUrls($prompt, $query);

        [$probeResponse, $imageUrl] = $this->executePollinationsRequest($imageUrls);

        if ($probeResponse->status() === 429) {
            $message = data_get($probeResponse->json(), 'message')
                ?: 'The free image service is busy right now. Please wait a moment and try again.';

            return response()->json([
                'success' => false,
                'error'   => $message,
            ], 429);
        }

        if ($probeResponse->failed()) {
            return response()->json([
                'success' => false,
                'error'   => $this->extractPollinationsError($probeResponse),
            ], 500);
        }

        $user = $request->user();

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

        app(UsageLimitService::class)->increment($user, 'image');

        return response()->json([
            'success'    => true,
            'image'      => 'data:' . $probeResponse->header('Content-Type', 'image/jpeg') . ';base64,' . base64_encode($probeResponse->body()),
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
            'provider'   => 'pollinations',
        ]);
    }

    private function buildPollinationsUrls(string $prompt, string $query): array
    {
        $encodedPrompt = rawurlencode($prompt);

        return [
            'https://image.pollinations.ai/prompt/' . $encodedPrompt . '?' . $query,
        ];
    }

    private function executePollinationsRequest(array $imageUrls): array
    {
        $lockHandle = null;
        $lastConnectionMessage = null;

        try {
            $lockPath      = storage_path('framework/cache/pollinations-image.lock');
            $lockDirectory = dirname($lockPath);

            if (!is_dir($lockDirectory)) {
                mkdir($lockDirectory, 0777, true);
            }

            $lockHandle = fopen($lockPath, 'c+');

            if ($lockHandle !== false) {
                flock($lockHandle, LOCK_EX);
            }

            $attemptDelays = [0, 8, 15];
            $lastResponse  = null;

            foreach ($imageUrls as $imageUrl) {
                foreach ($attemptDelays as $delaySeconds) {
                    if ($delaySeconds > 0) {
                        sleep($delaySeconds);
                    }

                    try {
                        $lastResponse = Http::timeout(120)
                            ->connectTimeout(15)
                            ->get($imageUrl);
                    } catch (ConnectionException $e) {
                        $lastConnectionMessage = $e->getMessage();
                        continue;
                    }

                    if (!$this->isPollinationsQueueFull($lastResponse)) {
                        return [$lastResponse, $imageUrl];
                    }
                }
            }

            if ($lastResponse) {
                return [$lastResponse, $imageUrls[0]];
            }

            throw new \RuntimeException(
                $lastConnectionMessage ?: 'Pollinations endpoint is temporarily unreachable.'
            );
        } finally {
            if (is_resource($lockHandle)) {
                flock($lockHandle, LOCK_UN);
                fclose($lockHandle);
            }
        }
    }

    private function isPollinationsQueueFull($response): bool
    {
        if ($response->status() !== 429) {
            return false;
        }

        $message = data_get($response->json(), 'message');

        if (!$message) {
            $message = (string) $response->body();
        }

        return str_contains($message, 'Queue full for IP');
    }

    private function extractPollinationsError($response): string
    {
        $json = $response->json();

        $jsonMessage = null;

        if (is_array($json)) {
            $jsonMessage = data_get($json, 'message') ?: data_get($json, 'error');
        }

        if (is_string($jsonMessage) && $jsonMessage !== '') {
            return $jsonMessage;
        }

        $body = trim((string) $response->body());

        if ($body !== '') {
            return 'Pollinations error (' . $response->status() . '): ' . $body;
        }

        return 'Pollinations error (' . $response->status() . '). Please try again.';
    }
}