import Stars from "./Stars";
import { formatDate } from "../../utils/formatDate";

const ReviewCard = ({ review }) => {
  return (
    <div className="rounded-box border border-base-300 bg-base-100 p-5">
      <div className="flex items-center gap-3">
        <div className="avatar">
          <div className="w-11 rounded-full">
            <img src={review.reviewerImage} alt={review.reviewerName} />
          </div>
        </div>
        <div>
          <p className="font-semibold">{review.reviewerName}</p>
          <p className="text-xs text-base-content/60">{formatDate(review.date)}</p>
        </div>
      </div>
      <div className="mt-3">
        <Stars rating={review.rating} />
      </div>
      <p className="mt-3 text-[15px] leading-relaxed text-base-content/80">
        {review.comment}
      </p>
    </div>
  );
};

export default ReviewCard;