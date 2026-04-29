<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // This migration is intentionally defensive: some environments may have
        // `image_generation_*` tables created with only `id` and timestamps.
        // We only add the missing columns needed by ImageGeneratorController.

        if (Schema::hasTable('image_generation_requests')) {
            Schema::table('image_generation_requests', function (Blueprint $table) {
                if (!Schema::hasColumn('image_generation_requests', 'user_id')) {
                    $table->unsignedBigInteger('user_id')->nullable();
                }

                if (!Schema::hasColumn('image_generation_requests', 'project_name')) {
                    $table->string('project_name')->nullable();
                }

                if (!Schema::hasColumn('image_generation_requests', 'content')) {
                    $table->text('content')->nullable();
                }

                if (!Schema::hasColumn('image_generation_requests', 'color')) {
                    $table->string('color')->nullable();
                }

                if (!Schema::hasColumn('image_generation_requests', 'image_type')) {
                    $table->string('image_type')->nullable()->default('post');
                }

                if (!Schema::hasColumn('image_generation_requests', 'prompt_used')) {
                    $table->text('prompt_used')->nullable();
                }
            });
        }

        if (Schema::hasTable('image_generation_responses')) {
            Schema::table('image_generation_responses', function (Blueprint $table) {
                if (!Schema::hasColumn('image_generation_responses', 'request_id')) {
                    $table->unsignedBigInteger('request_id')->nullable();
                }

                if (!Schema::hasColumn('image_generation_responses', 'image_path')) {
                    $table->string('image_path')->nullable();
                }

                if (!Schema::hasColumn('image_generation_responses', 'result_order')) {
                    $table->integer('result_order')->default(1);
                }
            });
        }
    }

    public function down(): void
    {
        // Intentionally left blank to avoid SQLite limitations when removing columns.
    }
};

