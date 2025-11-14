import { useState } from "react";
import { register } from "../api";
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await register(name, email, password);

      if (res?.error) {
        setError(res.error || "Registration failed");
      } else {
        navigate("/login");
      }

    } catch (err) {
      setError("Email already registered or network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">

      <form
        onSubmit={handleSubmit}
        className="
          w-full
          max-w-sm
          bg-slate-900
          border border-slate-800
          rounded-xl
          shadow-xl

          /* Responsive padding */
          p-4 sm:p-6
        "
      >
        <h1 className="text-2xl font-bold mb-6 text-center">
          Create Teacher Account
        </h1>

        {/* NAME */}
        <label className="text-sm block mb-1">Full Name</label>
        <input
          className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 mb-4 placeholder:text-slate-400"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your Name"
          required
        />

        {/* EMAIL */}
        <label className="text-sm block mb-1">Email</label>
        <input
          type="email"
          className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 mb-4 placeholder:text-slate-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="teacher@example.com"
          required
        />

        {/* PASSWORD */}
        <label className="text-sm block mb-1">Password</label>
        <input
          type="password"
          className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 mb-4 placeholder:text-slate-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="•••••••"
          required
        />

        {/* ERROR */}
        {error && (
          <p className="text-red-400 text-sm mb-3" role="alert">
            {error}
          </p>
        )}

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 rounded py-2 font-semibold"
        >
          {loading ? "Creating…" : "Create Account"}
        </button>

        {/* LOGIN LINK */}
        <p className="text-center text-sm text-gray-400 mt-3">
          Already have an account?{" "}
          <a href="/login" className="text-blue-400 hover:underline">
            Login
          </a>
        </p>
      </form>

    </div>
  );
}
