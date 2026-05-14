<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\CaptionGeneration;
use Illuminate\Http\Request;
use App\Models\Caption;

class HistoryController extends Controller
{
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




}
