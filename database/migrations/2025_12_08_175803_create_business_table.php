<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('business', function (Blueprint $table) {
            $table->id();
            $table->string('cnpj')->unique();
            $table->string('name')->unique();
            $table->text('address')->nullable();
            $table->string('phone')->nullable();
            $table->timestamps();
        });

    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
        $table->dropForeign(['business_id']);
    });

        Schema::table('drivers', function (Blueprint $table) {
        $table->dropForeign(['business_id']);
    });
        Schema::dropIfExists('business');
    }
};

