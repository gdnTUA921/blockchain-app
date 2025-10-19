<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTransactionRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'sender'   => ['required','string','min:1'],
            'receiver' => ['required','string','min:1','different:sender'],
            'amount'   => ['required','numeric','gt:0'],
        ];
    }

    public function messages(): array
    {
        return [
            'receiver.different' => 'Sender and receiver must be different.',
        ];
    }
}

