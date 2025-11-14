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
      // api.login returns the user object on success, undefined on failure
      const user = await login(email.trim(), password);
      if (!user) {
        // If login failed, api.login doesn't throw — show a generic message.
        setError("Invalid email or password");
      } else {
        // success -> navigate
        navigate("/classes");
      }
    } catch (err) {
      // network or other unexpected errors
      setError(err?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="
          w-full
          max-w-md
          bg-slate-900
          border border-slate-800
          rounded-xl
          shadow-2xl
          p-6
          flex
          flex-col
          gap-4
        "
        aria-label="Teacher login form"
      >
        <h1 className="text-2xl font-bold mb-2 text-center">Teacher Login</h1>

        {/* Email */}
        <div className="flex flex-col">
          <label className="text-sm mb-1">Email</label>
          <input
            type="email"
            className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 placeholder:text-slate-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="teacher@demo.com"
            required
            autoComplete="username"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col">
          <label className="text-sm mb-1">Password</label>
          <input
            type="password"
            className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 placeholder:text-slate-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />
        </div>

        {/* Error */}
        {error && <p className="text-red-400 text-sm mt-1" role="alert">{error}</p>}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="btn-glow w-full py-2 disabled:opacity-60 mt-2"
        >
          {loading ? "Signing in…" : "Login"}
        </button>

        {/* Signup link */}
        <p className="text-center text-sm text-gray-400 mt-2">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-400 hover:underline">
            Create one
          </a>
        </p>
      </form>
    </div>
  );
}
