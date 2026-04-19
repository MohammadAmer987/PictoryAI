<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CaptionGeneration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\Caption;

//////
class CaptionController extends Controller
{
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

        $image = $request->file('image');

        if (!$image) {
            return response()->json([
                'success' => false,
                'message' => 'Image is required.',
            ], 422);
        }

        $mimeType = $image->getMimeType() ?: 'image/jpeg';
        $imageBase64 = base64_encode(file_get_contents($image->getRealPath()));

        $audience = $validated['target_audience'] ?? 'general audience';
        $tone = $validated['tone'] ?? 'professional';
        $language = $validated['language'] ?? 'English';
        $description = $validated['description'] ?? '';

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
        2. Cute Caption
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
                'model' => 'Qwen/Qwen3-VL-8B-Instruct',
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

        $content = $result['choices'][0]['message']['content'] ?? '';

        preg_match('/1\.\s*Short Caption\s*(.*?)(?=2\.\s*Cute Caption|$)/is', $content, $short);
        preg_match('/2\.\s*Cute Caption\s*(.*?)(?=3\.\s*Advertising Caption|$)/is', $content, $cute);
        preg_match('/3\.\s*Advertising Caption\s*(.*?)(?=4\.\s*Long Caption|$)/is', $content, $advertising);
        preg_match('/4\.\s*Long Caption\s*(.*)$/is', $content, $long);

        $extractTags = function ($text) {
            preg_match_all('/#([\p{L}\p{N}_]+)/u', $text, $matches);
            $tags = $matches[1] ?? [];

            $cleanText = preg_replace('/#([\p{L}\p{N}_]+)/u', '', $text);
            $cleanText = preg_replace('/\s+/', ' ', $cleanText);

            return [
                'content' => trim($cleanText),
                'tags' => array_values(array_unique($tags)),
            ];
        };

        $shortData = $extractTags(trim($short[1] ?? ''));
        $cuteData = $extractTags(trim($cute[1] ?? ''));
        $advertisingData = $extractTags(trim($advertising[1] ?? ''));
        $longData = $extractTags(trim($long[1] ?? ''));

        $captions = [
            [
                'type' => 'Short Caption',
                'icon' => 'bi-lightning-fill',
                'content' => $shortData['content'],
                'tags' => $shortData['tags'],
            ],
            [
                'type' => 'Cute Caption',
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

        $generation = CaptionGeneration::create([
            'product_name' => $validated['product_name'],
            'target_audience' => $validated['target_audience'] ?? null,
            'tone' => $validated['tone'] ?? null,
            'language' => $validated['language'] ?? null,
            'description' => $validated['description'] ?? null,
            'image_path' => $imagePath,
            'raw_text' => $content,
        ]);

        foreach ($captions as $caption) {
            $generation->captions()->create($caption);
        }

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
}
