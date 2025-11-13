import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../api";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    getProfile().then((data) => {
      setProfile(data);
      setName(data.name);
    });
  }, []);

  async function saveChanges() {
    await updateProfile({ name, password: password || undefined });
    setMsg("Profile updated successfully!");
    if (name)
      localStorage.setItem("user", JSON.stringify({ ...profile, name }));
  }

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="max-w-md mx-auto glass-panel p-6 rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>

      {msg && <p className="text-green-400 mb-3 text-sm">{msg}</p>}

      <label className="text-sm">Name</label>
      <input
        className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 mb-4"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label className="text-sm">New Password (optional)</label>
      <input
        type="password"
        className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 mb-4"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={saveChanges} className="btn-glow w-full">
        Save Changes
      </button>
    </div>
  );
}
