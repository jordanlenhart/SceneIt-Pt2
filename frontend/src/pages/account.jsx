import React from "react";

export default function Account() {
  return (
    <div className="bg-[#023047] min-h-screen text-white p-6">
      {/* Page Container */}
      <div className="max-w-6xl mx-auto">
        {/* Profile Section */}
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 rounded-full bg-gray-600 flex items-center justify-center">
            <span className="text-4xl">👤</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold">jordanlenhart</h1>
            <p className="text-sm text-gray-300">Sitcom Enthusiast</p>
            <div className="flex gap-4 mt-2">
              <p>47 Watched</p>
              <p>8 Want to Watch</p>
              <p>145 Rated</p>
            </div>
            <button className="mt-3 px-4 py-2 bg-orange-500 rounded-lg">
              Edit Profile
            </button>
          </div>
        </div>

        {/* Spotlight Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-2">Spotlight</h2>
          <div className="flex gap-4 overflow-x-auto">
            <img
              src="https://via.placeholder.com/120x180"
              alt="Game of Thrones"
              className="rounded"
            />
            <img
              src="https://via.placeholder.com/120x180"
              alt="SpongeBob"
              className="rounded"
            />
            <img
              src="https://via.placeholder.com/120x180"
              alt="Kpop"
              className="rounded"
            />
          </div>
        </div>

        {/* Playlists Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-2">Playlists</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-700 p-2 rounded">
              <img
                src="https://via.placeholder.com/150x200"
                alt="Playlist"
                className="rounded"
              />
              <p className="mt-2 text-sm">Shows that give me life.</p>
            </div>
            <div className="bg-gray-700 p-2 rounded">
              <img
                src="https://via.placeholder.com/150x200"
                alt="Playlist"
                className="rounded"
              />
              <p className="mt-2 text-sm">Comedy Favorites</p>
            </div>
          </div>
        </div>

        {/* Recently Rated Section */}
        <div>
          <h2 className="text-xl font-bold mb-2">jordanlenhart’s recently rated</h2>
          <div className="flex gap-4 overflow-x-auto">
            <img
              src="https://via.placeholder.com/120x180"
              alt="Game of Thrones"
              className="rounded"
            />
            <img
              src="https://via.placeholder.com/120x180"
              alt="SpongeBob"
              className="rounded"
            />
            <img
              src="https://via.placeholder.com/120x180"
              alt="Anime"
              className="rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
