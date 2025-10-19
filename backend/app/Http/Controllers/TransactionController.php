<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTransactionRequest;
use App\Models\Transaction;

class TransactionController extends Controller
{
    public function store(StoreTransactionRequest $request)
    {
        $txn = Transaction::create([
            'sender'   => $request->sender,
            'receiver' => $request->receiver,
            'amount'   => $request->amount,
            'timestamp'=> now(),
            'status'   => 'pending',
        ]);

        return response()->json($txn, 201);
    }

    public function pending()
    {
        $txns = Transaction::where('status', 'pending')->orderBy('id','desc')->get();
        return response()->json($txns);
    }
}

