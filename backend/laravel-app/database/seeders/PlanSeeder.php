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
                'max_generations' => 5,
                'watermark' => true,
            ]
        );

        Plan::firstOrCreate(
            ['name' => 'pro'],
            [
                'price' => 29.99,
                'max_generations' => null,
                'watermark' => false,
            ]
        );
    }
}