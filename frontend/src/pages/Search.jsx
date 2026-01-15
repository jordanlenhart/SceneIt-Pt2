import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ShowCard from "../components/ShowCard";

const API_KEY = "77a22f18008a567c7820ad861f4a5dc7"; // need to move later

const Search = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query") || "";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(
            query
          )}&api_key=${API_KEY}&language=en-US&page=1`
        );
        const data = await res.json();
        console.log("TMDB response:", data); // 👀 check this in devtools
        setResults(data.results || []);
      } catch (err) {
        console.error("Error fetching search results:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
  <div className="bg-primary min-h-screen text-white"> 
    <div className="max-w-7xl px-6 py-8">
      <h1 className="text-2xl font-bold mb-4">
        Showing results for "{query}"
      </h1>

      {loading && <p>Loading...</p>}

      {!loading && results.length === 0 && (
        <p>No results found...</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {results.map((show) => (
          <ShowCard key={show.id} show={show} />
        ))}
      </div>
    </div>
  </div>
  );
};

export default Search;
