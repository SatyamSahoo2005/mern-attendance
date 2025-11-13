import { useEffect, useState } from "react";
import { getClasses, getReport } from "../api";

export default function ReportsPage() {
  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState("");
  const [report, setReport] = useState([]);

  useEffect(() => { getClasses().then(setClasses); }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Attendance Report</h1>

      <div className="flex gap-3 mb-6">
        <select className="bg-slate-900 border border-slate-700 p-2 rounded"
          value={classId} onChange={(e) => setClassId(e.target.value)}>
          <option value="">Select Class</option>
          {classes.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>

        <button className="btn-glow" onClick={async () => setReport(await getReport(classId))}>
          Generate
        </button>
      </div>

      {report.length > 0 && (
        <div className="glass-panel rounded-xl border border-slate-800 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-800">
              <tr>
                <th className="p-3 text-left">Roll</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-center">%</th>
                <th className="p-3 text-center">P</th>
                <th className="p-3 text-center">L</th>
                <th className="p-3 text-center">A</th>
                <th className="p-3 text-center">Total</th>
              </tr>
            </thead>
            <tbody>
              {report.map((r) => (
                <tr key={r.roll} className="border-t border-slate-800">
                  <td className="p-3">{r.roll}</td>
                  <td className="p-3">{r.name}</td>
                  <td className="p-3 text-center text-indigo-400 font-semibold">{r.percentage}%</td>
                  <td className="p-3 text-center text-green-400">{r.present}</td>
                  <td className="p-3 text-center text-yellow-300">{r.late}</td>
                  <td className="p-3 text-center text-red-400">{r.absent}</td>
                  <td className="p-3 text-center">{r.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
