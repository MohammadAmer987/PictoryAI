<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CaptionGeneration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Services\UsageLimitService;
use Illuminate\Validation\ValidationException;
use OpenApi\Attributes as OA;

class CaptionController extends Controller
{
    #[OA\Post(
        path: '/api/captions/generate',
        operationId: 'generateCaptions',
        summary: 'Generate AI captions from a product image',
        description: 'Generates four marketing captions for a product image using the caption generation tool.',
        tags: ['Tools - Captions'],
        security: [['sanctumBearerAuth' => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\MediaType(
                mediaType: 'multipart/form-data',
                schema: new OA\Schema(
                    required: ['product_name', 'image'],
                    properties: [
                        new OA\Property(property: 'product_name', type: 'string', maxLength: 255, example: 'Luxury Perfume'),
                        new OA\Property(property: 'target_audience', type: 'string', maxLength: 255, example: 'Women aged 20-35'),
                        new OA\Property(property: 'tone', type: 'string', maxLength: 255, example: 'Elegant'),
                        new OA\Property(property: 'language', type: 'string', maxLength: 50, example: 'English'),
                        new OA\Property(property: 'description', type: 'string', maxLength: 200, example: 'A premium floral fragrance for daily wear'),
                        new OA\Property(property: 'image', type: 'string', format: 'binary'),
                    ],
                    type: 'object'
                )
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'Captions generated successfully.'),
            new OA\Response(response: 401, description: 'Unauthenticated.'),
            new OA\Response(response: 403, description: 'Caption generation limit reached.'),
            new OA\Response(response: 422, description: 'Validation failed.')
        ]
    )]
    public function generate(Request $request)
    {


        $validated = $request->validate([
            'product_name' => 'required|string|max:255',
            'target_audience' => 'nullable|string|max:255',
            'tone' => 'nullable|string|max:255',
            'language' => 'nullable|string|max:50',
            'description' => 'nullable|string|max:200',
            'image' => 'required|image|mimes:jpg,jpeg,png,webp|max:10240',
        ]);


        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated.',
            ], 401);
        }

        try {
            app(UsageLimitService::class)->assertCanGenerate($user, 'caption');
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'You have reached your caption generation limit. Please subscribe to continue.',
                'upgrade_required' => true,
                'errors' => $e->errors(),
            ], 403);
        }

        $image = $request->file('image');

        if (!$image) {
            return response()->json([
                'success' => false,
                'message' => 'Image is required.',
            ], 422);
        }

        $mimeType = $image->getMimeType() ?: 'image/jpeg';
        $imageBase64 = base64_encode(file_get_contents($image->getRealPath()));

        $audience = isset($validated['target_audience']) ? $validated['target_audience'] : 'general audience';
        $tone = isset($validated['tone']) ? $validated['tone'] : 'professional';
        $language = isset($validated['language']) ? $validated['language'] : 'English';
        $description = isset($validated['description']) ? $validated['description'] : '';

        $prompt = "
        You are a professional social media manager.
        Analyze the uploaded product image carefully, then generate 4 distinct captions for the product.

        Product: {$validated['product_name']}
        Audience: {$audience}
        Tone: {$tone}
        Language: {$language}
        Description: {$description}

        Return in this exact format:
        1. Short Caption
        2. Creative Caption
        3. Advertising Caption
        4. Long Caption

        Include relevant hashtags naturally for each caption.
        ";

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . env('HF_CAPTIONS_TOKEN'),
            'Content-Type' => 'application/json',
        ])
            ->timeout(120)
            ->connectTimeout(30)
            ->post('https://router.huggingface.co/v1/chat/completions', [
                'model' => 'Qwen/Qwen3-VL-8B-Instruct:cheapest',
                'messages' => [
                    [
                        'role' => 'user',
                        'content' => [
                            [
                                'type' => 'text',
                                'text' => $prompt,
                            ],
                            [
                                'type' => 'image_url',
                                'image_url' => [
                                    'url' => 'data:' . $mimeType . ';base64,' . $imageBase64,
                                ],
                            ],
                        ],
                    ],
                ],
                'max_tokens' => 500,
            ]);

        $result = $response->json();

        if (!$response->successful()) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to generate captions.',
                'error' => $result,
            ], $response->status());
        }

        $content = isset($result['choices'][0]['message']['content']) ? $result['choices'][0]['message']['content'] : '';

        preg_match('/1\.\s*(.*?)(?=2\.|$)/is', $content, $short);
        preg_match('/2\.\s*(.*?)(?=3\.|$)/is', $content, $cute);
        preg_match('/3\.\s*(.*?)(?=4\.|$)/is', $content, $advertising);
        preg_match('/4\.\s*(.*)$/is', $content, $long);

        $extractTags = function ($text) {
            preg_match_all('/#([\p{L}\p{N}_]+)/u', $text, $matches);
            $tags = isset($matches[1]) ? $matches[1] : [];

            $cleanText = preg_replace('/#([\p{L}\p{N}_]+)/u', '', $text);

            // Remove caption type from the beginning of content
            $cleanText = preg_replace(
                '/^\s*(?:[-–—*•\d.()\s]*)?(?:Short Caption|Creative Caption|Advertising Caption|Long Caption|الكابشن\s*القصير|الكابشن\s*الإبداعي|الكابشن\s*الابداعي|الكابشن\s*الإعلاني|الكابشن\s*الاعلاني|الكابشن\s*الطويل|الإبداعي|الابداعي|الإعلاني|الاعلاني|القصير|الطويل)\s*[:：\-–—]*\s*/iu',
                '',
                $cleanText
            );

            $cleanText = preg_replace('/\s+/', ' ', $cleanText);

            return [
                'content' => trim($cleanText),
                'tags' => array_values(array_unique($tags)),
            ];
        };

        $shortData = $extractTags(trim(isset($short[1]) ? $short[1] : ''));
        $cuteData = $extractTags(trim(isset($cute[1]) ? $cute[1] : ''));
        $advertisingData = $extractTags(trim(isset($advertising[1]) ? $advertising[1] : ''));
        $longData = $extractTags(trim(isset($long[1]) ? $long[1] : ''));

        $captions = [
            [
                'type' => 'Short Caption',
                'icon' => 'bi-lightning-fill',
                'content' => $shortData['content'],
                'tags' => $shortData['tags'],
            ],
            [
                'type' => 'Creative Caption',
                'icon' => 'bi-heart-fill',
                'content' => $cuteData['content'],
                'tags' => $cuteData['tags'],
            ],
            [
                'type' => 'Advertising Caption',
                'icon' => 'bi-megaphone-fill',
                'content' => $advertisingData['content'],
                'tags' => $advertisingData['tags'],
            ],
            [
                'type' => 'Long Caption',
                'icon' => 'bi-card-text',
                'content' => $longData['content'],
                'tags' => $longData['tags'],
            ],
        ];

        $imagePath = $image->store('caption-images', 'public');


        $generation = $request->user()->captionGenerations()->create([
            'product_name' => $validated['product_name'],
            'target_audience' => isset($validated['target_audience']) ? $validated['target_audience'] : null,
            'tone' => isset($validated['tone']) ? $validated['tone'] : null,
            'language' => isset($validated['language']) ? $validated['language'] : null,
            'description' => isset($validated['description']) ? $validated['description'] : null,
            'image_path' => $imagePath,
            'raw_text' => $content,
        ]);

        foreach ($captions as $caption) {
            $generation->captions()->create($caption);
        }
        app(UsageLimitService::class)->increment($user, 'caption');

        return response()->json([
            'success' => true,
            'message' => 'AI captions generated successfully.',
            'data' => [
                'generation_id' => $generation->id,
                'captions' => $generation->captions,
                'raw_text' => $content,
                'image_url' => asset('storage/' . $imagePath),
            ],
        ]);

    }

    #[OA\Get(
        path: '/api/captions/my-plan',
        operationId: 'getCaptionGeneratingPlan',
        summary: 'Get current user caption plan',
        description: 'Returns the current subscription plan details relevant to the caption generation tool.',
        tags: ['Tools - Captions'],
        security: [['sanctumBearerAuth' => []]],
        responses: [
            new OA\Response(response: 200, description: 'Current plan retrieved successfully.'),
            new OA\Response(response: 401, description: 'Unauthenticated.')
        ]
    )]
    public function myPlan(Request $request)
    {
        $subscription = $request->user()
            ->activeSubscription()
            ->with('plan')
            ->first();

        return response()->json([
            'success' => true,
            'data' => [
                'plan' => isset($subscription->plan->name) ? $subscription->plan->name : 'free',
                'is_premium' => strtolower(isset($subscription->plan->name) ? $subscription->plan->name : 'free') === 'premium',
            ],
        ]);
    }

}
