<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;

class ImageGeneratorControllerFixed extends Controller
{
    private const IMAGE_DIMENSIONS = [
        'post'      => ['width' => 1024, 'height' => 1024, 'ratio' => '1:1'],
        'story'     => ['width' => 1024, 'height' => 1792, 'ratio' => '9:16'],
        'banner'    => ['width' => 1792, 'height' => 1024, 'ratio' => '16:9'],
        'portrait'  => ['width' => 1024, 'height' => 1280, 'ratio' => '4:5'],
        'landscape' => ['width' => 1536, 'height' => 1024, 'ratio' => '3:2'],
        'cinema'    => ['width' => 1792, 'height' => 768,  'ratio' => '21:9'],
    ];

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
        $queryParams      = [
            'width' => $dimensions['width'],
            'height' => $dimensions['height'],
            'nologo' => 'true',
            'seed' => $seed,
        ];

        if ($pollinationsKey !== '') {
            $queryParams['key'] = $pollinationsKey;
        }

        $query     = http_build_query($queryParams);
        $imageUrls = $this->buildPollinationsUrls($prompt, $query);

        [$probeResponse, $imageUrl] = $this->executePollinationsRequest($imageUrls);

        if ($probeResponse->status() === 429) {
            $message = data_get($probeResponse->json(), 'message')
                ?: 'The free image service is busy right now. Please wait a moment and try again.';

            return response()->json([
                'success' => false,
                'error' => $message,
            ], 429);
        }

        if ($probeResponse->failed()) {
            return response()->json([
                'success' => false,
                'error' => $this->extractPollinationsError($probeResponse),
            ], 500);
        }

        $imageRequest = \App\Models\ImageGenerationRequest::create([
            'user_id' => $request->user()->id,
            'project_name' => $request->projectName,
            'content' => $request->content,
            'color' => $selectedColor,
            'image_type' => $imageType,
            'prompt_used' => $prompt,
        ]);

        \App\Models\ImageGenerationResponse::create([
            'request_id' => $imageRequest->id,
            'image_path' => $imageUrl,
            'result_order' => 1,
        ]);

        return response()->json([
            'success' => true,
            'image' => 'data:' . $probeResponse->header('Content-Type', 'image/jpeg') . ';base64,' . base64_encode($probeResponse->body()),
            'image_url' => $imageUrl,
            'color' => $selectedColor,
            'image_type' => $imageType,
            'size' => [
                'width' => $dimensions['width'],
                'height' => $dimensions['height'],
                'ratio' => $dimensions['ratio'],
            ],
            'prompt' => $prompt,
            'seed' => $seed,
            'provider' => 'pollinations',
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
            $lockPath = storage_path('framework/cache/pollinations-image.lock');
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
                        $lastResponse = Http::timeout(20)->get($imageUrl);
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

