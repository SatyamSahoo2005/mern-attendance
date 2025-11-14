import { useEffect, useState } from "react";
import {
  getClasses,
  getSession,
  createSession,
  getSessionDetails,
  toggleAttendance,
  updateStudent,
  deleteStudent
} from "../api";

export default function AttendancePage() {
  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [session, setSession] = useState(null);

  useEffect(() => { getClasses().then(setClasses); }, []);

  async function loadSession() {
    if (!classId || !date) return;
    let existing = await getSession(classId, date);
    let sessionObj = existing?.[0] ?? await createSession(classId, date);
    setSession(await getSessionDetails(sessionObj._id));
  }

  async function handleToggle(studentId) {
    await toggleAttendance(session._id, studentId);
    setSession(await getSessionDetails(session._id));
  }

  async function saveStudent(id, roll, name) {
    await updateStudent(id, { roll, name });
    setSession(await getSessionDetails(session._id));
  }

  async function removeStudent(id) {
    await deleteStudent(id);
    setSession(await getSessionDetails(session._id));
  }

  // ----- SUMMARY COUNTS -----
  function summary() {
    if (!session?.marks) return null;
    const total = session.marks.length;
    const present = session.marks.filter(m => m.status === "PRESENT").length;
    const late = session.marks.filter(m => m.status === "LATE").length;
    const absent = session.marks.filter(m => m.status === "ABSENT").length;
    const percent = Math.round((present / total) * 100);
    return { total, present, late, absent, percent };
  }

  const stats = summary();

  return (
    <div className="sm:p-6 p-3">
      <h1 className="text-3xl font-bold mb-6">Attendance</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">

        <select
          className="px-3 py-2 rounded bg-slate-900 border border-slate-800 w-full sm:w-auto"
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
        >
          <option value="">Select Class</option>
          {classes.map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>

        <input
          type="date"
          className="px-3 py-2 rounded bg-slate-900 border border-slate-800 w-full sm:w-auto"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <button className="btn-glow w-full sm:w-auto" onClick={loadSession}>
          Load Attendance
        </button>
      </div>

      {/* Summary */}
      {stats && (
        <div
          className="
            glass-panel rounded-lg p-4 mb-6 border border-slate-800 
            grid grid-cols-3 sm:flex sm:gap-6 text-center
          "
        >
          <div>
            <p className="text-lg font-semibold">{stats.total}</p>
            <p className="text-sm text-gray-400">Total</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-green-400">{stats.present}</p>
            <p className="text-sm text-gray-400">Present</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-yellow-300">{stats.late}</p>
            <p className="text-sm text-gray-400">Late</p>
          </div>
          <div className="hidden sm:block">
            <p className="text-lg font-semibold text-red-400">{stats.absent}</p>
            <p className="text-sm text-gray-400">Absent</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-blue-400">{stats.percent}%</p>
            <p className="text-sm text-gray-400">Attendance %</p>
          </div>

          {/* Mobile-only absent */}
          <div className="sm:hidden mt-3">
            <p className="text-lg font-semibold text-red-400">{stats.absent}</p>
            <p className="text-sm text-gray-400">Absent</p>
          </div>
        </div>
      )}

      {/* Table */}
      {session && session.marks && (
        <div className="glass-panel rounded-xl overflow-x-auto border border-slate-800 shadow">

          <table className="min-w-full text-sm">
            <thead className="bg-slate-900/60">
              <tr>
                <th className="p-3 text-left">Roll</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {session.marks.map((m) => (
                <EditableRow
                  key={m.studentId._id}
                  mark={m}
                  onToggle={handleToggle}
                  onSave={saveStudent}
                  onDelete={removeStudent}
                />
              ))}
            </tbody>

          </table>
        </div>
      )}
    </div>
  );
}

function EditableRow({ mark, onToggle, onSave, onDelete }) {
  const s = mark.studentId;
  const [editing, setEditing] = useState(false);
  const [roll, setRoll] = useState(s.roll);
  const [name, setName] = useState(s.name);

  return (
    <tr className="border-t border-slate-800">

      <td className="p-3">
        {editing ? (
          <input
            className="w-24 bg-slate-900 border border-slate-700 rounded px-2 py-1"
            value={roll}
            onChange={(e) => setRoll(e.target.value)}
          />
        ) : s.roll}
      </td>

      <td className="p-3">
        {editing ? (
          <input
            className="w-40 bg-slate-900 border border-slate-700 rounded px-2 py-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        ) : s.name}
      </td>

      <td className="p-3 text-center">
        <button
          className={
            "px-4 py-1 rounded text-white " +
            (mark.status === "PRESENT"
              ? "bg-green-600"
              : mark.status === "LATE"
              ? "bg-yellow-500"
              : "bg-red-600")
          }
          onClick={() => onToggle(s._id)}
        >
          {mark.status}
        </button>
      </td>

      <td className="p-3 text-center space-x-2">
        {!editing ? (
          <button className="btn-glow px-3 py-1" onClick={() => setEditing(true)}>
            Edit
          </button>
        ) : (
          <button
            className="btn-glow px-3 py-1"
            onClick={() => { onSave(s._id, roll, name); setEditing(false); }}
          >
            Save
          </button>
        )}

        <button className="btn-danger px-3 py-1" onClick={() => onDelete(s._id)}>
          Delete
        </button>
      </td>

    </tr>
  );
}
