import Stars from "./Stars";
import { formatDate } from "../../utils/formatDate";

const ReviewCard = ({ review }) => {
  return (
    <div className="h-full rounded-box border border-base-content/15 bg-base-100 p-6 shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="w-12 rounded-full ring-2 ring-primary/30">
              <img src={review.reviewerImage} alt={review.reviewerName} />
            </div>
          </div>
          <div>
            <p className="text-base font-bold text-base-content">{review.reviewerName}</p>
            <p className="text-sm text-base-content/70">{formatDate(review.date)}</p>
          </div>
        </div>

        {review.status === "pending" && (
          <span className="badge badge-warning shrink-0">Pending approval</span>
        )}
      </div>

      <div className="mt-4">
        <Stars rating={review.rating} />
      </div>

      {review.mealName && (
        <p className="mt-2 text-sm font-medium text-primary">on {review.mealName}</p>
      )}

      <p className="mt-3 text-base leading-relaxed text-base-content/85">
        {review.comment}
      </p>
    </div>
  );
};

export default ReviewCard;