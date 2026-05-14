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
        Schema::create('plans', function (Blueprint $table) {
            $table->id();

            $table->string('name')->unique(); // free, pro
            $table->decimal('price', 10, 2)->default(0);

            $table->unsignedInteger('max_generations_image')->nullable();
            $table->unsignedInteger('max_generations_caption')->nullable();
            $table->boolean('watermark')->default(true);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plans');
    }
};
