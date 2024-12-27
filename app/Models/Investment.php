<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Investment extends Model
{
    /** @use HasFactory<\Database\Factories\InvestmentFactory> */
    use HasFactory;
    protected $fillable = [
        'name',
        'description',
        'type',
        'amount',
        'action',
        'date_of_operation',
        'value',
        'user_id',
    ];
    protected static function boot()
    {
        parent::boot();
        static::created(function ($investment) {
            $user = $investment->user;
            Transaction::create([
                'name' => $investment->name,
                'description' => $investment->description,
                'type' => $investment->action=='Buy'?'Expense':'Income',
                'amount' => $investment->amount*$investment->value,
                'category' => 'Investment',
                'date' => $investment->date_of_operation,
                'user_id' => $user->id,
            ]);
        });
        static::deleted(function ($investment) {
            $user = $investment->user;
            if ($investment->action === 'Sell') {
                $user->decrement('balance', $investment->amount*$investment->value);
            } elseif ($investment->action === 'Buy') {
                $user->increment('balance', $investment->amount*$investment->value);
            }
            Transaction::where('date', $investment->date_of_operation)
                ->where('user_id', $user->id)
                ->delete();
        });
        static::updating(function ($investment) {
            $original = $investment->getOriginal();
            $user = $investment->user;
            // Revert the original investment's effect on the balance
            if ($original['action'] === 'Sell') {
                $user->decrement('balance', $original['amount']*$original['value']);
            } elseif ($original['action'] === 'Buy') {
                $user->increment('balance', $original['amount']*$original['value']);
            }
            // Apply the new investment's effect on the balance
            if ($investment->action === 'Sell') {
                $user->increment('balance', $investment->amount*$investment->value);
            } elseif ($investment->action === 'Buy') {
                $user->decrement('balance', $investment->amount*$investment->value);
            }
            Transaction::where('date', $original['date_of_operation'])
                ->where('user_id', $user->id)
                ->where('category', 'Investment')
                ->update([
                    'name' => $investment->name,
                    'description' => $investment->description,
                    'type' => $investment->action == 'Buy' ? 'Expense' : 'Income',
                    'amount' => $investment->amount * $investment->value,
                    'date' => $investment->date_of_operation,
                ]);
        });
    }
    public function user()
    {
        return $this->belongsTo(User::class,'user_id');
    }
    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }
}
