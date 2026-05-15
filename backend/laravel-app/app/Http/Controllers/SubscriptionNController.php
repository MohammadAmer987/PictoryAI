<?php

namespace App\Http\Controllers;
use OpenApi\Attributes as OA;
use Illuminate\Http\Request;

class SubscriptionNController extends Controller
{
    #[OA\Get(
        path: '/api/subscription',
        summary: 'Get current user subscription status',
        security: [['bearerAuth' => []]],
        tags: ['Subscription'],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Subscription status retrieved successfully',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(
                            property: 'isPro',
                            type: 'boolean',
                            description: 'Whether the user has a Pro subscription',
                            example: true
                        ),
                    ]
                )
            ),
            new OA\Response(
                response: 401,
                description: 'Unauthenticated',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'message', type: 'string', example: 'Unauthenticated.')
                    ]
                )
            ),
        ]
    )]
    public function subscription(Request $request) {
        $user = $request->user();

        $subscription = \App\Models\Subscription::where('user_id', $user->id)
            ->latest('start_date')
            ->first();

        $isPro = $subscription && $subscription->plan_id === 2;

        return response()->json([
            'isPro' => $isPro,
        ]);
    }
}
