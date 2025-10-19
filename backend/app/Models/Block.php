<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Block extends Model
{
    use HasFactory;

    protected $fillable = ['index_no','previous_hash','current_hash','nonce','timestamp'];

    public function transactions()
    {
        return $this->belongsToMany(Transaction::class, 'block_transactions')
                    ->withTimestamps();
    }
}

