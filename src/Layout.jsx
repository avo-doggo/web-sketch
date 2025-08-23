import { useState } from "react";
import { Navbar } from "./Components/Navbar";
import { Outlet } from "react-router-dom";
import logo from './Images/WSLogo.png';

export function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Right-side menu button */}
      <button
        onClick={() => setMenuOpen(true)}
        style={{
          position: "fixed",
          top: 20,
          right: 20,
          background: "none",
          border: "none",
          cursor: "pointer",
          zIndex: 1100,
        }}
      >
        <img src={logo} alt="Logo" style={{ width: 50, height: 50 }} />
      </button>

      {/* Dark overlay */}
      {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)}></div>}

      {/* Sidebar */}
      <Navbar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <main>
        <Outlet />
      </main>
    </>
  );
}
