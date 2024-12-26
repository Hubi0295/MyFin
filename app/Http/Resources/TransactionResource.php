<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransactionResource extends JsonResource
{
    public static $wrap = false;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return[
            "id" => $this->id,
            "name" => $this->name,
            "description" => $this->description,
            "amount" => $this->amount,
            "type" => $this->type,
            "category" => $this->category,
            "date" => (new Carbon($this->date))->format("Y-m-d"),          
        ];
    }
}
