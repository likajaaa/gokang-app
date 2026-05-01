<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // Tukang Harian: simple form-based booking dengan 1 service
            $table->foreignId('service_id')
                ->nullable()
                ->after('order_type')
                ->constrained('services')
                ->nullOnDelete();

            $table->dateTime('work_scheduled_at')->nullable()->after('survey_scheduled_at');
            $table->unsignedTinyInteger('duration_hours')->nullable()->after('work_scheduled_at');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign(['service_id']);
            $table->dropColumn(['service_id', 'work_scheduled_at', 'duration_hours']);
        });
    }
};
