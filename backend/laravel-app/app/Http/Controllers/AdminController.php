<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Plan;
use App\Models\CaptionGeneration;
use App\Models\EnhanceImageRequest;
use App\Models\ImageGenerationRequest;
use App\Models\ThemedImageRequest;
use App\Models\UsageCounter;
use Illuminate\Support\Facades\DB;
use OpenApi\Attributes as OA;

class AdminController extends Controller
{
    #[OA\Get(
        path: '/admin/users',
        summary: 'Get all users',
        description: 'Retrieves a list of all regular users with their profiles, subscriptions, and usage data. Admin only.',
        tags: ['Admin - Users'],
        security: [['sanctumBearerAuth' => []]],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Users retrieved successfully',
                content: new OA\JsonContent(
                    type: 'array',
                    items: new OA\Items(
                        properties: [
                            new OA\Property(property: 'id', type: 'integer'),
                            new OA\Property(property: 'name', type: 'string'),
                            new OA\Property(property: 'email', type: 'string', format: 'email'),
                            new OA\Property(property: 'storeName', type: 'string'),
                            new OA\Property(property: 'businessType', type: 'string'),
                            new OA\Property(property: 'plan', type: 'string'),
                            new OA\Property(property: 'status', type: 'string'),
                            new OA\Property(property: 'joinedAt', type: 'string', format: 'date'),
                            new OA\Property(property: 'isVerified', type: 'boolean'),
                            new OA\Property(property: 'lastLoginAt', type: 'string'),
                        ]
                    )
                )
            ),
        ]
    )]
    public function getAllUsers()
    {
        $users = User::with(['profile', 'activeSubscription.plan', 'usageCounters'])
            ->where('role_id', 2) // Only regular users, not admins
            ->get()
            ->map(function ($user) {
                return $this->formatUserData($user);
            });

        return response()->json($users);
    }

    #[OA\Get(
        path: '/admin/dashboard/stats',
        summary: 'Get dashboard statistics',
        description: 'Retrieves dashboard statistics including total users, active users, and premium users. Admin only.',
        tags: ['Admin - Dashboard'],
        security: [['sanctumBearerAuth' => []]],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Dashboard statistics retrieved successfully',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'totalUsers', type: 'integer', example: 100),
                        new OA\Property(property: 'activeUsers', type: 'integer', example: 85),
                        new OA\Property(property: 'premiumUsers', type: 'integer', example: 35),
                    ]
                )
            ),
        ]
    )]
    public function getDashboardStats()
    {
        $totalUsers = User::where('role_id', 2)->count();
        
        $activeUsers = User::where('role_id', 2)
            ->whereHas('activeSubscription', function ($query) {
                $query->where('status', 'active');
            })
            ->count();

        $premiumUsers = User::where('role_id', 2)
            ->whereHas('activeSubscription', function ($query) {
                $query->whereHas('plan', function ($q) {
                    $q->where('name', '!=', 'Free');
                });
            })
            ->count();

        return response()->json([
            'totalUsers' => $totalUsers,
            'activeUsers' => $activeUsers,
            'premiumUsers' => $premiumUsers,
        ]);
    }

    #[OA\Get(
        path: '/admin/analytics',
        summary: 'Get feature analytics',
        description: 'Retrieves feature usage analytics including statistics for image generation, caption generation, and other tools. Admin only.',
        tags: ['Admin - Analytics'],
        security: [['sanctumBearerAuth' => []]],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Analytics retrieved successfully',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(
                            property: 'overview',
                            type: 'array',
                            items: new OA\Items(
                                properties: [
                                    new OA\Property(property: 'label', type: 'string'),
                                    new OA\Property(property: 'value', type: 'integer'),
                                    new OA\Property(property: 'detail', type: 'string'),
                                    new OA\Property(property: 'icon', type: 'string'),
                                ]
                            )
                        ),
                        new OA\Property(
                            property: 'featureStats',
                            type: 'array',
                            items: new OA\Items(
                                properties: [
                                    new OA\Property(property: 'name', type: 'string'),
                                    new OA\Property(property: 'users', type: 'integer'),
                                    new OA\Property(property: 'total', type: 'integer'),
                                    new OA\Property(property: 'icon', type: 'string'),
                                    new OA\Property(property: 'color', type: 'string'),
                                ]
                            )
                        ),
                        new OA\Property(
                            property: 'monthlyData',
                            type: 'array',
                            items: new OA\Items(
                                properties: [
                                    new OA\Property(property: 'month', type: 'string'),
                                    new OA\Property(property: 'users', type: 'integer'),
                                ]
                            )
                        ),
                    ]
                )
            ),
        ]
    )]
    public function getAnalytics()
    {
        // Total usage stats
        $totalRegisteredUsers = User::where('role_id', 2)->count();
        $totalFeatureUsage = $this->getTotalFeatureUsage();

        // Feature-specific stats
        $imageGenerationUsers = ImageGenerationRequest::distinct('user_id')->count();
        $imageGenerationTotal = ImageGenerationRequest::count();

        $enhanceImageUsers = EnhanceImageRequest::distinct('user_id')->count();
        $enhanceImageTotal = EnhanceImageRequest::count();

        $themedImageUsers = ThemedImageRequest::distinct('user_id')->count();
        $themedImageTotal = ThemedImageRequest::count();

        $captionUsers = CaptionGeneration::distinct('user_id')->count();
        $captionTotal = CaptionGeneration::count();

        $featureStats = [
            [
                'name' => 'Image Generation',
                'users' => $imageGenerationUsers,
                'total' => $imageGenerationTotal,
                'icon' => 'Image',
                'color' => '#376359',
            ],
            [
                'name' => 'Image Enhancement',
                'users' => $enhanceImageUsers,
                'total' => $enhanceImageTotal,
                'icon' => 'Sparkles',
                'color' => '#5f8f83',
            ],
            [
                'name' => 'Theme Image',
                'users' => $themedImageUsers,
                'total' => $themedImageTotal,
                'icon' => 'Layers',
                'color' => '#7f6f52',
            ],
            [
                'name' => 'Caption Generation',
                'users' => $captionUsers,
                'total' => $captionTotal,
                'icon' => 'MessageSquareText',
                'color' => '#4f6f87',
            ],
        ];

        // Monthly growth data (last 30 days)
        $monthlyData = $this->getMonthlyGrowthData();

        return response()->json([
            'overview' => [
                [
                    'label' => 'Registered Users',
                    'value' => $totalRegisteredUsers,
                    'detail' => 'Total platform users',
                    'icon' => 'Users',
                ],
                [
                    'label' => 'Feature Usage',
                    'value' => $totalFeatureUsage,
                    'detail' => 'Total usage across all tools',
                    'icon' => 'BarChart3',
                ],
            ],
            'featureStats' => $featureStats,
            'monthlyData' => $monthlyData,
        ]);
    }

    #[OA\Get(
        path: '/admin/revenue',
        summary: 'Get revenue analytics',
        description: 'Retrieves revenue analytics including total revenue, active subscriptions per plan, and revenue by plan. Admin only.',
        tags: ['Admin - Analytics'],
        security: [['sanctumBearerAuth' => []]],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Revenue analytics retrieved successfully',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'totalRevenue', type: 'number', example: 1500),
                        new OA\Property(property: 'totalActiveSubscriptions', type: 'integer', example: 45),
                        new OA\Property(
                            property: 'plans',
                            type: 'array',
                            items: new OA\Items(
                                properties: [
                                    new OA\Property(property: 'name', type: 'string'),
                                    new OA\Property(property: 'price', type: 'number'),
                                    new OA\Property(property: 'activeSubscriptions', type: 'integer'),
                                    new OA\Property(property: 'monthlyRevenue', type: 'number'),
                                ]
                            )
                        ),
                    ]
                )
            ),
        ]
    )]
    public function getRevenueAnalytics()
    {
        $plans = Plan::get()->map(function ($plan) {
            $activeSubscriptions = $plan->subscriptions()
                ->where('status', 'active')
                ->count();
            
            $revenue = $plan->price * $activeSubscriptions;

            return [
                'name' => $plan->name,
                'price' => $plan->price,
                'activeSubscriptions' => $activeSubscriptions,
                'monthlyRevenue' => $revenue,
                'maxImageGenerations' => $plan->max_generations_image,
                'maxCaptionGenerations' => $plan->max_generations_caption,
            ];
        });

        $totalRevenue = $plans->sum('monthlyRevenue');
        $totalActiveSubscriptions = $plans->sum('activeSubscriptions');

        return response()->json([
            'totalRevenue' => $totalRevenue,
            'totalActiveSubscriptions' => $totalActiveSubscriptions,
            'plans' => $plans,
        ]);
    }

    /**
     * Helper: Format user data for frontend
     */
    private function formatUserData($user)
    {
        $subscription = $user->activeSubscription;
        
        $status = $subscription && $subscription->status === 'active' ? 'Active' : 'Inactive';
        $planName = $subscription?->plan?->name ?? 'No Plan';

        return [
            'id' => $user->id,
            'name' => $user->profile?->owner_name ?? 'N/A',
            'email' => $user->email,
            'storeName' => $user->profile?->store_name ?? 'N/A',
            'businessType' => $user->profile?->business_type ?? 'N/A',
            'plan' => $planName,
            'status' => $status,
            'joinedAt' => $user->created_at->format('Y-m-d'),
            'isVerified' => $user->is_verified,
            'lastLoginAt' => $user->last_login_at?->format('Y-m-d H:i') ?? 'Never',
        ];
    }

    /**
     * Helper: Get total feature usage count
     */
    private function getTotalFeatureUsage()
    {
        return CaptionGeneration::count() +
               EnhanceImageRequest::count() +
               ImageGenerationRequest::count() +
               ThemedImageRequest::count();
    }

    /**
     * Helper: Get monthly growth data
     * Works with both MySQL and SQLite
     */
    private function getMonthlyGrowthData()
    {
        $driver = DB::getDriverName();
        
        if ($driver === 'sqlite') {
            // SQLite uses strftime
            $monthlyUsers = User::where('role_id', 2)
                ->selectRaw("strftime('%Y-%m', created_at) as month, COUNT(*) as count")
                ->groupBy('month')
                ->orderBy('month', 'asc')
                ->limit(12)
                ->get();
        } else {
            // MySQL uses DATE_FORMAT
            $monthlyUsers = User::where('role_id', 2)
                ->selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month, COUNT(*) as count')
                ->groupBy('month')
                ->orderBy('month', 'asc')
                ->limit(12)
                ->get();
        }

        return $monthlyUsers->map(function ($item) {
            return [
                'month' => $item->month,
                'users' => $item->count,
            ];
        });
    }
}
