<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tukang', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->text('ktp_number')->nullable(); // encrypted
            $table->date('date_of_birth')->nullable();
            $table->enum('gender', ['male', 'female'])->nullable();
            $table->integer('experience_years')->default(0);
            $table->text('bio')->nullable();
            $table->enum('verification_status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->text('verification_notes')->nullable();
            $table->timestamp('verified_at')->nullable();
            $table->foreignId('verified_by')->nullable()->constrained('users')->nullOnDelete();

            // Online & location
            $table->boolean('is_online')->default(false);
            $table->decimal('current_lat', 10, 7)->nullable();
            $table->decimal('current_lng', 10, 7)->nullable();
            $table->timestamp('last_location_update')->nullable();

            // Stats
            $table->decimal('rating_average', 3, 2)->default(0);
            $table->integer('total_orders')->default(0);
            $table->decimal('total_earnings', 15, 2)->default(0);
            $table->decimal('acceptance_rate', 5, 2)->default(100);

            $table->timestamps();

            $table->index('verification_status');
            $table->index(['is_online', 'current_lat', 'current_lng']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tukang');
    }
};
