<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use Illuminate\Http\JsonResponse;
class PlanController extends Controller
{
    public function index(): JsonResponse
    {
        $plans = Plan::query()
            ->select([
                'id',
                'name',
                'price',
                'max_generations_image',
                'max_generations_caption',
                'watermark',
                'created_at',
                'updated_at',
            ])
            ->orderBy('price')
            ->get();

        return response()->json([
            'message' => 'Plans retrieved successfully.',
            'data' => [
                'plans' => $plans,
            ],
        ], 200);
    }

    public function show(int $id): JsonResponse
    {
        $plan = Plan::query()
            ->select([
                'id',
                'name',
                'price',
                'max_generations_image',
                'max_generations_caption',
                'watermark',
                'created_at',
                'updated_at',
            ])
            ->find($id);

        if (!$plan) {
            return response()->json([
                'message' => 'Plan not found.',
            ], 404);
        }

        return response()->json([
            'message' => 'Plan retrieved successfully.',
            'data' => [
                'plan' => $plan,
            ],
        ], 200);
    }
}
