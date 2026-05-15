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
#[OA\Tag(
    name: 'Subscriptions',
    description: 'Operations related to user subscription management.'
)]
#[OA\Tag(
    name: 'Profile',
    description: 'Operations related to user profile management.'
)]
#[OA\Tag(
    name: 'Admin - Users',
    description: 'Admin operations for user management.'
)]
#[OA\Tag(
    name: 'Admin - Dashboard',
    description: 'Admin operations for dashboard statistics.'
)]
#[OA\Tag(
    name: 'Admin - Analytics',
    description: 'Admin operations for analytics and revenue tracking.'
)]
#[OA\Tag(
    name: 'Admin - Notifications',
    description: 'Admin operations for user notifications.'
)]
#[OA\Get(
    path: '/user',
    summary: 'Get current authenticated user',
    description: 'Returns the current authenticated user information',
    tags: ['Authentication'],
    security: [['sanctumBearerAuth' => []]],
    responses: [
        new OA\Response(
            response: 200,
            description: 'Current user retrieved successfully',
            content: new OA\JsonContent(ref: '#/components/schemas/User')
        ),
        new OA\Response(
            response: 401,
            description: 'Unauthenticated'
        ),
    ]
)]
#[OA\Get(
    path: '/admin/test',
    summary: 'Admin test endpoint',
    description: 'Simple endpoint to test admin access. Admin only.',
    tags: ['Admin - Users'],
    security: [['sanctumBearerAuth' => []]],
    responses: [
        new OA\Response(
            response: 200,
            description: 'Admin access confirmed',
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'message', type: 'string', example: 'admin only'),
                ]
            )
        ),
    ]
)]
#[OA\Schema(
    schema: 'User',
    type: 'object',
    properties: [
        new OA\Property(property: 'id', type: 'integer', example: 1),
        new OA\Property(property: 'email', type: 'string', example: 'user@example.com'),
        new OA\Property(property: 'role_id', type: 'integer', example: 2),
        new OA\Property(property: 'is_verified', type: 'boolean', example: false),
        new OA\Property(property: 'last_login_at', type: 'string', format: 'date-time'),
        new OA\Property(property: 'created_at', type: 'string', format: 'date-time'),
        new OA\Property(property: 'updated_at', type: 'string', format: 'date-time'),
    ]
)]
#[OA\Schema(
    schema: 'Profile',
    type: 'object',
    properties: [
        new OA\Property(property: 'id', type: 'integer'),
        new OA\Property(property: 'user_id', type: 'integer'),
        new OA\Property(property: 'owner_name', type: 'string'),
        new OA\Property(property: 'store_name', type: 'string'),
        new OA\Property(property: 'business_type', type: 'string'),
        new OA\Property(property: 'business_description', type: 'string'),
        new OA\Property(property: 'logo', type: 'string', nullable: true),
    ]
)]
#[OA\Schema(
    schema: 'Plan',
    type: 'object',
    properties: [
        new OA\Property(property: 'id', type: 'integer'),
        new OA\Property(property: 'name', type: 'string', example: 'free'),
        new OA\Property(property: 'price', type: 'number', example: 0),
        new OA\Property(property: 'max_generations', type: 'integer', example: 5),
        new OA\Property(property: 'watermark', type: 'boolean', example: true),
    ]
)]
#[OA\Schema(
    schema: 'Subscription',
    type: 'object',
    properties: [
        new OA\Property(property: 'id', type: 'integer'),
        new OA\Property(property: 'user_id', type: 'integer'),
        new OA\Property(property: 'plan_id', type: 'integer'),
        new OA\Property(property: 'start_date', type: 'string', format: 'date-time'),
        new OA\Property(property: 'end_date', type: 'string', format: 'date-time', nullable: true),
        new OA\Property(property: 'status', type: 'string', enum: ['active', 'cancelled', 'expired']),
        new OA\Property(property: 'plan', ref: '#/components/schemas/Plan'),
    ]
)]
#[OA\Schema(
    schema: 'DashboardStats',
    type: 'object',
    properties: [
        new OA\Property(property: 'totalUsers', type: 'integer', example: 100),
        new OA\Property(property: 'activeUsers', type: 'integer', example: 85),
        new OA\Property(property: 'premiumUsers', type: 'integer', example: 35),
    ]
)]
final class ApiDocumentation
{
}
