<?php

use App\Http\Controllers\ImageGeneratorController;
use Illuminate\Support\Facades\Route;

Route::post('/generate-image', [ImageGeneratorController::class, 'generate']);
