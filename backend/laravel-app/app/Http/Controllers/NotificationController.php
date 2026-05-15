<?php
namespace App\Http\Controllers;
use OpenApi\Attributes as OA;
use Illuminate\Http\Request;



class NotificationController extends Controller
{

    #[OA\Get(
        path: '/api/notifications',
        summary: 'Get usage notifications and limits for the authenticated user',
        security: [['sanctum' => []]],
        tags: ['Notifications'],
        parameters: [],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Usage counters and limits returned successfully',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'success', type: 'boolean', example: true),
                        new OA\Property(
                            property: 'notifications',
                            type: 'array',
                            items: new OA\Items(
                                properties: [
                                    new OA\Property(property: 'type', type: 'string', example: 'caption'),
                                    new OA\Property(property: 'used', type: 'integer', example: 2),
                                    new OA\Property(property: 'limit', type: 'integer', example: 3),
                                    new OA\Property(property: 'remaining', type: 'integer', example: 1),
                                    new OA\Property(property: 'label', type: 'string', example: 'Caption Generator'),
                                ]
                            )
                        ),
                    ]
                )
            ),
            new OA\Response(
                response: 401,
                description: 'Unauthenticated',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'success', type: 'boolean', example: false),
                        new OA\Property(property: 'message', type: 'string', example: 'Unauthenticated.'),
                    ]
                )
            ),
        ]
    )]
    public function index(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated.',
            ], 401);
        }

        $counters = $user->usageCounters()
            ->where('year', now()->year)
            ->where('month', now()->month)
            ->get()
            ->keyBy('type');

        $limits = [
            'caption'       => 3,
            'enhance_image' => 3,
            'themed_image'  => 3,
            'generate_image'  => 3,
        ];

        $notifications = [];

        foreach ($limits as $type => $limit) {
            $used      = $counters[$type]->used ?? 0;
            $remaining = max(0, $limit - $used);

            $notifications[] = [
                'type'      => $type,
                'used'      => $used,
                'limit'     => $limit,
                'remaining' => $remaining,
                'label'     => $this->getLabel($type),
            ];
        }

        return response()->json([
            'success'       => true,
            'notifications' => $notifications,
        ]);
    }

    private function getLabel(string $type): string
    {
        return [
            'caption'       => 'Caption Generator',
            'enhance_image' => 'Enhance Image',
            'themed_image'  => 'Theme Image',
            'generate_image'  => 'Generate Image',
        ][$type] ?? $type;
    }
}
