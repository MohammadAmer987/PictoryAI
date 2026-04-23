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
        Schema::create('caption_generations', function (Blueprint $table) {
            $table->id();
            $table->string('product_name');
            $table->string('target_audience')->nullable();
            $table->string('tone')->nullable();
            $table->string('language', 50)->nullable();
            $table->text('description')->nullable();
            $table->string('image_path');
            $table->longText('raw_text')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('caption_generations');
    }
};
