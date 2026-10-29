import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import useAuth from "../../../hooks/useAuth";
import useTitle from "../../../hooks/useTitle";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Spinner from "../../shared/Spinner";
import Stars from "../../shared/Stars";
import { formatDate } from "../../../utils/formatDate";
import statusBadge from "../../../utils/statusBadge";

const UpdateReviewModal = ({ review, onClose }) => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { rating: review.rating, comment: review.comment },
  });

  const updateMutation = useMutation({
    mutationFn: (data) =>
      axiosSecure.patch(`/reviews/${review._id}`, {
        rating: Number(data.rating),
        comment: data.comment,
      }),
    onSuccess: () => {
      toast.success("Review updated successfully");
      queryClient.invalidateQueries({ queryKey: ["myReviews"] });
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["meal"] });
      queryClient.invalidateQueries({ queryKey: ["homeReviews"] });
      onClose();
    },
    onError: () => toast.error("Could not update the review"),
  });

  const onSubmit = (data) => updateMutation.mutate(data);

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="text-lg font-semibold">Update review</h3>
        <p className="text-sm text-base-content/70">{review.mealName}</p>

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
              className="textarea w-full"
              {...register("comment", { required: "Comment is required" })}
            />
            {errors.comment && (
              <p className="mt-1 text-sm text-error">
                {errors.comment.message}
              </p>
            )}
          </div>

          <div className="modal-action">
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="btn btn-primary"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const MyReview = () => {
  useTitle("My Reviews");
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [selectedReview, setSelectedReview] = useState(null);

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["myReviews", user.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/reviews/user/${user.email}`);
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => axiosSecure.delete(`/reviews/${id}`),
    onSuccess: () => {
      toast.success("Review deleted");
      queryClient.invalidateQueries({ queryKey: ["myReviews"] });
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["meal"] });
      queryClient.invalidateQueries({ queryKey: ["homeReviews"] });
    },
    onError: () => toast.error("Could not delete the review"),
  });

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Delete this review?",
      text: "This cannot be undone.",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      confirmButtonColor: "#c4372c",
    });

    if (result.isConfirmed) deleteMutation.mutate(id);
  };

  if (isLoading) return <Spinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold">My Reviews</h1>

      {reviews.length === 0 ? (
        <p className="mt-6 text-base-content/70">
          You have not written any reviews yet.
        </p>
      ) : (
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="rounded-box border border-base-300 bg-base-100 p-5 relative"
            >
              <div className="absolute top-5 right-5">
                <span
                  className={`badge capitalize ${statusBadge[review.status || "approved"]}`}
                >
                  {review.status || "approved"}
                </span>
              </div>

              <h3 className="text-lg font-semibold pr-16">{review.mealName}</h3>
              <div className="mt-2 flex items-center gap-3">
                <Stars rating={review.rating} />
                <span className="text-sm text-base-content/60">
                  {formatDate(review.date)}
                </span>
              </div>
              <p className="mt-3 text-[15px] leading-relaxed text-base-content/80">
                {review.comment}
              </p>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setSelectedReview(review)}
                  className="btn btn-outline btn-primary btn-sm"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(review._id)}
                  className="btn btn-outline btn-error btn-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedReview && (
        <UpdateReviewModal
          review={selectedReview}
          onClose={() => setSelectedReview(null)}
        />
      )}
    </div>
  );
};

export default MyReview;