<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'type',
        'amount',
        'category',
        'date',
        'user_id',
    ];

    protected static function boot()
    {
        parent::boot();

        static::created(function ($transaction) {
            $user = $transaction->user;
            if ($transaction->type === 'Income') {
                $user->increment('balance', $transaction->amount);
            } elseif ($transaction->type === 'Expense') {
                $user->decrement('balance', $transaction->amount);
            }
        });

        static::deleted(function ($transaction) {
            $user = $transaction->user;
            if ($transaction->type === 'Income') {
                $user->decrement('balance', $transaction->amount);
            } elseif ($transaction->type === 'Expense') {
                $user->increment('balance', $transaction->amount);
            }
        });
        static::updating(function ($transaction) {
            $original = $transaction->getOriginal();
            $user = $transaction->user;

            // Revert the original transaction's effect on the balance
            if ($original['type'] === 'Income') {
                $user->decrement('balance', $original['amount']);
            } elseif ($original['type'] === 'Expense') {
                $user->increment('balance', $original['amount']);
            }

            // Apply the new transaction's effect on the balance
            if ($transaction->type === 'Income') {
                $user->increment('balance', $transaction->amount);
            } elseif ($transaction->type === 'Expense') {
                $user->decrement('balance', $transaction->amount);
            }
        });
    
    }

    public function user()
    {
        return $this->belongsTo(User::class,'user_id');
    }
}
