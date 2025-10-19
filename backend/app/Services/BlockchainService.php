<?php

namespace App\Services;

use App\Models\Block;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class BlockchainService
{
    protected int $difficulty = 2; // "00" prefix

    /** ---------- Normalizers (single source of truth) ---------- */

    /** Always use UTC and no milliseconds: 2025-10-18T09:30:45Z */
    private function normTs($ts): string
    {
        if ($ts instanceof Carbon) {
            return $ts->clone()->utc()->format('Y-m-d\TH:i:s\Z');
        }
        // strings / DB values
        return Carbon::parse($ts)->utc()->format('Y-m-d\TH:i:s\Z');
    }

    /** Always 2 decimals, dot as separator: "25.50" */
    private function normAmt($amt): string
    {
        return number_format((float)$amt, 2, '.', '');
    }

    /** Deterministic JSON payload for hashing */
    public function generateBlockPayload(array $data): string
    {
        return json_encode([
            'index_no'      => (int) $data['index_no'],
            'timestamp'     => $this->normTs($data['timestamp']),
            'transactions'  => array_map(function ($t) {
                return [
                    'sender'    => (string)$t['sender'],
                    'receiver'  => (string)$t['receiver'],
                    'amount'    => $this->normAmt($t['amount']),
                    'timestamp' => $this->normTs($t['timestamp']),
                ];
            }, $data['transactions']),
            'previous_hash' => $data['previous_hash'], // null or string
            'nonce'         => (int) $data['nonce'],
        ], JSON_UNESCAPED_SLASHES);
    }

    public function hash(string $payload): string
    {
        return hash('sha256', $payload);
    }

    /** ---------- Proof of Work ---------- */
    public function mine(array $blockData): array
    {
        $prefix = str_repeat('0', $this->difficulty);
        $nonce = 0; $hash = '';

        do {
            $blockData['nonce'] = $nonce;
            $payload = $this->generateBlockPayload($blockData);
            $hash = $this->hash($payload);
            $nonce++;
        } while (substr($hash, 0, $this->difficulty) !== $prefix);

        $blockData['nonce'] = $nonce - 1;
        $blockData['current_hash'] = $hash;
        return $blockData;
    }

    /** ---------- Validation ---------- */
    public function validateChain(): bool
    {
        $blocks = Block::orderBy('index_no')->get();
        if ($blocks->isEmpty()) return false;

        foreach ($blocks as $i => $block) {
            // Deterministic order of txns
            $txns = $block->transactions()
                ->orderBy('transactions.id')
                ->get()
                ->map(fn($t) => [
                    'sender'    => $t->sender,
                    'receiver'  => $t->receiver,
                    'amount'    => $this->normAmt($t->amount),
                    'timestamp' => $this->normTs($t->timestamp),
                ])->toArray();

            $payload = $this->generateBlockPayload([
                'index_no'      => $block->index_no,
                'timestamp'     => $this->normTs($block->timestamp),
                'transactions'  => $txns,
                'previous_hash' => $block->previous_hash,
                'nonce'         => $block->nonce,
            ]);

            $recomputed = $this->hash($payload);

            if ($recomputed !== $block->current_hash) {
                logger("Invalid hash on block {$block->id}. expected={$block->current_hash} recomputed={$recomputed} payload={$payload}");
                return false;
            }

            if ($i > 0) {
                $prev = $blocks[$i - 1];
                if ($block->previous_hash !== $prev->current_hash) {
                    logger("Broken link between block {$prev->id} and {$block->id}");
                    return false;
                }
            }
        }
        return true;
    }

    /** ---------- Mine pending ---------- */
    public function minePendingTransactions(): Block
    {
        return DB::transaction(function () {
            $pending = Transaction::where('status', 'pending')->orderBy('id')->get();
            if ($pending->isEmpty()) {
                throw new \RuntimeException('No pending transactions to mine.');
            }

            $lastBlock = Block::orderByDesc('index_no')->first();
            $nextIndex = $lastBlock ? $lastBlock->index_no + 1 : 0;

            // Use ONE base timestamp for this block (Carbon in UTC)
            $blockTs = now()->utc(); // Carbon instance

            $blockData = [
                'index_no'      => $nextIndex,
                'timestamp'     => $blockTs, // Carbon; payload builder will normalize
                'transactions'  => $pending->map(fn($t) => [
                    'sender'    => $t->sender,
                    'receiver'  => $t->receiver,
                    'amount'    => $this->normAmt($t->amount),
                    'timestamp' => $t->timestamp, // will be normalized
                ])->toArray(),
                'previous_hash' => $lastBlock?->current_hash,
                'nonce'         => 0,
            ];

            $mined = $this->mine($blockData);

            // Save the same base timestamp to DB (no timezone in DB; Carbon -> datetime)
            $block = Block::create([
                'index_no'      => $mined['index_no'],
                'previous_hash' => $mined['previous_hash'],
                'current_hash'  => $mined['current_hash'],
                'nonce'         => $mined['nonce'],
                'timestamp'     => $blockTs, // same Carbon as used in payload
            ]);

            $block->transactions()->attach($pending->pluck('id')->toArray());
            Transaction::whereIn('id', $pending->pluck('id'))->update(['status' => 'mined']);

            return $block;
        });
    }
}
