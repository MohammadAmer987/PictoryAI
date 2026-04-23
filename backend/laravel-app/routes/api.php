<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CaptionController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\ImageGeneratorController; // من برانش Rahaf
use App\Http\Controllers\ImageEditController;      // تأكدي من المسار الصحيح
use App\Http\Controllers\PlanController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\ProfileController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/image-edit', [ImageEditController::class, 'edit']);
Route::post('/generate-image', [ImageGeneratorController::class, 'generate']); // ميزتك هنا
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/captions/generate', [CaptionController::class, 'generate']);
});
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/subscriptions/current', [SubscriptionController::class, 'current']);
    Route::get('/subscriptions/history', [SubscriptionController::class, 'history']);
    Route::post('/subscriptions/upgrade', [SubscriptionController::class, 'upgrade']);
    Route::patch('/profile/name', [ProfileController::class, 'updateName']);
    Route::patch('/profile/store-name', [ProfileController::class, 'updateStoreName']);
    Route::patch('/profile/email', [ProfileController::class, 'updateEmail']);
    Route::patch('/profile/password', [ProfileController::class, 'updatePassword']);
});
Route::get('/plans', [PlanController::class, 'index']);
Route::get('/plans/{id}', [PlanController::class, 'show']);
