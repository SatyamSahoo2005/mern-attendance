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
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-box">
        <h1 className="text-2xl font-bold mb-6 text-center">Teacher Login</h1>

        <label className="text-sm">Email</label>
        <input
          className="form-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="teacher@demo.com"
        />

        <label className="text-sm">Password</label>
        <input
          type="password"
          className="form-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />

        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

        <button type="submit" disabled={loading} className="btn-glow w-full text-center disabled:opacity-60">
          {loading ? "Signing in…" : "Login"}
        </button>

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
