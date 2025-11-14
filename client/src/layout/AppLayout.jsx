import { Link, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function AppLayout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [open, setOpen] = useState(false);

  function logout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <div className="layout-wrapper">

      {/* MOBILE TOP BAR */}
      <header className="layout-mobile-header">
        <button className="layout-mobile-btn" onClick={() => setOpen(!open)}>
          ☰
        </button>
        <span className="layout-mobile-title">Attendance System</span>
      </header>

      {/* SIDEBAR */}
      <aside className={`layout-sidebar ${open ? "open" : ""}`}>
        <h1 className="text-xl font-bold mb-8 desktop-only">
          Attendance System
        </h1>

        <nav className="space-y-2 flex-1">
          <Link className="side-nav-link" to="/classes" onClick={() => setOpen(false)}>Classes</Link>
          <Link className="side-nav-link" to="/attendance" onClick={() => setOpen(false)}>Attendance</Link>
          <Link className="side-nav-link" to="/reports" onClick={() => setOpen(false)}>Reports</Link>
          <Link className="side-nav-link" to="/profile" onClick={() => setOpen(false)}>Profile</Link>
        </nav>

        <div className="layout-sidebar-footer">
          <p className="text-sm text-slate-400 mb-2">{user?.name}</p>
          <button onClick={logout} className="btn-danger w-full text-center">
            Logout
          </button>
        </div>
      </aside>

      <main className="layout-main">
        <Outlet />
      </main>
    </div>
  );
}
