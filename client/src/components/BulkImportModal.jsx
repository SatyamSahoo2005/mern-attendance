import { useState } from "react";
import { importStudents } from "../api";

export default function BulkImportModal({ classObj, onClose }) {
  const [text, setText] = useState("");
  const [status, setStatus] = useState("");
  const [err, setErr] = useState("");

  async function handleImport() {
    setErr("");
    setStatus("");
    if (!classObj?._id) {
      setErr("Class is not selected.");
      return;
    }

    // Parse "ROLL, Name" lines → [{ roll, name }]
    const rows = text
      .trim()
      .split("\n")
      .map((line) => {
        const [roll, name] = line.split(",");
        return { roll: roll?.trim(), name: name?.trim() };
      })
      .filter((r) => r.roll && r.name);

    try {
      const data = await importStudents(classObj._id, rows);
      const imported = Number(data.imported || 0);
      const skipped = Number(data.skipped || 0);
      setStatus(`✅ Imported: ${imported} | ⚠️ Skipped (duplicates/blank): ${skipped}`);
    } catch (e) {
      setErr(e.message || "Import failed");
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-6">
      <div className="glass-panel p-6 rounded-xl w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">
          Import Students → {classObj?.name || "Unknown"}
        </h2>

        <p className="text-sm text-gray-400 mb-3">
          Format:
          <br />
          23BCSF27, Satyam Sahoo
          <br />
          22BCSD33, Rahul Singh
          <br />
          24BCSC45, Priya Mishra
        </p>

        <textarea
          rows={8}
          className="w-full p-3 rounded bg-slate-900 border border-slate-700"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {status && <p className="text-green-400 my-3">{status}</p>}
        {err && <p className="text-red-400 my-3">{err}</p>}

        <div className="flex justify-end gap-3 mt-4">
          <button className="btn-danger" onClick={onClose}>Close</button>
          <button className="btn-glow" onClick={handleImport}>Import</button>
        </div>
      </div>
    </div>
  );
}
