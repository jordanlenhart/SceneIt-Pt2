import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supabase from "../client";

const ProfilePage = () => {
  const { id } = useParams();

  const [userInfo, setUserInfo] = useState({
    username: "newuser",
    about:
      "Serial rewatcher. My friends tell me I have too many opinions and not enough popcorn!",
    watched: 0,
    rated: 0,
    wantToWatch: 0,
    profileImageUrl: null,
  });

  const [playlists, setPlaylists] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [reviews, setReviews] = useState([]);

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);


  // Fetch profile info + sections

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchProfile = async () => {
      setLoading(true);
      setErrorMsg(null);

      try {
        // Fetch playlists, favorites, reviews in parallel
        const [playlistsRes, favoritesRes, reviewsRes] = await Promise.all([
          fetch(`/profile/${id}/playlists`, { signal }),
          fetch(`/profile/${id}/favorites`, { signal }),
          fetch(`/profile/${id}/reviews`, { signal }),
        ]);

        if (!playlistsRes.ok || !favoritesRes.ok || !reviewsRes.ok) {
          throw new Error("Failed fetching profile sections.");
        }

        const [playlistsData, favoritesData, reviewsData] = await Promise.all([
          playlistsRes.json(),
          favoritesRes.json(),
          reviewsRes.json(),
        ]);

        setPlaylists(Array.isArray(playlistsData) ? playlistsData : []);
        setFavorites(Array.isArray(favoritesData) ? favoritesData : []);
        setReviews(Array.isArray(reviewsData) ? reviewsData : []);

        // Fetch profile info from Supabase if exists
        const { data: userProfile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", id)
          .single();

        if (!profileError && userProfile) {
          setUserInfo((prev) => ({
            ...prev,
            username: userProfile.username || prev.username,
            about: userProfile.about || prev.about,
            profileImageUrl: userProfile.profile_image_url || null,
          }));
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
        setErrorMsg("Could not load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();

    return () => controller.abort();
  }, [id]);


  // Upload Profile Picture

  const handleProfileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `avatars/${id}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("profile-pictures")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("profile-pictures")
        .getPublicUrl(filePath);

      const imageUrl = data.publicUrl;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ profile_image_url: imageUrl })
        .eq("id", id);

      if (updateError) throw updateError;

      // Update UI
      setUserInfo((prev) => ({ ...prev, profileImageUrl: imageUrl }));
    } catch (err) {
      console.error("Profile upload error:", err);
      alert("Image upload failed.");
    }
  };

  if (loading) return <p className="text-white p-6">Loading...</p>;

  return (
    <div className="bg-[#0C2D48] min-h-screen text-white px-8 py-10">
      <div className="max-w-7xl mx-auto">
        {errorMsg && (
          <div className="mb-6 p-4 rounded bg-red-800 text-sm text-red-100">
            {errorMsg}
          </div>
        )}

        {/*
            TOP USER SECTION
         */}
        <div className="flex items-start gap-10">
          {/* Profile Picture */}
          <div className="flex flex-col items-center">
            <img
              src={
                userInfo.profileImageUrl || "/Profileplaceholderimage.png"
              }
              className="w-32 h-32 rounded-full border-4 border-white object-cover"
              alt="Profile"
            />

            {/* Upload Button */}
            <label className="mt-4 bg-[#FCA311] px-4 py-2 rounded text-black font-semibold cursor-pointer">
              Upload Image
              <input
                type="file"
                accept="image/*"
                onChange={handleProfileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* About Section */}
          <div className="flex-1">
            <p className="text-lg font-semibold tracking-wide">ABOUT ME:</p>

            <p className="mt-2 max-w-xl leading-relaxed">
              {userInfo.about}
            </p>

            <div className="flex gap-12 mt-6">
              <Stat number={userInfo.watched} label="Watched" />
              <Stat number={userInfo.rated} label="Rated" />
              <Stat number={userInfo.wantToWatch} label="Want to Watch" />
            </div>
          </div>

          {/* Edit Button */}
          <button className="bg-[#FCA311] px-5 py-2 rounded text-black font-semibold">
            Edit Profile
          </button>
        </div>

        {/* 
            PLAYLIST + FAVORITES
        */}
        <Section title="PLAYLISTS" items={playlists} />
        <Section title="FAVORITES" items={favorites} />

        {/* 
            REVIEWS
         */}
        <div className="mt-16">
          <h2 className="text-lg font-semibold border-b border-gray-500 pb-1 tracking-wide">
            SHOWS I RECENTLY RATED
          </h2>

          {reviews.length === 0 ? (
            <p className="mt-4 text-gray-300">
              Reviews feature coming soon…
            </p>
          ) : (
            reviews.map((r) => (
              <p key={r.id} className="mt-2 text-gray-200">{r.title}</p>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

/* 
   STATS COMPONENT
- */
const Stat = ({ number, label }) => (
  <div>
    <p className="text-2xl font-bold">{number}</p>
    <p className="text-sm text-gray-300">{label}</p>
  </div>
);

/* 
   SECTION COMPONENT
 */
const Section = ({ title, items = [] }) => {
  return (
    <div className="mt-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold tracking-wide border-b border-gray-500 pb-1 w-full">
          {title}
        </h2>
        <button className="text-sm text-gray-300 ml-6">More &gt;</button>
      </div>

      {items.length === 0 ? (
        <p className="text-gray-300">No items found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">
          {items.map((item) => (
            <div key={item.id} className="text-center">
              <img
                src={item.imageUrl || "https://placehold.co/200x260"}
                className="w-full h-48 object-cover rounded-lg bg-gray-700"
                alt={item.title}
              />
              <p className="mt-2 text-sm">{item.title}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
