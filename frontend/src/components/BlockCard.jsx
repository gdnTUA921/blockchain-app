import React from "react";

export default function BlockCard({ block }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-xs text-gray-500">Index</div>
          <div className="text-lg font-semibold">{block.index_no}</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500">Transactions</div>
          <div className="text-lg font-semibold">
            {block.transactions_count ?? (block.transactions ? block.transactions.length : 0)}
          </div>
        </div>
      </div>

      <div className="mt-3 grid gap-2 text-sm">
        <div>
          <div className="text-xs text-gray-500">Previous Hash</div>
          <div className="font-mono break-all">{block.previous_hash ?? "null"}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Current Hash</div>
          <div className="font-mono break-all">{block.current_hash}</div>
        </div>
        <div className="flex justify-between text-gray-600">
          <div>Nonce: {block.nonce}</div>
          <div>{new Date(block.timestamp).toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}
