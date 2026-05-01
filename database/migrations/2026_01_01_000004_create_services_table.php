<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('code', 50)->unique();
            $table->string('name', 100);
            $table->string('slug', 100)->unique();
            $table->text('description')->nullable();
            $table->string('icon_url')->nullable();

            // 3 session pricing (sesuai UI GoKang: Seharian, Pagi, Sore)
            $table->decimal('price_full_day', 10, 2)->default(0);   // 08:00-17:00
            $table->decimal('price_morning', 10, 2)->default(0);    // 08:00-12:00
            $table->decimal('price_afternoon', 10, 2)->default(0);  // 13:00-17:00

            $table->enum('service_type', ['daily', 'consultant'])->default('daily');
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
