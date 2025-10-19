<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = ['sender','receiver','amount','timestamp','status'];

    public function blocks()
    {
        return $this->belongsToMany(Block::class, 'block_transactions')
                    ->withTimestamps();
    }
}

