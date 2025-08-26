import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, apiFetch } from "../api";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("tester@example.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true); setMsg(""); setErr("");
    try {
      await login({ email, password });
      await apiFetch("/private/ping"); // optional smoke test
      setMsg("Signed in successfully");
      nav("/", { replace: true });
    } catch (e2) {
      setErr(e2.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-slate-900">Log in</h1>
        <p className="text-slate-500 text-sm mt-1">
          Access your account to manage shows and playlists.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-900">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2
                         focus:outline-none focus:ring-4 focus:ring-[#073b4c]/30 focus:border-[#073b4c]"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-900">
              Password (dev)
            </label>
            <input
              id="password"
              type="password"
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2
                         focus:outline-none focus:ring-4 focus:ring-[#073b4c]/30 focus:border-[#073b4c]"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#073b4c] text-white font-semibold py-2.5
                       hover:bg-[#0b4f63] shadow-md
                       focus:outline-none focus:ring-4 focus:ring-[#073b4c]/30
                       disabled:opacity-70"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>

          {msg && <p className="text-green-600 text-sm">{msg}</p>}
          {err && <p className="text-red-600 text-sm">{err}</p>}
        </form>
      </div>
    </div>
  );
}
