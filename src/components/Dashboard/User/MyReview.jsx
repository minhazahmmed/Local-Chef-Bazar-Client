import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { MdDeleteOutline, MdEdit, MdOutlineRateReview } from "react-icons/md";
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
      <div className="modal-box w-full max-w-lg p-5 sm:p-6">
        <h3 className="text-xl font-bold text-base-content">Update review</h3>
        <p className="mt-0.5 break-words text-base text-base-content/85">
          {review.mealName}
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
          <div>
            <label
              htmlFor="rating"
              className="mb-1.5 block text-[15px] font-semibold text-base-content"
            >
              Rating
            </label>
            <select
              id="rating"
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
              htmlFor="comment"
              className="mb-1.5 block text-[15px] font-semibold text-base-content"
            >
              Comment
            </label>
            <textarea
              id="comment"
              rows={4}
              className="textarea w-full border-base-content/30 text-base leading-relaxed"
              {...register("comment", { required: "Comment is required" })}
            />
            {errors.comment && (
              <p className="mt-1 text-[15px] text-error">
                {errors.comment.message}
              </p>
            )}
          </div>

          <div className="modal-action mt-6 grid grid-cols-2 gap-3 sm:flex">
            <button
              type="button"
              className="btn h-11 min-h-11 text-base"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="btn btn-primary h-11 min-h-11 text-base"
            >
              {updateMutation.isPending ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                "Save"
              )}
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
      <h1 className="text-2xl font-bold text-base-content sm:text-3xl">
        My Reviews
      </h1>
      <p className="mt-1 text-base text-base-content/85">
        Edit or remove the reviews you have written.
      </p>

      {reviews.length === 0 ? (
        <div className="mt-6 flex flex-col items-center rounded-box border border-base-300 bg-base-100 px-6 py-14 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <MdOutlineRateReview size={30} />
          </span>
          <p className="mt-4 text-lg font-semibold text-base-content">
            No reviews yet
          </p>
          <p className="mt-1 text-base text-base-content/85">
            You have not written any reviews yet.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="flex flex-col rounded-box border border-base-300 bg-base-100 p-4 sm:p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="min-w-0 break-words text-lg font-semibold text-base-content sm:text-xl">
                  {review.mealName}
                </h3>
                <span
                  className={`badge h-7 shrink-0 text-sm font-medium capitalize ${statusBadge[review.status || "approved"]}`}
                >
                  {review.status || "approved"}
                </span>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                <Stars rating={review.rating} />
                <span className="text-[15px] text-base-content/85">
                  {formatDate(review.date)}
                </span>
              </div>

              <p className="mt-3 break-words text-base leading-relaxed text-base-content/90">
                {review.comment}
              </p>

              <div className="mt-auto grid grid-cols-2 gap-3 pt-5 sm:flex">
                <button
                  onClick={() => setSelectedReview(review)}
                  className="btn btn-outline btn-primary h-10 min-h-10 gap-1 text-[15px]"
                >
                  <MdEdit size={18} />
                  Update
                </button>
                <button
                  onClick={() => handleDelete(review._id)}
                  disabled={
                    deleteMutation.isPending &&
                    deleteMutation.variables === review._id
                  }
                  className="btn btn-outline btn-error h-10 min-h-10 gap-1 text-[15px]"
                >
                  <MdDeleteOutline size={20} />
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