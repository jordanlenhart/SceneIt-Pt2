import React from "react";

export default function Hero() {
  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        src="/hero-video.mp4"
        type="video/mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Dark Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/40"></div>

      {/* Hero Content */}
      <div className="relative z-10 text-center text-white/70">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Welcome to SceneIt
        </h1>
        <p className="text-lg md:text-2xl mb-6">
          Browse, rate, and share your favorite TV shows and movies
        </p>
        <button className="px-6 py-3 mt-10 border-2 border-gray-300/50 hover:border-gray-300 rounded-lg hover:scale-[.97] hover:text-gray-100 hover:font-medium hover:bg-green-600 transition-all duration-400 ease-in-out">
          Get Started
        </button>
      </div>
    </section>
  );
}
