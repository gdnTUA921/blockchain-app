<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BlockTransaction extends Model
{
    protected $fillable = ['block_id','transaction_id'];
}
