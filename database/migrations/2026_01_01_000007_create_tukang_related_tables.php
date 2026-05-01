<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tukang_skills', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tukang_id')->constrained('tukang')->cascadeOnDelete();
            $table->foreignId('service_id')->constrained()->cascadeOnDelete();
            $table->boolean('is_primary')->default(false);
            $table->timestamps();

            $table->unique(['tukang_id', 'service_id']);
        });

        Schema::create('tukang_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tukang_id')->constrained('tukang')->cascadeOnDelete();
            $table->enum('document_type', ['ktp', 'selfie_ktp', 'certificate', 'profile_photo']);
            $table->string('file_path');
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('bank_accounts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tukang_id')->unique()->constrained('tukang')->cascadeOnDelete();
            $table->string('bank_name', 50);
            $table->text('account_number'); // encrypted
            $table->string('account_holder', 100);
            $table->boolean('is_verified')->default(false);
            $table->timestamps();
        });

        Schema::create('tukang_service_areas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tukang_id')->constrained('tukang')->cascadeOnDelete();
            $table->foreignId('area_id')->constrained()->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['tukang_id', 'area_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tukang_service_areas');
        Schema::dropIfExists('bank_accounts');
        Schema::dropIfExists('tukang_documents');
        Schema::dropIfExists('tukang_skills');
    }
};
