import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ShowCard from "../components/ShowCard";

const API_KEY = "77a22f18008a567c7820ad861f4a5dc7"; // need to move later

const ShowPage = () => {
  const { id } = useParams();
  const [details, setDetails] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);

  // ⭐ Local states
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [watched, setWatched] = useState(false);
  const [listed, setListed] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}&language=en-US`
        );
        const data = await res.json();
        setDetails(data);

        // fetch similar shows
        const simRes = await fetch(
          `https://api.themoviedb.org/3/tv/${id}/similar?api_key=${API_KEY}&language=en-US&page=1`
        );
        const simData = await simRes.json();
        setSimilar(simData.results || []);
      } catch (err) {
        console.error("Error fetching show details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) return <p className="text-white p-6">Loading...</p>;
  if (!details) return <p className="text-white p-6">Show not found</p>;

  return (
    <div className="bg-primary min-h-screen text-white p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Hero Poster */}
        <div>
          {details.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w500${details.poster_path}`}
              alt={details.name}
              className="rounded-lg shadow-lg"
            />
          ) : (
            <div className="w-full h-96 bg-accent flex items-center justify-center rounded-lg">
              No Image
            </div>
          )}
        </div>

        {/* Show Details */}
        <div className="md:col-span-2">
          <h1 className="text-4xl font-bold mb-2">{details.name}</h1>

          {/* TMDB Rating */}
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-highlight text-xl">⭐</span>
            <span className="text-lg font-semibold">
              {details.vote_average?.toFixed(1)}
            </span>
            <span className="text-accent text-sm">
              ({details.vote_count?.toLocaleString()} ratings)
            </span>
          </div>

          <p className="text-accent mb-4">
            {details.first_air_date?.split("-")[0]}{" "}
            {details.created_by?.length > 0 &&
              ` | Creator: ${details.created_by[0].name}`}
          </p>

          <p className="text-accent mb-4">
            {details.number_of_seasons} seasons •{" "}
            {details.number_of_episodes} episodes
          </p>

          <p className="text-white leading-relaxed">{details.overview}</p>

          {/* User Rating (⭐ out of 5) */}
          <div className="mt-6">
            <p className="mb-2 font-semibold">Rate?</p>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={(hover || rating) >= star ? "#FFB703" : "#444"}
                  className="w-6 h-6 cursor-pointer transition-colors"
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setRating(star)}
                >
                  <path d="M12 2l2.9 6.9 7.6.6-5.7 4.8 1.7 7.5L12 17.8 5.5 21.8l1.7-7.5L1.5 9.5l7.6-.6L12 2z" />
                </svg>
              ))}
            </div>
          </div>

          {/* Watched & Listed Toggles */}
          <div className="mt-6 flex space-x-6">
            {/* Watched */}
            <div className="flex items-center gap-1">
              <span
                onClick={() => setWatched(!watched)}
                className={`p-2 rounded-full cursor-pointer transition-colors duration-200 ${
                  !watched ? "hover:bg-secondary" : "bg-highlight text-white"
                }`}
              >
                {watched ? "✔️" : "📺"}
              </span>
              <span className="text-accent">
                {details.vote_count
                  ? `${details.vote_count.toLocaleString()} watched`  // API placeholder (replace Eventually)
                  : "No data"}
              </span>
            </div>

            {/* Listed */}
            <div className="flex items-center gap-1">
              <span
                onClick={() => setListed(!listed)}
                className={`p-2 rounded-full cursor-pointer transition-colors duration-200 ${
                  !listed ? "hover:bg-secondary" : "bg-highlight text-white"
                }`}
              >
                {listed ? "✔️" : "📃"}
              </span>
              <span className="text-accent">
                {details.popularity
                  ? `${Math.round(details.popularity * 1000).toLocaleString()} listed` // API placeholder (replace Eventually)
                  : "No data"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Shows Section */}
      <div className="max-w-6xl mx-auto mt-10">
        <h2 className="text-2xl font-bold mb-4">More Shows Like {details.name} </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {similar.slice(0, 10).map((show) => (
            <ShowCard key={show.id} show={show} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShowPage;