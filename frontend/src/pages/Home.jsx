import Hero from "../components/Hero";
import TrendingPlaylists from "../components/TrendingPlaylists.jsx";
import TrendingShows from "../components/TrendingShows.jsx";

export default function Home() {
    return (
      <div>
        <Hero />
        <TrendingShows/>
        <TrendingPlaylists/>
      </div>
    );
  }
  