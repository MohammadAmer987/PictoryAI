<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use App\Models\Subscription;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use OpenApi\Attributes as OA;

class SubscriptionController extends Controller
{
    #[OA\Get(
        path: '/subscriptions/current',
        summary: 'Get current user subscription',
        description: 'Retrieves the currently active subscription for the authenticated user',
        tags: ['Subscriptions'],
        security: [['sanctumBearerAuth' => []]],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Current subscription retrieved successfully',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'message', type: 'string', example: 'Current subscription retrieved successfully.'),
                        new OA\Property(
                            property: 'data',
                            type: 'object',
                            properties: [
                                new OA\Property(property: 'subscription', ref: '#/components/schemas/Subscription'),
                            ]
                        ),
                    ]
                )
            ),
        ]
    )]
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

    #[OA\Get(
        path: '/subscriptions/history',
        summary: 'Get subscription history',
        description: 'Retrieves all past and current subscriptions for the authenticated user',
        tags: ['Subscriptions'],
        security: [['sanctumBearerAuth' => []]],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Subscription history retrieved successfully',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'message', type: 'string', example: 'Subscription history retrieved successfully.'),
                        new OA\Property(
                            property: 'data',
                            type: 'object',
                            properties: [
                                new OA\Property(
                                    property: 'subscriptions',
                                    type: 'array',
                                    items: new OA\Items(ref: '#/components/schemas/Subscription')
                                ),
                            ]
                        ),
                    ]
                )
            ),
        ]
    )]
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

    #[OA\Post(
        path: '/subscriptions/upgrade',
        summary: 'Upgrade user subscription to premium',
        description: 'Upgrades the user\'s subscription to the premium plan',
        tags: ['Subscriptions'],
        security: [['sanctumBearerAuth' => []]],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Subscription upgraded successfully',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'message', type: 'string', example: 'Subscription upgraded successfully.'),
                        new OA\Property(
                            property: 'data',
                            type: 'object',
                            properties: [
                                new OA\Property(property: 'subscription', ref: '#/components/schemas/Subscription'),
                            ]
                        ),
                    ]
                )
            ),
            new OA\Response(
                response: 404,
                description: 'Premium plan not found',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'message', type: 'string', example: 'Premium plan not found.'),
                    ]
                )
            ),
        ]
    )]
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
