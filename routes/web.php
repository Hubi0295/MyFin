<?php

use App\Http\Controllers\InvestmentController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::redirect('/', '/dashboard');


Route::middleware(['auth','verified'])->group(function(){
    Route::get('/dashboard', fn ()=> Inertia::render('Dashboard'))->name('dashboard');
    Route::resource('transaction', TransactionController::class);
    Route::get('/transactions/history', [TransactionController::class, 'history'])->name('transaction.history');
    Route::resource('investment', InvestmentController::class);
    Route::resource('user', UserController::class);



});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
