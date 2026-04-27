<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('enhance_image_requests', function (Blueprint $table) {
            $table->id();


            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            $table->string('source_image');

            $table->string('product_name');
            $table->string('target_audience');
            $table->text('product_description')->nullable();

            $table->string('background_type');
            $table->string('background_color');
            $table->integer('background_blur')->default(0);

            $table->string('light_type');
            $table->string('style_type');

            $table->string('text_on_image')->nullable();
            $table->string('text_position')->nullable();
            $table->string('text_color')->nullable();
            $table->integer('text_size')->nullable();

            $table->string('camera_angle')->nullable();
            $table->string('image_ratio')->nullable();

            $table->text('extra_prompt');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('enhance_image_requests');
    }
};
