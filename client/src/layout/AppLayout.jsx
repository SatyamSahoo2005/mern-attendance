import { Link, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function AppLayout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [open, setOpen] = useState(false); // mobile menu toggle

  function logout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <div className="app-container">

      {/* MOBILE TOP BAR */}
      <header className="mobile-header">
        <button className="mobile-menu-btn" onClick={() => setOpen(!open)}>
          ☰
        </button>
        <span className="mobile-title">Attendance System</span>
      </header>

      {/* SIDEBAR */}
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <h1 className="text-xl font-bold mb-8 hidden-mobile">
          Attendance System
        </h1>

        <nav className="space-y-2 flex-1">
          <Link className="nav-link" to="/classes" onClick={() => setOpen(false)}>Classes</Link>
          <Link className="nav-link" to="/attendance" onClick={() => setOpen(false)}>Attendance</Link>
          <Link className="nav-link" to="/reports" onClick={() => setOpen(false)}>Reports</Link>
          <Link className="nav-link" to="/profile" onClick={() => setOpen(false)}>Profile</Link>
        </nav>

        <div className="sidebar-footer">
          <p className="text-sm text-slate-400 mb-2">{user?.name}</p>
          <button onClick={logout} className="btn-danger w-full text-center">
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
