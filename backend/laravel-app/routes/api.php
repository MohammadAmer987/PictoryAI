<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CaptionController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\ImageGeneratorController; // من برانش Rahaf
use App\Http\Controllers\ImageEditController;      // تأكدي من المسار الصحيح

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// ميزات الصور (تعديل وتوليد)
Route::post('/image-edit', [ImageEditController::class, 'edit']);
Route::post('/generate-image', [ImageGeneratorController::class, 'generate']); // ميزتك هنا

// ميزات الـ Captions والـ Auth
Route::post('/captions/generate', [CaptionController::class, 'generate']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
