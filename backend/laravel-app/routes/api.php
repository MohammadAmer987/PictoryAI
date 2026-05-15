<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\NotificationController;
use App\Http\Controllers\Api\CaptionController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\ImageGeneratorController;
use App\Http\Controllers\ImageEditController;
use App\Http\Controllers\HistoryController;
use App\Http\Controllers\ThemedImageController;
use App\Http\Controllers\PlanController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AdminNotificationController;

/*
|--------------------------------------------------------------------------
| Public routes
|--------------------------------------------------------------------------
*/

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/plans', [PlanController::class, 'index']);
Route::get('/plans/{id}', [PlanController::class, 'show']);

/*
|--------------------------------------------------------------------------
| Authenticated routes: admin + normal user
| role_id: 1 = admin
| role_id: 2 = user
|--------------------------------------------------------------------------
*/

Route::middleware(['auth:sanctum', 'role:1,2'])->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/notifications', [NotificationController::class, 'index']);

    Route::post('/image-edit', [ImageEditController::class, 'edit']);
    Route::post('/image-theme', [ThemedImageController::class, 'edit']);

Route::post('/generate-image', [ImageGeneratorController::class, 'generate']);

    Route::post('/captions/generate', [CaptionController::class, 'generate']);
    Route::get('/captions/my-plan', [CaptionController::class, 'myPlan']);

    Route::get('/history/images', [HistoryController::class, 'images']);
    Route::get('/history/captions', [HistoryController::class, 'captions']);
    Route::delete('/history/captions/{generationId}', [HistoryController::class, 'deleteCaptionGroup']);
    Route::delete('/history/images/{type}/{requestId}', [HistoryController::class, 'deleteImageGroup']);

    Route::get('/user/subscription', [\App\Http\Controllers\SubscriptionNController::class, 'subscription']);

    Route::get('/subscriptions/current', [SubscriptionController::class, 'current']);
    Route::get('/subscriptions/history', [SubscriptionController::class, 'history']);
    Route::post('/subscriptions/upgrade', [SubscriptionController::class, 'upgrade']);

    Route::patch('/profile/name', [ProfileController::class, 'updateName']);
    Route::patch('/profile/store-name', [ProfileController::class, 'updateStoreName']);
    Route::patch('/profile/email', [ProfileController::class, 'updateEmail']);
    Route::patch('/profile/password', [ProfileController::class, 'updatePassword']);
});

/*
|--------------------------------------------------------------------------
| Admin-only routes
| role_id: 1 = admin only
|--------------------------------------------------------------------------
*/

Route::middleware(['auth:sanctum', 'role:1'])->prefix('admin')->group(function () {
    Route::get('/test', function () {
        return response()->json(['message' => 'admin only']);
    });

    // Users management
    Route::get('/users', [AdminController::class, 'getAllUsers']);
    
    // Dashboard statistics
    Route::get('/dashboard/stats', [AdminController::class, 'getDashboardStats']);
    
    // Analytics
    Route::get('/analytics', [AdminController::class, 'getAnalytics']);
    
    // Revenue analytics
    Route::get('/revenue', [AdminController::class, 'getRevenueAnalytics']);

    // Notifications
    Route::post('/notifications/send', [AdminNotificationController::class, 'send']);
    Route::get('/notifications/history', [AdminNotificationController::class, 'getHistory']);
    Route::get('/notifications/stats', [AdminNotificationController::class, 'getStats']);
});
