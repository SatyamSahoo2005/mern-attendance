import { Link, Outlet, useNavigate } from "react-router-dom";

export default function AppLayout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  function logout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100">
      <aside className="w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col">
        <h1 className="text-xl font-bold mb-8">Attendance System</h1>

        <nav className="space-y-2 flex-1">
          <Link className="block px-3 py-2 rounded hover:bg-slate-800" to="/classes">Classes</Link>
          <Link className="block px-3 py-2 rounded hover:bg-slate-800" to="/attendance">Attendance</Link>
          <Link className="block px-3 py-2 rounded hover:bg-slate-800" to="/reports">Reports</Link>
          <Link className="block px-3 py-2 rounded hover:bg-slate-800" to="/profile">Profile</Link>
        </nav>

        <div className="mt-auto">
          <p className="text-sm text-slate-400 mb-2">{JSON.parse(localStorage.getItem("user"))?.name}</p>
          <button onClick={logout} className="btn-danger w-full text-center">Logout</button>
        </div>
      </aside>


      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
