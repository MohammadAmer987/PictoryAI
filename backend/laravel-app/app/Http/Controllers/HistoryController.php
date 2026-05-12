<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\CaptionGeneration;
use Illuminate\Http\Request;
use App\Models\Caption;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class HistoryController extends Controller
{
    private function deleteStoredImage(?string $path): void
    {
        if (!$path || !is_string($path)) {
            return;
        }

        $normalizedPath = trim($path);

        if ($normalizedPath === '') {
            return;
        }

        if (str_starts_with($normalizedPath, 'http://') || str_starts_with($normalizedPath, 'https://')) {
            return;
        }

        if (Storage::disk('public')->exists($normalizedPath)) {
            Storage::disk('public')->delete($normalizedPath);
        }
    }

    private function sanitizeImagePaths(array $paths): array
    {
        return array_values(array_filter($paths, function ($path) {
            return is_string($path) && trim($path) !== '';
        }));
    }

    private function resolveOriginalImageUrl(?string $sourceImage): ?string
    {
        if (!$sourceImage || !Storage::disk('public')->exists($sourceImage)) {
            return null;
        }

        return asset('storage/' . $sourceImage);
    }

    public function captions(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated',
            ], 401);
        }

        $generations = CaptionGeneration::where('user_id', $user->id)
            ->with('captions')
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'user_id' => $user->id,
            'count' => $generations->count(),
            'data' => $generations->map(function ($generation) {
                return [
                    'id' => $generation->id,
                    'title' => isset($generation->product_name) ? $generation->product_name : 'Generated Caption',
                    'tone' => isset($generation->tone) ? $generation->tone : 'Default',
                    'language' => isset($generation->language) ? $generation->language : 'Unknown',
                    'date' => optional($generation->created_at)->format('Y-m-d'),
                    'items' => $generation->captions->map(function ($caption) {
                        return [
                            'id' => $caption->id,
                            'type' => isset($caption->type) ? $caption->type : 'Caption',
                            'text' => isset($caption->content) ? $caption->content : '',
                            'icon' => $caption->icon,
                            'tags' => $caption->tags,
                        ];
                    })->values(),
                ];
            })->values(),
        ]);
    }

    public function deleteCaptionGroup(Request $request, int $generationId)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated',
            ], 401);
        }

        $generation = CaptionGeneration::where('user_id', $user->id)
            ->where('id', $generationId)
            ->first();

        if (!$generation) {
            return response()->json([
                'success' => false,
                'message' => 'Caption group not found.',
            ], 404);
        }

        DB::transaction(function () use ($generation) {
            Caption::where('caption_generation_id', $generation->id)->delete();
            $generation->delete();
        });

        return response()->json([
            'success' => true,
            'message' => 'Caption group deleted successfully.',
        ]);
    }

    public function images(Request $request)
    {
        $userId = $request->user()->id;

        $enhance = DB::table('enhance_image_requests')
            ->where('user_id', $userId)
            ->get()
            ->map(function ($req) {
                $responses = $this->sanitizeImagePaths(DB::table('enhance_image_responses')
                    ->where('request_id', $req->id)
                    ->orderBy('result_order')
                    ->pluck('image_path')
                    ->toArray());

                if (empty($responses)) {
                    return null;
                }

                return [
                    'id' => 'enhance-' . $req->id,
                    'request_id' => $req->id,
                    'type' => 'enhance',
                    'title' => 'Enhanced Image',
                    'original_image' => $this->resolveOriginalImageUrl($req->source_image),
                    'images' => $responses,
                    'details' => [
                        'product_name' => $req->product_name,
                        'target_audience' => $req->target_audience,
                        'style_type' => $req->style_type,
                        'light_type' => $req->light_type,
                        'background_type' => $req->background_type,
                        'extra_prompt' => $req->extra_prompt,
                    ],
                    'created_at' => $req->created_at,
                ];
            })
            ->filter()
            ->values();

        $themed = DB::table('themed_image_requests')
            ->where('user_id', $userId)
            ->get()
            ->map(function ($req) {
                $responses = $this->sanitizeImagePaths(DB::table('themed_image_responses')
                    ->where('request_id', $req->id)
                    ->orderBy('id')
                    ->pluck('image_path')
                    ->toArray());

                if (empty($responses)) {
                    return null;
                }

                return [
                    'id' => 'theme-' . $req->id,
                    'request_id' => $req->id,
                    'type' => 'theme',
                    'title' => 'Themed Image',
                    'original_image' => $this->resolveOriginalImageUrl($req->source_image),
                    'images' => $responses,
                    'details' => [
                        'theme' => $req->theme,
                        'image_size' => $req->image_size,
                        'optional_text' => $req->optional_text,
                    ],
                    'created_at' => $req->created_at,
                ];
            })
            ->filter()
            ->values();

        $generated = DB::table('image_generation_requests')
            ->where('user_id', $userId)
            ->get()
            ->map(function ($req) {
                $responses = $this->sanitizeImagePaths(DB::table('image_generation_responses')
                    ->where('request_id', $req->id)
                    ->orderBy('result_order')
                    ->pluck('image_path')
                    ->toArray());

                if (empty($responses)) {
                    return null;
                }

                return [
                    'id' => 'generate-' . $req->id,
                    'request_id' => $req->id,
                    'type' => 'generate',
                    'title' => 'Generated Image',
                    'original_image' => null,
                    'images' => $responses,
                    'details' => [
                        'project_name' => $req->project_name,
                        'content' => $req->content,
                        'color' => $req->color,
                        'image_type' => $req->image_type,
                        'prompt_used' => $req->prompt_used,
                    ],
                    'created_at' => $req->created_at,
                ];
            })
            ->filter()
            ->values();

        $images = $enhance
            ->merge($themed)
            ->merge($generated)
            ->sortByDesc('created_at')
            ->values();

        return response()->json([
            'success' => true,
            'data' => $images,
        ]);
    }

    public function deleteImageGroup(Request $request, string $type, int $requestId)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated',
            ], 401);
        }

        $config = [
            'enhance' => [
                'request_table' => 'enhance_image_requests',
                'response_table' => 'enhance_image_responses',
                'request_key' => 'id',
                'response_key' => 'request_id',
                'request_image_column' => 'source_image',
            ],
            'theme' => [
                'request_table' => 'themed_image_requests',
                'response_table' => 'themed_image_responses',
                'request_key' => 'id',
                'response_key' => 'request_id',
                'request_image_column' => 'source_image',
            ],
            'generate' => [
                'request_table' => 'image_generation_requests',
                'response_table' => 'image_generation_responses',
                'request_key' => 'id',
                'response_key' => 'request_id',
                'request_image_column' => null,
            ],
        ];

        if (!isset($config[$type])) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid image history type.',
            ], 422);
        }

        $selectedConfig = $config[$type];

        $requestRecord = DB::table($selectedConfig['request_table'])
            ->where($selectedConfig['request_key'], $requestId)
            ->where('user_id', $user->id)
            ->first();

        if (!$requestRecord) {
            return response()->json([
                'success' => false,
                'message' => 'Image history record not found.',
            ], 404);
        }

        $responseImages = DB::table($selectedConfig['response_table'])
            ->where($selectedConfig['response_key'], $requestId)
            ->pluck('image_path')
            ->toArray();

        DB::transaction(function () use ($selectedConfig, $requestId, $requestRecord, $responseImages) {
            foreach ($responseImages as $imagePath) {
                $this->deleteStoredImage($imagePath);
            }

            $requestImageColumn = $selectedConfig['request_image_column'];
            if ($requestImageColumn && isset($requestRecord->{$requestImageColumn})) {
                $this->deleteStoredImage($requestRecord->{$requestImageColumn});
            }

            DB::table($selectedConfig['response_table'])
                ->where($selectedConfig['response_key'], $requestId)
                ->delete();

            DB::table($selectedConfig['request_table'])
                ->where($selectedConfig['request_key'], $requestId)
                ->delete();
        });

        return response()->json([
            'success' => true,
            'message' => 'Image history deleted successfully.',
        ]);
    }

}
