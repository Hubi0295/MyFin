<?php

namespace Database\Seeders;

use App\Models\Investment;
use App\Models\Transaction;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Database\Factories\TransactionFactory;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Hubert Szelepusta',
            'email' => 'hubert123@example.com',
            'balance' => 0.0,
            'password' => bcrypt('password@123'),
            'email_verified_at' => time()
        ]);
        Transaction::factory()->count(25)->create();
        Investment::factory()->count(15)->create();
    }
}
