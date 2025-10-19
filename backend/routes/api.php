<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\BlockController;

// Test Route
Route::get('/hello', function () {
    return response()->json(['message' => 'Hello from Laravel!']);
});

// Transaction routes
Route::post('/transaction', [TransactionController::class, 'store']);
Route::get('/transactions/pending', [TransactionController::class, 'pending']);

// Block routes
Route::post('/block/mine', [BlockController::class, 'mine']);
Route::get('/blocks', [BlockController::class, 'index']);

// Blockchain Validation route
Route::get('/blockchain/validate', [BlockController::class, 'validateChain']);
