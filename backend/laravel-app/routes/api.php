<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CaptionController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/image-edit', [App\Http\Controllers\ImageEditController::class, 'edit']);
Route::post('/captions/generate', [CaptionController::class, 'generate']);
