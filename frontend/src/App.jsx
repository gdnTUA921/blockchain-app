import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Blocks from "./pages/Blocks";

export default function App() {
  return (
    <div>
      <Navbar />
      <main className="container mt-6">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/blocks" element={<Blocks />} />
        </Routes>
      </main>
    </div>
  );
}
