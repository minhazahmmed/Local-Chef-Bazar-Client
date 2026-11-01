import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import axiosPublic from "../../api/axiosPublic";
import ReviewCard from "../shared/ReviewCard";
import Spinner from "../shared/Spinner";

const ReviewSection = ({ mealId }) => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: { rating: 5 } });

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["reviews", mealId],
    queryFn: async () => {
      const res = await axiosPublic.get(`/reviews/meal/${mealId}`);
      return res.data;
    },
  });

  const { data: canReview = false } = useQuery({
    queryKey: ["canReview", mealId, user?.email],
    enabled: !!user,
    queryFn: async () => {
      const res = await axiosSecure.get(`/reviews/can-review/${mealId}`);
      return res.data.canReview;
    },
  });

  const reviewMutation = useMutation({
    mutationFn: (review) => axiosSecure.post("/reviews", review),
    onSuccess: () => {
      toast.success(
        "Review submitted successfully! It will be public after admin approval."
      );
      queryClient.invalidateQueries({ queryKey: ["reviews", mealId] });
      queryClient.invalidateQueries({ queryKey: ["myReviews"] });
      reset();
      setOpen(false);
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || "Could not submit your review"),
  });

  const onSubmit = (data) => {
    reviewMutation.mutate({
      foodId: mealId,
      rating: Number(data.rating),
      comment: data.comment,
    });
  };

  return (
    <div className="mt-14">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-base-content sm:text-3xl">
          Reviews ({reviews.length})
        </h2>
        {canReview && (
          <button
            onClick={() => setOpen(true)}
            className="btn btn-primary btn-sm text-[15px] lg:btn-md lg:text-base"
          >
            Give Review
          </button>
        )}
      </div>

      {!canReview && (
        <p className="mt-2 text-base text-base-content/90 sm:text-lg">
          Only customers who have ordered this meal can write a review.
        </p>
      )}

      {isLoading ? (
        <Spinner />
      ) : reviews.length === 0 ? (
        <p className="mt-6 text-base text-base-content/85 sm:text-lg">
          No reviews yet.
        </p>
      ) : (
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {reviews.map((review) => (
            <ReviewCard key={review._id} review={review} />
          ))}
        </div>
      )}

      {open && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="text-xl font-bold text-base-content">
              Write your review
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
              <div>
                <label
                  htmlFor="review-rating"
                  className="mb-1.5 block text-[15px] font-semibold text-base-content"
                >
                  Rating
                </label>
                <select
                  id="review-rating"
                  className="select h-12 w-full border-base-content/30 text-base"
                  {...register("rating")}
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? "Star" : "Stars"}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="review-comment"
                  className="mb-1.5 block text-[15px] font-semibold text-base-content"
                >
                  Comment
                </label>
                <textarea
                  id="review-comment"
                  rows={4}
                  placeholder="How was the food?"
                  className="textarea w-full border-base-content/30 text-base leading-relaxed placeholder:text-base-content/60"
                  {...register("comment", { required: "Please write a comment" })}
                />
                {errors.comment && (
                  <p className="mt-1 text-[15px] text-error">
                    {errors.comment.message}
                  </p>
                )}
              </div>

              <div className="modal-action">
                <button
                  type="button"
                  className="btn text-base"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reviewMutation.isPending}
                  className="btn btn-primary text-base"
                >
                  {reviewMutation.isPending ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewSection;