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

class AdminController extends Controller
{
    /**
     * Get all users with their profile, subscription, and usage data
     */
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

    /**
     * Get dashboard statistics
     */
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

    /**
     * Get analytics - feature usage statistics
     */
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

    /**
     * Get subscription revenue and profit analytics
     */
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
