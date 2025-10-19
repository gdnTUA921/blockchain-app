import React from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  const link = ({ isActive }) =>
    `px-3 py-2 rounded-lg font-medium transition ${
      isActive
        ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md"
        : "text-gray-300 hover:text-white hover:bg-white/10"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-[#0f172a]/60 backdrop-blur-md border-b border-white/10 shadow-sm">
      <div className="container flex items-center justify-between py-3">
        <div className="flex items-center gap-3">
          <img src="/Blockchain.png" alt="Logo" className="h-16 w-13 rounded-xl" />
          <div className="text-2xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">
            Blockchain Application
          </div>
          <div className="hidden md:block text-sm text-indigo-300">Secure • Transparent • Immutable</div>
        </div>
        <nav className="flex items-center gap-2">
          <NavLink to="/dashboard" className={link}>Dashboard</NavLink>
          <NavLink to="/transactions" className={link}>Transactions</NavLink>
          <NavLink to="/blocks" className={link}>Blocks</NavLink>
        </nav>
      </div>
    </header>
  );
}
