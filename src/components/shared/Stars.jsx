import { FaStar, FaRegStar } from "react-icons/fa";

const Stars = ({ rating = 0 }) => {
  return (
    <div className="flex items-center gap-0.5 text-accent">
      {[1, 2, 3, 4, 5].map((n) =>
        n <= Math.round(rating) ? (
          <FaStar key={n} size={14} />
        ) : (
          <FaRegStar key={n} size={14} />
        )
      )}
    </div>
  );
};

export default Stars;