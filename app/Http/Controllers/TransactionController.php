<?php

namespace App\Http\Controllers;

use App\Http\Resources\TransactionResource;
use App\Models\Transaction;
use App\Http\Requests\StoreTransactionRequest;
use App\Http\Requests\UpdateTransactionRequest;
use Carbon\Carbon;

class TransactionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $currentMonth = Carbon::now()->month;
        $currentYear = Carbon::now()->year;

        $query = Transaction::query()
            ->whereMonth('date', $currentMonth)
            ->whereYear('date', $currentYear)
            ->where('user_id', auth()->id());
        $transactions = $query->paginate(100)->onEachSide(1);
        return inertia("Transaction/Index", [
            "transactions" => TransactionResource::collection($transactions),
            'success' => session('success'),
        ]);
    }
    public function history()
    {
        $query = Transaction::query()->where('user_id', auth()->id());
        $sortField = request("sort_field", 'date');
        $sortDirection = request("sort_direction", 'desc');
        if(request("name")){
            $query->where("name", "like", "%".request("name")."%");
        }
        if(request("amountWiekszeRowne")){
            $query->where("amount", ">=", request("amountWiekszeRowne"));
        }
        if(request("amountMniejszeRowne")){
            $query->where("amount", "<=", request("amountMniejszeRowne"));
        }
        if(request("dateFrom")){
            $query->where("date", ">=", request("dateFrom"));
        }
        if(request("dateTo")){
            $query->where("date", "<=", request("dateTo"));
        }
        if(request("type")){
            $query->where("type", request("type"));
        }
        if(request("category")){
            $query->where("category", request("category"));
        }
        
        $transactions = $query->orderBy($sortField, $sortDirection)->paginate(100)->onEachSide(1);
        return inertia("Transaction/IndexHistory", [
            "transactions" => TransactionResource::collection($transactions),
            'queryParams' => request()->query()?:null,
            'success' => session('success'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia("Transaction/Create");
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTransactionRequest $request)
    {
        $data = $request->validated();
        $data['user_id'] = auth()->id();
        $data['date'] = Carbon::now();
        Transaction::create($data);
        return to_route('transaction.index')->with('success', 'Transakcja została dodana');
    }

    /**
     * Display the specified resource.
     */
    public function show(Transaction $transaction)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Transaction $transaction)
    {
        return inertia('Transaction/Edit', [
            'transaction' => new TransactionResource($transaction),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTransactionRequest $request, Transaction $transaction)
    {
        $name = $transaction->name;
        $data = $request->validated();
        $data['user_id'] = auth()->id();
        $data['date'] = Carbon::now();
        $transaction->update($data);
        return to_route('transaction.index')->with('success', "Transakcja ".$name." została zaktualizowana");
    }


    public function destroy(Transaction $transaction)
    {
        $name = $transaction->name;
        $transaction->delete();
        return back()->with('success', "Transakcja ".$name." została zaktualizowana");
    }
}
