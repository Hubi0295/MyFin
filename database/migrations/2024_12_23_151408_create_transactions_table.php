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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->longText('description')->nullable();
            $table->enum('type', ['Income', 'Expense']);
            $table->decimal('amount', 10, 2);
            $table->enum('category', ['Salary','Food', 'Transport', 'Entertainment', 'Education', 'Home', 'Service','Investment','Other']);
            $table->date('date')->unique();
            $table->foreignId('user_id')->constrained(table: 'users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
