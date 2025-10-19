<?php

namespace App\Http\Controllers;

use App\Models\Block;
use App\Services\BlockchainService;

class BlockController extends Controller
{
    public function __construct(private BlockchainService $chain) {}

    public function index()
    {
        $blocks = Block::withCount('transactions')->orderBy('index_no')->get();
        return response()->json($blocks);
    }

    public function mine()
    {
        try {
            $block = $this->chain->minePendingTransactions();
            return response()->json([
                'message' => 'Block mined successfully.',
                'block'   => $block->loadCount('transactions')
            ], 201);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }

    public function validateChain()
    {
        $valid = $this->chain->validateChain();
        return response()->json(['valid' => $valid]);
    }
}

