<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ThemedImageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        {
            $requestId = DB::table('themed_image_requests')->insertGetId([
                'user_id' => 1,
                'source_image' => 'test-images/original.jpg',
                'theme' => 'Luxury Green',
                'image_size' => '1:1',
                'optional_text' => 'Raghad Bakery',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            DB::table('themed_image_responses')->insert([
                [
                    'request_id' => $requestId,
                    'image_path' => 'https://picsum.photos/500/500?3',
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'request_id' => $requestId,
                    'image_path' => 'https://picsum.photos/500/500?4',
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
            ]);
        }
    }
}
