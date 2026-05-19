<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Seeder;

class PlanQuotaSeeder extends Seeder
{
    public function run(): void
    {
        Plan::updateOrCreate(
            ['name' => 'free'],
            [
                'price' => 0,
                'max_generations_image' => 5,
                'max_generations_caption' => 10,
                'watermark' => true,
            ]
        );

        Plan::updateOrCreate(
            ['name' => 'premium'],
            [
                'price' => 29.99,
                'max_generations_image' => null,
                'max_generations_caption' => null,
                'watermark' => false,
            ]
        );
    }
}
