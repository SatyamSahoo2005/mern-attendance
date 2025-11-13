import { useState } from "react";
import { login } from "../api";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("teacher@demo.com");
  const [password, setPassword] = useState("teacher123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/classes");
    } catch (err) {
      setError("Invalid email or password");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm glass-panel p-6 rounded-xl shadow-2xl border border-slate-800"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Teacher Login</h1>

        <label className="text-sm">Email</label>
        <input
          className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="teacher@demo.com"
        />

        <label className="text-sm">Password</label>
        <input
          type="password"
          className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />

        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="btn-glow w-full text-center disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Login"}
        </button>

        {/* NEW - Signup Link */}
        <p className="text-center text-sm text-gray-400 mt-4">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-400 hover:underline">
            Create one
          </a>
        </p>
      </form>
    </div>
  );
}
