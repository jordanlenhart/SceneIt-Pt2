import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY 

export default function ShowCard ({ show }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const [details, setDetails] = useState(null);

  useEffect(() => {
    // Fetch full details for each show
    const fetchDetails = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/tv/${show.id}?api_key=${API_KEY}&language=en-US`
        );
        const data = await res.json();
        setDetails(data);
      } catch (err) {
        console.error("Error fetching show details:", err);
      }
    };

    fetchDetails();
  }, [show.id]);

  return (
    <div
      onClick={() => navigate(`/show/${show.id}`)}
      className="relative bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform transform hover:scale-105 w-full h-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {show.poster_path ? (
        <img
          src={`${IMAGE_BASE}${show.poster_path}`}
          alt={show.name}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            hovered ? "opacity-50" : "opacity-100"
          }`}
        />
      ) : (
        <div className="w-full h-full bg-gray-600 flex items-center justify-center">
          No Image
        </div>
      )}

      {/* Overlay on hover */}
      {hovered && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-2 bg-black bg-opacity-50">
          <h2 className="text-lg font-bold">{show.name}</h2>
          <p>{show.vote_average ? `⭐ ${show.vote_average.toFixed(1)}` : "No rating"}</p>
          <p>
            Seasons:{" "}
            {details?.number_of_seasons !== undefined
              ? details.number_of_seasons
              : "?"}
          </p>
          <p>
            Episodes:{" "}
            {details?.number_of_episodes !== undefined
              ? details.number_of_episodes
              : "?"}
          </p>
        </div>
      )}
    </div>
  );
};