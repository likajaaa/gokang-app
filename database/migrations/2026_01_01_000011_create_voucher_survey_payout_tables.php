<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vouchers', function (Blueprint $table) {
            $table->id();
            $table->string('code', 30)->unique();
            $table->string('title', 100);
            $table->text('description')->nullable();
            $table->enum('type', ['percentage', 'fixed']);
            $table->decimal('value', 10, 2);
            $table->decimal('min_transaction', 10, 2)->default(0);
            $table->decimal('max_discount', 10, 2)->nullable();
            $table->integer('usage_limit_total')->nullable();
            $table->integer('usage_limit_per_user')->default(1);
            $table->integer('used_count')->default(0);
            $table->timestamp('valid_from')->nullable();
            $table->timestamp('valid_until')->nullable();
            $table->json('applicable_services')->nullable(); // null = all
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['is_active', 'valid_from', 'valid_until']);
        });

        Schema::create('voucher_usages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('voucher_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->timestamp('used_at')->nullable();
            $table->timestamps();

            $table->index(['voucher_id', 'user_id']);
        });

        Schema::create('surveys', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained('users')->cascadeOnDelete();
            $table->string('source', 50)->nullable(); // Tahu GoKang dari mana
            $table->enum('building_type', ['apartment', 'ruko', 'rumah']);
            $table->text('description');
            $table->json('photos')->nullable();
            $table->text('address_text');
            $table->decimal('lat', 10, 7);
            $table->decimal('lng', 10, 7);
            $table->timestamp('scheduled_at')->nullable();
            $table->string('budget_range', 30);
            $table->string('promo_code', 30)->nullable();
            $table->decimal('survey_fee', 10, 2);
            $table->enum('status', [
                'pending_payment',
                'scheduled',
                'done',
                'quotation_sent',
                'converted',
                'cancelled'
            ])->default('pending_payment');
            $table->foreignId('consultant_id')->nullable()->constrained('users')->nullOnDelete();
            $table->decimal('quotation_amount', 15, 2)->nullable();
            $table->json('quotation_details')->nullable();
            $table->foreignId('order_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamps();

            $table->index('status');
        });

        Schema::create('payouts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tukang_id')->constrained('tukang')->cascadeOnDelete();
            $table->decimal('amount', 12, 2);
            $table->foreignId('bank_account_id')->constrained();
            $table->enum('status', ['pending', 'approved', 'processing', 'success', 'rejected'])->default('pending');
            $table->timestamp('requested_at')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('processed_at')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->text('rejection_reason')->nullable();
            $table->string('reference_number', 50)->nullable();
            $table->timestamps();

            $table->index(['tukang_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payouts');
        Schema::dropIfExists('surveys');
        Schema::dropIfExists('voucher_usages');
        Schema::dropIfExists('vouchers');
    }
};
