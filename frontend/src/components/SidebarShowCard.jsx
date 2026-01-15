import { Link } from "react-router-dom";
import FavoriteHeart from "./FavoriteHeart";

export default function SidebarShowCard({ show }) {
  const title = show.title || show.name;
  const poster = show.poster_path
    ? `https://image.tmdb.org/t/p/w185${show.poster_path}`
    : null;

  return (
    <Link
      to={`/show/${show.id}`}
      className="relative flex items-center border border-gray-50/10 shadow-[0px_2px_8px_rgba(255,255,255,.3)] hover:shadow-[0px_2px_8px_rgba(255,255,255,.53)] gap-4 rounded-md hover:bg-zinc-800 transition"
    >
      {/* Poster */}
      {poster ? (
        <img
          src={poster}
          alt={title}
          className="w-12 h-full object-cover rounded-md"
        />
      ) : (
        <div className="w-12 h-16 bg-zinc-700 rounded-md flex items-center justify-center text-xs text-zinc-300">
          No Image
        </div>
      )}

      {/* Text block */}
      <div className="flex flex-col overflow-hidden">
        <span className="text-sm font-medium text-white truncate">
          {title}
        </span>

        <span className="text-xs text-zinc-400">
          {show.media_type === "tv" ? "TV Show" : "Movie"}
        </span>
      </div>
      <FavoriteHeart />
    </Link>
  );
}
