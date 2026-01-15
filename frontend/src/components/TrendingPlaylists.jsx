import React, { useState } from "react";

// Updated data with TMDb poster URLs
const placeholderPlaylists = [
    {
        id: 1,
        title: "Shows that give me life.",
        author: "user23546",
        shows: [
            "https://www.themoviedb.org/t/p/w200/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg", // Avengers Assemble
            "https://www.themoviedb.org/t/p/w200/qJxzjUjCpTPvDHldNnlbRC4OqEh.jpg", // Breaking Bad
            "https://www.themoviedb.org/t/p/w200/6UH52Fmau8RPsMAbQbjwN3wJSCj.jpg", // The Witcher
            "https://www.themoviedb.org/t/p/w200/uGy4DCmM33I7l86W7iCskNkvmLD.jpg", // Rick & Morty
        ],
    },
    {
        id: 2,
        title: "Binge Worthy Weekends",
        author: "user83920",
        shows: [
            "https://www.themoviedb.org/t/p/w200/qJxzjUjCpTPvDHldNnlbRC4OqEh.jpg", // Breaking Bad
            "https://www.themoviedb.org/t/p/w200/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg", // Avengers Assemble
            "https://www.themoviedb.org/t/p/w200/6UH52Fmau8RPsMAbQbjwN3wJSCj.jpg", // The Witcher
            "https://www.themoviedb.org/t/p/w200/uGy4DCmM33I7l86W7iCskNkvmLD.jpg", // Rick & Morty
        ],
    },
    {
        id: 3,
        title: "Comedy Favorites",
        author: "user49210",
        shows: [
            "https://www.themoviedb.org/t/p/w200/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg", // Avengers Assemble
            "https://www.themoviedb.org/t/p/w200/qJxzjUjCpTPvDHldNnlbRC4OqEh.jpg", // Breaking Bad
            "https://www.themoviedb.org/t/p/w200/6UH52Fmau8RPsMAbQbjwN3wJSCj.jpg", // The Witcher
            "https://www.themoviedb.org/t/p/w200/uGy4DCmM33I7l86W7iCskNkvmLD.jpg", // Rick & Morty
        ],
    },
    {
        id: 4,
        title: "Classic Must Watch",
        author: "user12839",
        shows: [
            "https://www.themoviedb.org/t/p/w200/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg", // Avengers Assemble
            "https://www.themoviedb.org/t/p/w200/qJxzjUjCpTPvDHldNnlbRC4OqEh.jpg", // Breaking Bad
            "https://www.themoviedb.org/t/p/w200/6UH52Fmau8RPsMAbQbjwN3wJSCj.jpg", // The Witcher
            "https://www.themoviedb.org/t/p/w200/uGy4DCmM33I7l86W7iCskNkvmLD.jpg", // Rick & Morty
        ],
    },
    {
        id: 5,
        title: "Sci-Fi Collection",
        author: "user57382",
        shows: [
            "https://www.themoviedb.org/t/p/w200/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg", // Avengers Assemble
            "https://www.themoviedb.org/t/p/w200/qJxzjUjCpTPvDHldNnlbRC4OqEh.jpg", // Breaking Bad
            "https://www.themoviedb.org/t/p/w200/6UH52Fmau8RPsMAbQbjwN3wJSCj.jpg", // The Witcher
            "https://www.themoviedb.org/t/p/w200/uGy4DCmM33I7l86W7iCskNkvmLD.jpg", // Rick & Morty
        ],
    },
];

export default function TrendingPlaylists() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const ITEMS_PER_PAGE = 3;

    const handlePrev = () => {
        setCurrentIndex((prev) => Math.max(prev - ITEMS_PER_PAGE, 0));
    };

    const handleNext = () => {
        setCurrentIndex((prev) =>
            Math.min(prev + ITEMS_PER_PAGE, placeholderPlaylists.length - ITEMS_PER_PAGE)
        );
    };

    return (
        <div className="py-12 h-screen">
            {/* Title */}
            <div className="w-full max-w-6xl mx-auto text-center">
                <h2 className="text-2xl md:text-3xl mb-4 font-semibold text-gray-200">
                    Trending Playlists
                </h2>
                <div className="h-[2px] bg-white/30 w-3/4 mx-auto mt-2 mb-10"></div>
            </div>

            {/* Carousel */}
            <div className=" text-white w-full max-w-6xl mx-auto flex items-center justify-center gap-x-14">
                COMING SOON!
            </div>
        </div>
    );
}