<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;

class ThemedImageController extends Controller
{
    public function edit(Request $request)
    {
        set_time_limit(0);

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

        $subscription = $user->subscriptions()
            ->where('status', 'active')
            ->latest()
            ->first();

        $planId = $subscription?->plan_id ?? 1;

        if ($planId == 1) {
            $usageCounter = $user->usageCounters()
                ->where('type', 'themed_image')
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

            if ($planId == 1) {
                $user->usageCounters()->updateOrCreate(
                    [
                        'type'  => 'themed_image',
                        'year'  => now()->year,
                        'month' => now()->month,
                    ],
                    ['used' => DB::raw('used + 1')]
                );
            }

            foreach ($editedUrls as $index => $url) {
                $requestModel->responses()->create([
                    'image_path'   => $url,
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
        $themeConfig = $this->getThemeConfig($theme);

        // Product: preserve identity but allow quality enhancement
        $prompt = "PRODUCT: The reference product may be a low-quality or non-professional photo. ";
        $prompt .= "Re-render it with clean crisp edges, professional studio-quality finish, accurate label clarity, and natural material textures. ";
        $prompt .= "PRESERVE EXACTLY: the product shape, label design, brand colors, and overall form. Do NOT change the product identity. ";

        // Replace background with themed scene
        $prompt .= "BACKGROUND: Completely replace the entire background and environment with a dramatic luxury marketing scene. ";
        $prompt .= "SCENE ELEMENTS: Naturally place these themed decorative elements around the product: {$themeConfig['elements']}. ";
        $prompt .= "SURFACE: Place the product on {$themeConfig['surface']}. Natural contact shadow underneath. No pedestal. ";
        $prompt .= "ATMOSPHERE: {$themeConfig['atmosphere']}. ";
        $prompt .= "LIGHTING: {$themeConfig['lighting']}. ";

        // Optional text overlay
        if (!empty($userText)) {
            $prompt .= "TEXT: Show '{$userText}' in large bold luxury serif font at the top. ";
            if (!empty($secondaryText)) {
                $prompt .= "Below it show '{$secondaryText}' in smaller elegant font. ";
            }
            $prompt .= "White text with subtle glow. Centered. Never touching the product. ";
        }

        // Style
        $prompt .= "STYLE: Luxury high-end commercial advertisement. ";
        $prompt .= "Cinematic color grading with RICH DEEP COLORS. ";
        $prompt .= "STRONG contrast between bright highlights and deep dark shadows. ";
        $prompt .= "Vivid saturated colors. Dramatic mood lighting. Bokeh background elements. ";
        $prompt .= "Shot on Hasselblad medium format camera. ";
        $prompt .= "QUALITY: 8K ultra sharp, ray-traced reflections, aspect ratio {$imageSize}.";

        return trim(preg_replace('/\s+/', ' ', $prompt));
    }
    private function getThemeConfig(string $theme): array
    {
        $configs = [
            "Christmas" => [
                "elements" => "Christmas tree, wrapped gift boxes, golden baubles and ornaments, pine cones, candy canes, string lights, falling snowflakes, red ribbons, holly leaves with red berries",
                "surface"  => "snow-dusted wooden surface with pine needle sprigs scattered around",
                "atmosphere" => "cozy festive winter night atmosphere, light snow particles in the air",
                "lighting" => "warm golden candlelight mixed with twinkling string light bokeh",
            ],

            "Ramadan" => [
                "elements" => "ornate crescent moon and star, decorative lanterns (fanoos), geometric Islamic pattern tiles, prayer beads (misbaha), dates and dried figs in a decorative bowl, hanging fabric with geometric embroidery, mosque silhouette in background",
                "surface"  => "richly decorated Arabic mosaic tiles with geometric patterns",
                "atmosphere" => "peaceful evening atmosphere, soft crescent moon glow in background",
                "lighting" => "warm amber glow from multiple ornate lanterns, soft candlelight accents",
            ],

            "Eid al-Fitr" => [
                "elements" => "ornate fanoos lanterns, crescent moon, scattered rose petals, gift boxes wrapped in luxurious fabric, decorative sweets and ma'amoul cookies on a platter, string lights, silk ribbons, traditional embroidered fabric",
                "surface"  => "polished marble surface with scattered rose petals and gold coins",
                "atmosphere" => "joyful celebratory evening, golden hour glow, festive and elegant",
                "lighting" => "rich golden celebratory light, lantern bokeh in background, warm and glowing",
            ],

            "Eid al-Adha" => [
                "elements" => "crescent moon and stars, ornate geometric patterns, lush green and gold decorative elements, incense burner (mabkhara), traditional Arabic coffee set (dallah), scattered rose water petals, ornate Islamic geometric tiles",
                "surface"  => "carved stone surface with Arabic geometric engravings",
                "atmosphere" => "majestic sacred atmosphere, warm desert sunset tones in background",
                "lighting" => "deep golden warm light, dramatic directional shadows, rich jewel tones",
            ],

            "Valentine's Day" => [
                "elements" => "scattered red and pink rose petals, long stem red roses, floating heart shapes, small gift box with satin ribbon, candles, dried eucalyptus sprigs, pearl accents",
                "surface"  => "dark velvet surface scattered with rose petals and pearl drops",
                "atmosphere" => "intimate romantic atmosphere, soft dreamy bokeh, elegant and passionate",
                "lighting" => "soft warm candlelight, gentle pink and red tones, gentle flare effects",
            ],

            "Black Friday" => [
                "elements" => "scattered shopping bags with logos, floating price tags and discount ribbons, stack of cash and gold coins, lightning bolt graphic elements, bold geometric shapes, sparkling confetti particles",
                "surface"  => "sleek high-gloss black lacquered surface with reflection",
                "atmosphere" => "high-energy bold commercial atmosphere, powerful and exciting",
                "lighting" => "dramatic studio lighting, strong edge highlights, bright direct beam on product",
            ],

            "New Year" => [
                "elements" => "exploding fireworks bursts, gold and silver confetti rain, champagne flutes, glitter dust, countdown clock, celebratory ribbon streamers, glowing sparklers, floating balloons",
                "surface"  => "reflective black glass surface catching firework reflections and confetti",
                "atmosphere" => "euphoric midnight celebration atmosphere, sparkle and energy everywhere",
                "lighting" => "brilliant multicolor firework light bursts, silver and gold glitter light rays",
            ],

            "Graduation" => [
                "elements" => "graduation cap (mortarboard) with tassel, rolled diploma with gold ribbon, scattered confetti, academic laurel wreaths, golden star elements, open book, floating graduation caps in background",
                "surface"  => "polished wooden surface with scattered confetti and gold star shapes",
                "atmosphere" => "triumphant celebratory atmosphere, achievement and pride, uplifting",
                "lighting" => "bright optimistic daylight feel, golden sunrays, warm celebration tones",
            ],

            "Mother's Day" => [
                "elements" => "fresh blooming flowers (peonies, tulips, roses), wrapped gift with satin bow, heart shaped elements, scattered flower petals, elegant ribbon, butterfly accents, soft lace fabric in background",
                "surface"  => "light pastel surface with scattered fresh flower petals and soft leaves",
                "atmosphere" => "tender warm and loving atmosphere, soft spring morning feel, gentle and elegant",
                "lighting" => "soft diffused spring light, gentle warm tones, beautiful flower bokeh",
            ],

            "Back to School" => [
                "elements" => "stack of textbooks, pencils and colored markers, ruler and compass, apple, open notebook with pages, backpack, small globe, paper plane",
                "surface"  => "wooden school desk surface with scattered pencil shavings and paper scraps",
                "atmosphere" => "fresh energetic new beginning atmosphere, youthful and optimistic",
                "lighting" => "bright clear morning daylight, clean crisp shadows, vibrant and sharp",
            ],
        ];

        return $configs[$theme] ?? [
            "elements"   => "elegant abstract luxury decorative elements, gold geometric shapes, scattered light particles",
            "surface"    => "polished dark surface with subtle reflection",
            "atmosphere" => "premium luxury commercial atmosphere",
            "lighting"   => "dramatic studio lighting with sharp highlights",
        ];
    }

    private function getSecondaryText(string $theme): string
    {
        $texts = [
            "Ramadan"       => "Ramadan Kareem",
            "Eid al-Fitr"   => "Happy Eid",
            "Eid al-Adha"   => "Happy Eid Al-Adha",
            "Christmas"     => "Merry Christmas",
            "Valentine's Day" => "With Love",
            "Black Friday"  => "Exclusive Offer",
            "Graduation"    => "Class of 2026",
            "New Year"      => "Happy New Year",
            "Mother's Day"  => "Happy Mother's Day",
            "Back to School" => "Ready to Learn",
        ];

        return $texts[$theme] ?? "";
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
