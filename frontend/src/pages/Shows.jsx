import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api";

export default function Shows() {
  const nav = useNavigate();
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await apiFetch("/shows");
        const list = Array.isArray(data) ? data : (data?.shows ?? []);
        setShows(list);
      } catch (e) {
        setErr(e.message || "Failed to load shows");
        // If token missing/expired, send user to login
        if (String(e.message).includes("401")) nav("/login", { replace: true });
      } finally {
        setLoading(false);
      }
    })();
  }, [nav]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-5xl mx-auto grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-40 rounded-xl bg-slate-200 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (err) {
    return <div className="p-6 text-red-600">{err}</div>;
  }

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Shows</h2>

        {shows.length === 0 ? (
          <p className="text-slate-500">No shows yet.</p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {shows.map((s) => (
              <li key={s.id} className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                {/* Poster */}
                {s.image_url ? (
                  <img src={s.image_url} alt={s.title} className="w-full h-36 object-cover" />
                ) : (
                  <div className="w-full h-36 bg-slate-100 flex items-center justify-center text-slate-400">
                    No image
                  </div>
                )}
                {/* Body */}
                <div className="p-3">
                  <div className="font-semibold text-slate-900">
                    {s.title} {s.release_year ? <span className="text-slate-500">({s.release_year})</span> : null}
                  </div>
                  <div className="text-sm text-slate-500">{s.genre || "—"}</div>
                  {s.description ? (
                    <p className="text-sm text-slate-600 mt-1 line-clamp-2">{s.description}</p>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
