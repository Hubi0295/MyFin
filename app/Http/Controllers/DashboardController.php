<?php

namespace App\Http\Controllers;

use App\Http\Resources\TransactionResource;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {  
        $balance = auth()->user()->balance;
        
        $transakcjeRoczne = Transaction::query()->where('user_id', auth()->id())
            ->whereYear('date', Carbon::now()->year)
            ->get();
            return inertia("Dashboard", [
                'balance' => $balance,
                'transakcjeRoczne' => TransactionResource::collection($transakcjeRoczne),
            ]);
    }
}
