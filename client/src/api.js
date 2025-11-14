const API_BASE = "https://mern-attendance-server.onrender.com/api";

// ---------------------- TOKEN HELPERS ----------------------
export function setAuthToken(token) {
  localStorage.setItem("authToken", token);
}

function authHeaders() {
  const token = localStorage.getItem("authToken");
  return token
    ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
}

// ---------------------- AUTH ----------------------
export async function login(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (data.token) {
    setAuthToken(data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
  }

  return data;
}

export async function register(name, email, password) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  return res.json();
}

export async function getTeachers() {
  const res = await fetch(`${API_BASE}/auth/teachers`, { headers: authHeaders() });
  return res.json();
}

// ---------------------- CLASSES ----------------------
export async function getClasses() {
  const res = await fetch(`${API_BASE}/classes`, { headers: authHeaders() });
  return res.json();
}

// ---------------------- STUDENTS ----------------------
export async function getStudents(classId) {
  const res = await fetch(`${API_BASE}/students?classId=${classId}`, {
    headers: authHeaders(),
  });
  return res.json();
}

export async function addStudent(student) {
  const res = await fetch(`${API_BASE}/students`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(student),
  });
  return res.json();
}

export async function updateStudent(id, data) {
  const res = await fetch(`${API_BASE}/students/${id}`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteStudent(id) {
  const res = await fetch(`${API_BASE}/students/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return res.json();
}

// ---------------------- ATTENDANCE ----------------------
export async function createSession(classId, date) {
  const res = await fetch(`${API_BASE}/sessions`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ classId, date }),
  });
  return res.json();
}

export async function getSession(classId, date) {
  const res = await fetch(`${API_BASE}/sessions?classId=${classId}&date=${date}`, {
    headers: authHeaders(),
  });
  return res.json();
}

export async function getSessionDetails(sessionId) {
  const res = await fetch(`${API_BASE}/sessions/${sessionId}`, {
    headers: authHeaders(),
  });
  return res.json();
}

export async function toggleAttendance(sessionId, studentId) {
  const res = await fetch(`${API_BASE}/sessions/${sessionId}/toggle`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ studentId }),
  });
  return res.json();
}

// ---------------------- REPORT ----------------------
export async function getReport(classId) {
  const res = await fetch(`${API_BASE}/sessions/report/${classId}`, {
    headers: authHeaders(),
  });
  return res.json();
}

// ---------------------- PROFILE ----------------------
export async function getProfile() {
  const res = await fetch(`${API_BASE}/profile/me`, {
    headers: authHeaders(),
  });
  return res.json();
}

export async function updateProfile(payload) {
  const res = await fetch(`${API_BASE}/profile/update`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  return res.json();
}

// ---------------------- BULK IMPORT ----------------------
export async function importStudents(classId, students) {
  const res = await fetch(`${API_BASE}/students/import`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ classId, students }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Import failed: ${res.status}`);
  }
  return res.json();
}
