<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\CaptionGeneration;
use Illuminate\Http\Request;
use App\Models\Caption;

class HistoryController extends Controller
{

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class HistoryController extends Controller
{
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


}
