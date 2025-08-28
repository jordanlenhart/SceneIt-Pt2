import { useState, useEffect } from "react";
import RegisterModal from "./Register";
import ShowCard from "./ShowCard"; // ✅ import your ShowCard


// ⚡️ Replace with your TMDB API key
const API_KEY = "77a22f18008a567c7820ad861f4a5dc7"

export default function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGetStarted = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  useEffect(() => {
    const fetchFeatured = async () => {
      setLoading(true);
      try {
        // Example: Fetch "popular" TV shows
        const res = await fetch(
          `https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&language=en-US&page=1`
        );
        const data = await res.json();
        setFeatured(data.results.slice(0, 6)); // grab just a few for hero
      } catch (err) {
        console.error("Error fetching featured shows:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <section className="relative w-full bg-[#023047] flex flex-col items-center py-20 gap-12">
      {/* Tagline */}
      <h2 className="text-center text-lg md:text-4xl text-gray-300 max-w-lg leading-relaxed">
        <p>
          <span className="text-center text-secondary font-bold">Watch</span> your
          favorite shows.
        </p>
        <p>
          <span className="text-center text-secondary font-bold">Share</span> your
          ratings.
        </p>
        <p>
          <span className="text-center text-secondary font-bold">Connect</span> with fans
          just like you.
        </p>
      </h2>

      {/* Get Started Button */}
      <button
        className="scale-125 mt-4 px-6 py-2 bg-secondary text-white rounded-lg hover:bg-orange-500 hover:scale-150 transition"
        onClick={handleGetStarted}
      >
        Get started
      </button>

      {/* Featured Shows */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {loading && <p className="text-gray-400">Loading featured shows...</p>}

        {!loading && featured.length > 0 ? (
          featured.slice(0, 3).map((show) => (
            <div key={show.id} className="w-72 h-[28rem] mx-auto">
              <ShowCard show={show} />
            </div>
          ))
        ) : (
          !loading && <p className="text-gray-500">No featured shows found.</p>
        )}
      </div>



      {/* Register Modal */}
      <RegisterModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </section>
  );
}
