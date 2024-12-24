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
                'name' => 'Investment: ' . $investment->name,
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
            Transaction::where('name', 'Investment: ' . $investment->name)
                ->where('user_id', $user->id)
                ->delete();
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
