<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;

class NotificationController extends Controller
{
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
            'caption'       => 5,
            'enhance_image' => 3,
            'themed_image'  => 3,
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
        ][$type] ?? $type;
    }
}
