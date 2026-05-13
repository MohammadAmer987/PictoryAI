<?php

namespace App\Docs;

use OpenApi\Attributes as OA;

#[OA\Info(
    title: 'Pictory AI API',
    version: '1.0.0',
    description: 'API documentation for the Pictory AI backend.'
)]
#[OA\Server(
    url: 'http://127.0.0.1:8000',
    description: 'Local development server'
)]
#[OA\SecurityScheme(
    securityScheme: 'sanctumBearerAuth',
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
    description: 'Use a Sanctum bearer token in the Authorization header.'
)]
#[OA\Tag(
    name: 'Authentication',
    description: 'Authentication and account access operations.'
)]
#[OA\Tag(
    name: 'Tools - Captions',
    description: 'Operations related to AI caption generation.'
)]
#[OA\Tag(
    name: 'Tools - Image Generation',
    description: 'Operations related to AI image generation.'
)]
#[OA\Tag(
    name: 'Tools - Image Editing',
    description: 'Operations related to AI product image editing.'
)]
#[OA\Tag(
    name: 'Tools - Theme Editing',
    description: 'Operations related to themed AI image editing.'
)]
#[OA\Tag(
    name: 'History',
    description: 'Operations related to user generation history.'
)]
final class ApiDocumentation
{
}
