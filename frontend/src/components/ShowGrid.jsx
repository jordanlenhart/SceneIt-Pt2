import { Link } from "react-router-dom";

const IMG_BASE = "https://image.tmdb.org/t/p/w500";

export default function ShowGrid({ shows })  {
  if (!shows || shows.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {shows.map((show) => (
        <div key={show.id} className="bg-slate-800 rounded-lg shadow-md">
          <Link to={`/shows/${show.id}`}>
            {show.poster_path ? (
              <img
                src={`${IMG_BASE}${show.poster_path}`}
                alt={show.name}
                className="rounded-t-lg w-full h-72 object-cover"
              />
            ) : (
              <div className="w-full h-72 bg-gray-700 flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </Link>
          <div className="p-2 text-center text-white">
            <h3 className="text-sm font-medium">{show.name}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};