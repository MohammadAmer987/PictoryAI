<?php

namespace Database\Seeders;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EnhanceImageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $requestId = DB::table('enhance_image_requests')->insertGetId([
            'user_id' => 1,
            'source_image' => 'test-images/original.jpg',
            'product_name' => 'Raghad Bakery',
            'target_audience' => 'young adults',
            'style_type' => 'modern',
            'light_type' => 'soft',
            'background_type' => 'studio',
            'extra_prompt' => 'make it premium',
            'created_at' => now(),
            'updated_at' => now(),
            'background_color' => '#043F34',
        ]);

        DB::table('enhance_image_responses')->insert([
            [
                'request_id' => $requestId,
                'image_path' => 'https://picsum.photos/500/500?1',
                'result_order' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'request_id' => $requestId,
                'image_path' => 'https://picsum.photos/500/500?2',
                'result_order' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

    }
}
