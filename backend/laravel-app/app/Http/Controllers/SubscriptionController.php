<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use App\Models\Subscription;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class SubscriptionController extends Controller
{
    public function current(Request $request): JsonResponse
    {
        $subscription = $request->user()
            ->activeSubscription()
            ->with('plan')
            ->first();

        return response()->json([
            'message' => 'Current subscription retrieved successfully.',
            'data' => [
                'subscription' => $subscription,
            ],
        ], 200);
    }

    public function history(Request $request): JsonResponse
    {
        $subscriptions = $request->user()
            ->subscriptions()
            ->with('plan')
            ->latest('start_date')
            ->get();

        return response()->json([
            'message' => 'Subscription history retrieved successfully.',
            'data' => [
                'subscriptions' => $subscriptions,
            ],
        ], 200);
    }

    public function upgrade(Request $request)
{
    $user = $request->user();

    $premiumPlan = Plan::where('name', 'premium')->first();

    if (!$premiumPlan) {
        return response()->json([
            'message' => 'Premium plan not found.',
        ], 404);
    }

    $subscription = Subscription::updateOrCreate(
        [
            'user_id' => $user->id,
            'status' => 'active',
        ],
        [
            'plan_id' => $premiumPlan->id,
            'start_date' => now(),
            'end_date' => null,
            'status' => 'active',
        ]
    );

    return response()->json([
        'message' => 'Subscription upgraded successfully.',
        'data' => [
            'subscription' => $subscription->load('plan'),
        ],
    ]);
}

}
