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
        <h2 className="text-xl font-bold sm:text-2xl">Reviews ({reviews.length})</h2>
        {canReview && (
          <button onClick={() => setOpen(true)} className="btn btn-primary btn-sm">
            Give Review
          </button>
        )}
      </div>

      {!canReview && (
        <p className="mt-2 text-sm text-base-content/60">
          Only customers who have ordered this meal can write a review.
        </p>
      )}

      {isLoading ? (
        <Spinner />
      ) : reviews.length === 0 ? (
        <p className="mt-6 text-base-content/70">No reviews yet.</p>
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
            <h3 className="text-lg font-semibold">Write your review</h3>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Rating</label>
                <select className="select w-full" {...register("rating")}>
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? "Star" : "Stars"}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Comment</label>
                <textarea
                  rows={4}
                  placeholder="How was the food?"
                  className="textarea w-full"
                  {...register("comment", { required: "Please write a comment" })}
                />
                {errors.comment && (
                  <p className="mt-1 text-sm text-error">{errors.comment.message}</p>
                )}
              </div>

              <div className="modal-action">
                <button type="button" className="btn" onClick={() => setOpen(false)}>
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reviewMutation.isPending}
                  className="btn btn-primary"
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