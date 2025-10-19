import React, { useEffect, useState } from "react";
import api from "../services/api";

function TransactionForm({ onCreated }) {
  const [sender, setSender] = useState("");
  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    await api.post("/transaction", { sender, receiver, amount: parseFloat(amount) });
    setSender(""); setReceiver(""); setAmount("");
    onCreated();
  };

  return (
    <form onSubmit={submit} className="card grid md:grid-cols-3 gap-3 mb-6">
      <input value={sender} onChange={e=>setSender(e.target.value)} placeholder="Sender" className="p-2 border rounded-lg" required />
      <input value={receiver} onChange={e=>setReceiver(e.target.value)} placeholder="Receiver" className="p-2 border rounded-lg" required />
      <div className="flex gap-2">
        <input value={amount} onChange={e=>setAmount(e.target.value)} type="number" step="0.01" placeholder="Amount" className="p-2 border rounded-lg flex-1 text-black" required />
        <button className="btn-primary">Add</button>
      </div>
    </form>
  );
}

export default function Transactions() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPending = async () => {
    setLoading(true);
    const res = await api.get("/transactions/pending");
    setPending(res.data);
    setLoading(false);
  };

  useEffect(() => { fetchPending(); }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-indigo-700">Transactions</h1>
      <TransactionForm onCreated={fetchPending} />
      <div className="card overflow-x-auto">
        <h2 className="text-lg font-semibold mb-3">Pending Transactions</h2>
        {loading ? (
          <div>Loading...</div>
        ) : pending.length === 0 ? (
          <div className="text-gray-500">No pending transactions.</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="table-header">
              <tr>
                <th className="table-cell">ID</th>
                <th className="table-cell">Sender</th>
                <th className="table-cell">Receiver</th>
                <th className="table-cell">Amount</th>
                <th className="table-cell">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {pending.map(t => (
                <tr key={t.id} className="hover:bg-indigo-50/40">
                  <td className="table-cell">{t.id}</td>
                  <td className="table-cell">{t.sender}</td>
                  <td className="table-cell">{t.receiver}</td>
                  <td className="table-cell text-indigo-700 font-medium">{Number(t.amount).toFixed(2)}</td>
                  <td className="table-cell text-gray-600">{new Date(t.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
