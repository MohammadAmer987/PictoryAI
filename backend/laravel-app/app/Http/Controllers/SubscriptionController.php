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

    public function upgrade(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'plan_name' => [
                'required',
                'string',
                Rule::exists('plans', 'name'),
            ],
        ]);

        $newPlan = Plan::where('name', $validated['plan_name'])->first();

        $subscription = DB::transaction(function () use ($request, $newPlan) {
            $user = $request->user();

            $currentSubscription = $user->activeSubscription()->first();

            if ($currentSubscription) {
                $currentSubscription->update([
                    'status' => 'expired',
                    'end_date' => now(),
                ]);
            }

            return Subscription::create([
                'user_id' => $user->id,
                'plan_id' => $newPlan->id,
                'start_date' => now(),
                'end_date' => null,
                'status' => 'active',
            ])->load('plan');
        });

        return response()->json([
            'message' => 'Subscription updated successfully.',
            'data' => [
                'subscription' => $subscription,
            ],
        ], 200);
    }
}
