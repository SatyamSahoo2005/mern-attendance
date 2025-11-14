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

  if (!profile) return <div className="p-6">Loading...</div>;

  return (
    <div
      className="
        max-w-md mx-auto 
        glass-panel 
        rounded-xl shadow-lg 

        /* Mobile responsive changes */
        p-4 sm:p-6
        w-full
      "
    >
      <h1 className="text-2xl font-bold mb-6 text-center sm:text-left">
        Profile
      </h1>

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

      <button className="btn-glow w-full" onClick={saveChanges}>
        Save Changes
      </button>
    </div>
  );
}
