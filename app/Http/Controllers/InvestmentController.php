<?php

namespace App\Http\Controllers;

use App\Http\Resources\InvestmentResource;
use App\Models\Investment;
use App\Http\Requests\StoreInvestmentRequest;
use App\Http\Requests\UpdateInvestmentRequest;
use Carbon\Carbon;

class InvestmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $investments = Investment::query()
            ->where('user_id',auth()->id())
            ->paginate(100)->onEachSide(1);
        return inertia("Investment/Index", [
            "investments" => InvestmentResource::collection($investments),
            'success' => session('success'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia("Investment/Create");
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreInvestmentRequest $request)
    {
        $data = $request->validated();
        $data['user_id'] = auth()->id();
        $data['date_of_operation'] = Carbon::now();
        Investment::create($data);
        return redirect()->route('investment.index')->with('success', 'Inwestycja została dodana');
    }

    /**
     * Display the specified resource.
     */
    public function show(Investment $investment)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Investment $investment)
    {
        return inertia('Investment/Edit', [
            'investment' => new InvestmentResource($investment),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateInvestmentRequest $request, Investment $investment)
    {
        $name = $investment->name;
        $data = $request->validated();
        $data['user_id'] = auth()->id();
        $data['date_of_operation'] = Carbon::now();
        $investment->update($data);
        return to_route('investment.index')->with('success', "Inwestycja ".$name." została zaktualizowana");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Investment $investment)
    {
        $name = $investment->name;
        $investment->delete();
        return back()->with('success', "Inwestycja ".$name." została usunięta");
    }
}
