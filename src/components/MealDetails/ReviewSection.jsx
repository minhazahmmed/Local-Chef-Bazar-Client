import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import axiosPublic from "../../api/axiosPublic";
import ReviewCard from "../shared/ReviewCard";
import Spinner from "../shared/Spinner";

const ReviewSection = ({ mealId, mealName }) => {
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

  const reviewMutation = useMutation({
    mutationFn: (review) => axiosSecure.post("/reviews", review),
    onSuccess: () => {
      toast.success("Review submitted successfully!");
      queryClient.invalidateQueries({ queryKey: ["reviews", mealId] });
      reset();
      setOpen(false);
    },
    onError: () => toast.error("Could not submit your review"),
  });

  const onSubmit = (data) => {
    reviewMutation.mutate({
      foodId: mealId,
      mealName,
      reviewerName: user.displayName,
      reviewerEmail: user.email,
      reviewerImage: user.photoURL,
      rating: Number(data.rating),
      comment: data.comment,
      date: new Date().toISOString(),
    });
  };

  return (
    <div className="mt-14">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold sm:text-2xl">Reviews ({reviews.length})</h2>
        <button onClick={() => setOpen(true)} className="btn btn-primary btn-sm">
          Give Review
        </button>
      </div>

      {isLoading ? (
        <Spinner />
      ) : reviews.length === 0 ? (
        <p className="mt-6 text-base-content/70">
          No reviews yet. Be the first to share your thoughts.
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
                  Submit
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