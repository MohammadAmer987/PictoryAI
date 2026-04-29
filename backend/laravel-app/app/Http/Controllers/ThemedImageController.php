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
                    'guidance_scale' => 3.5,
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

        $productSubject = "A premium luxury product (hero object)";

        $prompt = "CORE SUBJECT: One single {$productSubject} placed directly on the floor surface. ";
        $prompt .= "PLACEMENT: No pedestal, no stand. The product sits naturally on the ground with realistic soft contact shadows and subtle reflections. ";
        $prompt .= "PROPORTIONS: The product is large and central, occupying 55-60% of the vertical frame, with clear empty space in the upper third for text. ";

        switch ($theme) {
            case "Ramadan":
            case "Eid al-Fitr":
                $prompt .= "BACKGROUND: A dark navy blue floor reflecting the glow of lanterns. Hyper-detailed night sky with shimmering stars. Detailed golden lanterns with intricate filigree patterns hanging at various heights. A large, glowing golden crescent moon and stars suspended. Intricate Arabic geometric patterns decorate the lower corners of the wall. Magical glowing particles in the air.";
                break;

            case "Christmas":
                $prompt .= "BACKGROUND: A rich, matte red floor. The scene is densely framed by highly detailed, lush pine branches at the top and bottom. Hyper-realistic red and silver ornaments with fine textures scattered on the floor and hanging. Tiny, sharp ice crystals and soft snow particles floating in the air. Warm, festive studio lighting.";
                break;

            case "Black Friday":
                $prompt .= "BACKGROUND: A polished black marble floor with sharp reflections. Dark textured charcoal marble wall. Complex explosion of 3D elements: floating matte gold spheres, transparent glass bubbles, gold '$' and '%' symbols, and miniature luxury shopping bags with detailed handles. High-contrast neon-edge lighting.";
                break;

            case "Valentine's Day":
                $prompt .= "BACKGROUND: A soft pink satin-finish floor. Clean pink wall with sharp artistic shadows of botanical leaves. Dozens of red paper hearts of varying sizes hanging on invisible threads. Large hyper-detailed clusters of pink magnolia flowers and roses framing the product on left and right. Soft romantic bokeh.";
                break;

            case "Eid al-Adha":
                $prompt .= "BACKGROUND: A light stone-textured floor. Beige wall with a massive, deeply carved 3D mandala pattern. Rustic rope with small detailed wooden sheep carvings and star medallions draped across. High-detail bowls of glossy dates and traditional prayer bead (Subha) with visible textures in the foreground.";
                break;

            case "Graduation":
                $prompt .= "BACKGROUND: A dark reflective navy floor. Majestic night blue background with sharp God-rays of light beaming from the top. A detailed graduation mortarboard (cap) with silk tassel and a rolled parchment diploma with gold ribbon are placed on the floor next to the product. Glittering gold particles fill the atmosphere. Inspiring and elegant academic mood.";
                break;

            case "New Year":
                $prompt .= "BACKGROUND: A dark polished wood floor. Behind the product is a small vibrant green fir tree with tiny red balls. The entire upper background is filled with massive multi-colored fireworks exploding with sharp light trails. Warm golden bokeh lights (fairy lights) draped in the background. High-energy celebratory mood.";
                break;

            case "Mother's Day":
                $prompt .= "BACKGROUND: Soft luxurious pastel pink studio setting. On the elegant light pink wall behind the product. ";
                $prompt .= "Beautiful branches of blooming pink and white magnolia flowers with highly detailed petals and green leaves gracefully framing the left and right sides of the scene. Several delicate fallen magnolia petals scattered naturally on the floor around the product. ";
                $prompt .= "Soft dreamy cinematic lighting with gentle warm rays, subtle heart-shaped bokeh, elegant and emotional luxury atmosphere, high-end commercial photography style.";
                break;


            case "Back to School":
                $prompt .= "BACKGROUND: A light yellow floor meeting a deep blue chalkboard wall. The background features hand-drawn educational sketches in white chalk. A massive array of hyper-detailed school supplies including a stack of vintage books, sharp pencils, rulers, a compass, and a small globe artistically arranged on the floor around the product. Bright crisp natural lighting.";
                break;
        }

        // ✍️ النص الرئيسي + النص الثانوي
        if (!empty($userText)) {
            $prompt .= " OVERLAY TEXT: In the upper third of the image, VERY LARGE bold premium elegant luxurious minimalist font with the exact text '{$userText}' in bright elegant white color with subtle gold outline or soft glow. ";

            $prompt .= "Directly below the main text, SMALLER elegant sophisticated font with the exact text '{$secondaryText}' in soft pastel gold or warm cream color, perfectly centered and well-spaced. ";

            $prompt .= "The two texts have clear color contrast between them. Main text is brighter and more prominent, secondary text is softer and more delicate. Both texts are highly readable, with subtle soft glow and drop shadow for excellent clarity, positioned with generous clean space above the product, no overlap.";
        }

        $prompt .= " TECHNICAL SPECS: Aspect ratio {$imageSize}. Tack-sharp focus on the product. Hyper-realistic textures, cinematic lighting, ray-tracing reflections on the floor, 8K resolution, commercial luxury product photography style, highly legible text with good color contrast, masterpiece.";

        return trim(preg_replace('/\s+/', ' ', $prompt));
    }

    /**
     * النص الثانوي حسب الثيم
     */
    private function getSecondaryText(string $theme): string
    {
        switch ($theme) {
            case "Ramadan":
            case "Eid al-Fitr":
                return "Happy Eid";

            case "Eid al-Adha":
                return "Happy Eid Al-Adha";

            case "Christmas":
                return "Happy Christmas";

            case "Valentine's Day":
                return "Happy Valentine's Day";

            case "Black Friday":
                return "Big Sale";

            case "Graduation":
                return "Congratulations";

            case "New Year":
                return "Happy New Year";

            case "Mother's Day":
                return "Happy Mother's Day";

            case "Back to School":
                return "Ready for a Great Year";

            default:
                return "";
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
