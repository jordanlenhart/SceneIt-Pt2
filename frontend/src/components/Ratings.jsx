import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Ratings({ showId }) {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);

    const handleRating = (value) => {
        /// visitor is sent to AuthPage to sign up
        if (!user) {  
            navigate('/auth?mode=signup');
            return;
        }

        setRating(value);
    }

    return (
        <div className="flex space-x-2 mt-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={(hover || rating) >= star ? "#FFB703" : "#444"}
              className="w-6 h-6 cursor-pointer transition-colors"
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              onClick={() => handleRating(star)}
            >
              <path d="M12 2l2.9 6.9 7.6.6-5.7 4.8 1.7 7.5L12 17.8 5.5 21.8l1.7-7.5L1.5 9.5l7.6-.6L12 2z" />
            </svg>
          ))}
        </div>
    );
}