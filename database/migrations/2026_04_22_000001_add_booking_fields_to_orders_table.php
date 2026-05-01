<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // Free-text survey location (vs existing FK address_id which links to saved addresses)
            $table->string('survey_address')->nullable()->after('address_id');
            $table->text('survey_address_detail')->nullable()->after('survey_address');

            // Survey schedule (untuk borongan: konsultan datang survey)
            $table->dateTime('survey_scheduled_at')->nullable()->after('survey_address_detail');

            // Borongan-specific intake
            $table->string('budget_range', 50)->nullable()->after('survey_scheduled_at');
            $table->json('referral_sources')->nullable()->after('budget_range');
            $table->enum('building_type', ['apartment', 'ruko', 'rumah'])->nullable()->after('referral_sources');
            $table->string('promo_code', 50)->nullable()->after('building_type');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'survey_address',
                'survey_address_detail',
                'survey_scheduled_at',
                'budget_range',
                'referral_sources',
                'building_type',
                'promo_code',
            ]);
        });
    }
};
