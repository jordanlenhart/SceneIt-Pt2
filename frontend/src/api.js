// frontend/src/api.js
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export function getToken() {
  return localStorage.getItem("token");
}

export function setToken(t) {
  if (t) localStorage.setItem("token", t);
  else localStorage.removeItem("token");
}

export async function apiFetch(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const j = await res.json();
      msg += ` - ${j.error || JSON.stringify(j)}`;
    } catch {}
    throw new Error(msg);
  }
  return res.status === 204 ? null : res.json();
}

// ⭐ the export your Login.jsx needs
export async function login({ email, password }) {
  const data = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  setToken(data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
  return data;
}
