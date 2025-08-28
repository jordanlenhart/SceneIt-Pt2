import React, { useEffect, useState } from "react";
import ShowCard from "./ShowCard";

const API_KEY = "77a22f18008a567c7820ad861f4a5dc7"; 
const TRENDING_URL = `https://api.themoviedb.org/3/trending/tv/week?api_key=${API_KEY}`;

export default function TrendingShows() {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const ITEMS_PER_PAGE = 5; // ✅ show 5 at a time

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await fetch(TRENDING_URL);
        if (!res.ok) throw new Error("Failed to fetch trending shows");
        const data = await res.json();
        setShows(data.results || []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - ITEMS_PER_PAGE, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      Math.min(prev + ITEMS_PER_PAGE, shows.length - ITEMS_PER_PAGE)
    );
  };

  if (loading) {
    return <div className="text-white text-center mt-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  }

  return (
    <div className="bg-primary pb-10">
      {/* Title */}
      <div className="w-full max-w-6xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-200">
          Trending Shows
        </h2>
        <div className="h-[2px] bg-white w-3/4 mx-auto mt-2 mb-6"></div>
      </div>

      {/* Carousel */}
      <div className="w-full max-w-6xl mx-auto flex items-center justify-center gap-6">
        {/* Left Arrow */}
        <button
          className="transform rotate-180 p-3 rounded-full text-white hover:text-secondary"
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          ➤
        </button>

        {/* Show Grid (5 at a time) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {shows
            .slice(currentIndex, currentIndex + ITEMS_PER_PAGE)
            .map((show) => (
              <div
                key={show.id}
                className="flex-shrink-0 w-40 sm:w-44 h-[20rem] mx-auto"
              >
                <ShowCard show={show} />
              </div>
            ))}
        </div>

        {/* Right Arrow */}
        <button
          className="p-3 rounded-full text-white hover:text-secondary disabled:opacity-40"
          onClick={handleNext}
          disabled={currentIndex >= shows.length - ITEMS_PER_PAGE}
        >
          ➤
        </button>
      </div>
    </div>
  );
}
