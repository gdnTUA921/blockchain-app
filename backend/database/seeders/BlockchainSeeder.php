<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Block;
use App\Models\Transaction;
use Carbon\Carbon;

class BlockchainSeeder extends Seeder
{
    public function run(): void
    {
        // Normalize timestamp exactly like BlockchainService
        $ts = Carbon::now()->utc()->format('Y-m-d\TH:i:s\Z');

        $payload = json_encode([
            'index_no'      => 0,
            'timestamp'     => $ts,
            'transactions'  => [],
            'previous_hash' => null,
            'nonce'         => 0,
        ], JSON_UNESCAPED_SLASHES);

        $genesisHash = hash('sha256', $payload);

        \App\Models\Block::create([
            'index_no'      => 0,
            'previous_hash' => null,
            'current_hash'  => $genesisHash,
            'nonce'         => 0,
            'timestamp'     => Carbon::parse($ts),
        ]);
    }
}

