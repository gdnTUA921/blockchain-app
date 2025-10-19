import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function Dashboard() {
  const [valid, setValid] = useState(null);
  const [mining, setMining] = useState(false);
  const [msg, setMsg] = useState("");
  const [pendingCount, setPendingCount] = useState(0);

  const fetchPending = async () => {
    const res = await api.get("/transactions/pending");
    setPendingCount(res.data.length);
  };

  const validate = async () => {
    const res = await api.get("/blockchain/validate");
    setValid(res.data.valid);
    setMsg(res.data.valid ? "✅ Blockchain is valid." : "❌ Blockchain is invalid!");
  };

  const mine = async () => {
    setMining(true);
    setMsg("");
    try {
      await api.post("/block/mine");
      await fetchPending();
      await validate();
      setMsg("🎉 Block mined successfully!");
    } catch (e) {
      setMsg(e.response?.data?.error || "Mining failed.");
    } finally {
      setMining(false);
    }
  };

  useEffect(() => { fetchPending(); validate(); }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">
        Dashboard
      </h1>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
        <div className="card">
          <div className="text-sm text-indigo-300">Pending Transactions</div>
          <div className="text-4xl font-bold text-indigo-400">{pendingCount}</div>
        </div>

        <div className="card">
          <div className="text-sm text-indigo-300">Blockchain Status</div>
          <div className={`text-2xl font-bold ${valid ? "text-green-400" : "text-red-400"}`}>
            {valid === null ? "Checking…" : valid ? "Valid" : "Invalid"}
          </div>
        </div>

        <div className="card flex flex-col gap-3">
          <button onClick={mine} disabled={mining} className="btn-primary">
            {mining ? "Mining..." : "Mine Block"}
          </button>
          <button onClick={validate} className="btn-secondary">Validate Chain</button>
          <p className="text-sm text-gray-400">{msg}</p>
        </div>
      </div>

      <div className="flex gap-3">
        <a href="/transactions" className="btn-secondary">Create Transaction</a>
        <a href="/blocks" className="btn-secondary">View Blocks</a>
      </div>
    </div>
  );
}
