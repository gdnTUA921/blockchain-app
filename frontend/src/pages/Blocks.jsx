import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function Blocks() {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBlocks = async () => {
    setLoading(true);
    const res = await api.get("/blocks");
    setBlocks(res.data);
    setLoading(false);
  };

  useEffect(() => { fetchBlocks(); }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">
        Blocks
      </h1>

      <div className="flex justify-end mb-4">
        <button onClick={fetchBlocks} className="btn-secondary">Refresh</button>
      </div>

      {loading ? (
        <div>Loading…</div>
      ) : blocks.length === 0 ? (
        <div className="text-gray-400">No blocks yet.</div>
      ) : (
        <div className="space-y-6">
          {blocks.map(b => (
            <div key={b.id} className="card border border-indigo-400/10">
              <div className="flex justify-between mb-2">
                <div>
                  <div className="text-xs text-indigo-300">Index</div>
                  <div className="text-xl font-semibold text-indigo-400">{b.index_no}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-indigo-300">Transactions</div>
                  <div className="text-lg font-semibold text-indigo-200">{b.transactions_count}</div>
                </div>
              </div>

              <div className="text-sm">
                <div>
                  <span className="text-indigo-300 font-semibold">Prev Hash:</span>{" "}
                  <span className="block-hash">{b.previous_hash ?? "null"}</span>
                </div>
                <div className="mt-1">
                  <span className="text-indigo-300 font-semibold">Curr Hash:</span>{" "}
                  <span className="block-hash">{b.current_hash}</span>
                </div>
              </div>

              <div className="block-meta">
                <span>Nonce: {b.nonce}</span>
                <span>{new Date(b.timestamp).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
