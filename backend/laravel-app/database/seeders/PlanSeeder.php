<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Plan;

class PlanSeeder extends Seeder
{
    public function run(): void
    {
        Plan::firstOrCreate(
            ['name' => 'free'],
            [
                'price' => 0,
                'max_generations_image' => 5,
                'max_generations_caption' => 10,
                'watermark' => true,
            ]
        );

        Plan::firstOrCreate(
            ['name' => 'premium'],
            [
                'price' => 29.99,
                'max_generations_image' => null,
                                'max_generations_image' => null,

                'watermark' => false,
            ]
        );
    }
}