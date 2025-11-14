import { useEffect, useState } from "react";
import { getClasses, getReport } from "../api";

export default function ReportsPage() {
  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState("");
  const [report, setReport] = useState([]);

  useEffect(() => {
    getClasses().then(setClasses);
  }, []);

  async function loadReport() {
    if (!classId) return;
    const data = await getReport(classId);
    setReport(data);
  }

  return (
    <div className="sm:p-6 p-4">
      {/* PAGE TITLE */}
      <h1 className="font-bold mb-6 sm:text-3xl text-2xl">Attendance Report</h1>

      {/* FILTER SECTION */}
      <div
        className="
          flex 
          sm:flex-row flex-col 
          gap-3 
          mb-6
        "
      >
        <select
          className="
            bg-slate-900 
            border border-slate-700 
            p-2 
            rounded 
            sm:w-auto 
            w-full
          "
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
        >
          <option value="">Select Class</option>
          {classes.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        <button className="btn-glow sm:w-auto w-full" onClick={loadReport}>
          Generate
        </button>
      </div>

      {/* TABLE */}
      {report.length > 0 && (
        <div className="glass-panel rounded-xl border border-slate-800 overflow-hidden">
          
          {/* enable scroll on small screens */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-sm">
              <thead className="bg-slate-800 text-left">
                <tr>
                  <th className="p-3">Roll</th>
                  <th className="p-3">Name</th>
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
                    <td className="p-3 text-center text-indigo-400 font-semibold">
                      {r.percentage}%
                    </td>
                    <td className="p-3 text-center text-green-400">{r.present}</td>
                    <td className="p-3 text-center text-yellow-300">{r.late}</td>
                    <td className="p-3 text-center text-red-400">{r.absent}</td>
                    <td className="p-3 text-center">{r.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* IF NO REPORT */}
      {report.length === 0 && (
        <p className="text-gray-400 mt-3">Generate a report to view results.</p>
      )}
    </div>
  );
}
