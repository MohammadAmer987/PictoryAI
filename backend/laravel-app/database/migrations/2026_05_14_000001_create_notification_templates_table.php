<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notification_templates', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g., "welcome", "announcement", "billing_alert"
            $table->string('subject');
            $table->longText('html_content');
            $table->text('variables')->nullable(); // JSON: ["name", "email", "plan"]
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->unique('name');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notification_templates');
    }
};
