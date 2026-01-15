import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeartIcon from "./HeartIcon";

export default function FavoriteHeart({ tmdbId, size = 24, color = "#FF0000", user }) {
    const [isFavorited, setIsFavorited] = useState(false);
    const navigate = useNavigate();

    /// Check if the show is already in user's favorites
    useEffect(() => {
        if (!user) return;

        const checkFavorite = async () => {
            /// retrieve title's favorites status. Has the user already added this show to their favorites?
            try {
                const res = await fetch(`/favorites/check?showId=${tmdbId}`, {
                    credentials: "include",
                });
                const data = await res.json();
                setIsFavorited(data.favorited);
            } catch (err) {
                console.error("Error checking favorite:", err);
            }
        };

        checkFavorite();
    }, [tmdbId, user]);

    const toggleFavorite = async () => {
        if (!user) {
            /// redirects visitor to auth page if no one is logged in
            navigate("/auth");
            return;
        }

        const updated = !isFavorited;
        setIsFavorited(updated);

        try {
            const res = await fetch("/favorites/toggle", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ tmdbId }),
            });
            const data = await res.json();
            if (!data.success) setIsFavorited(!updated); // revert if backend fails
        } catch (err) {
            console.error("Error updating favorite:", err);
            setIsFavorited(!updated); // revert if backend fails
        }
    };

    return (
        <button
            onClick={toggleFavorite}
            className="absolute top-3 right-3 z-20 p-2 
                 rounded-full bg-black/50 backdrop-blur 
                 hover:bg-black/70 transition-colors"
        >
            <HeartIcon filled={isFavorited} size={size} color={color} />
        </button>
    );
}
