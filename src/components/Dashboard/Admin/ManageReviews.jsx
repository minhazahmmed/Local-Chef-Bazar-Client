import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { MdSearch } from "react-icons/md";
import useTitle from "../../../hooks/useTitle";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Spinner from "../../shared/Spinner";
import Stars from "../../shared/Stars";
import statusBadge from "../../../utils/statusBadge";
import { formatDate } from "../../../utils/formatDate";

const tabs = [
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
  { key: "all", label: "All" },
];

const getStatus = (review) => review.status || "approved";

const ManageReviews = () => {
  useTitle("Manage Reviews");
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState("pending");
  const [search, setSearch] = useState("");

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["adminReviews"],
    queryFn: async () => {
      const res = await axiosSecure.get("/reviews/admin");
      return res.data;
    },
  });

  const refreshReviews = () => {
    queryClient.invalidateQueries({ queryKey: ["adminReviews"] });
    queryClient.invalidateQueries({ queryKey: ["homeReviews"] });
    queryClient.invalidateQueries({ queryKey: ["reviews"] });
    queryClient.invalidateQueries({ queryKey: ["meal"] });
  };

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) =>
      axiosSecure.patch(`/reviews/${id}/status`, { status }),
    onSuccess: (res, variables) => {
      toast.success(
        variables.status === "approved"
          ? "Review approved and now public"
          : "Review rejected and hidden"
      );
      refreshReviews();
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || "Could not update the review"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => axiosSecure.delete(`/reviews/${id}`),
    onSuccess: () => {
      toast.success("Review deleted");
      refreshReviews();
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

  const keyword = search.trim().toLowerCase();

  const filteredReviews = reviews.filter((review) => {
    const matchesTab = tab === "all" || getStatus(review) === tab;
    const text = [
      review.reviewerName,
      review.reviewerEmail,
      review.mealName,
      review.comment,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return matchesTab && text.includes(keyword);
  });

  if (isLoading) return <Spinner />;

  return (
    <div>
      <h1 className="text-3xl font-bold">Manage Reviews</h1>
      <p className="mt-1 text-base text-base-content/85">
        New reviews stay hidden until you approve them.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {tabs.map((item) => {
          const count =
            item.key === "all"
              ? reviews.length
              : reviews.filter((review) => getStatus(review) === item.key).length;

          return (
            <button
              key={item.key}
              onClick={() => setTab(item.key)}
              className={`btn text-[15px] ${tab === item.key ? "btn-primary" : "btn-outline"}`}
            >
              {item.label} ({count})
            </button>
          );
        })}
      </div>

      <label className="input mt-4 w-full text-base sm:max-w-md">
        <MdSearch size={22} className="text-base-content/70" />
        <input
          type="search"
          className="grow text-base placeholder:text-base-content/70"
          placeholder="Search by name, email, meal or comment"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </label>

      {filteredReviews.length === 0 ? (
        <p className="mt-8 text-base text-base-content/85">No reviews found.</p>
      ) : (
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredReviews.map((review) => {
            const status = getStatus(review);

            return (
              <div
                key={review._id}
                className="flex flex-col rounded-box border border-base-300 bg-base-100 p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="w-10 rounded-full">
                        <img src={review.reviewerImage} alt={review.reviewerName} />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-base font-semibold">{review.reviewerName}</p>
                      <p className="truncate text-sm text-base-content/80">
                        {review.reviewerEmail}
                      </p>
                    </div>
                  </div>
                  <span className={`badge badge-lg capitalize ${statusBadge[status]}`}>
                    {status}
                  </span>
                </div>

                <p className="mt-3 text-base text-base-content/80">
                  {review.mealName} · {formatDate(review.date)}
                </p>

                <div className="mt-2">
                  <Stars rating={review.rating} />
                </div>

                <p className="mt-3 flex-1 text-base leading-relaxed text-base-content/90">
                  {review.comment}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {status !== "approved" && (
                    <button
                      onClick={() =>
                        statusMutation.mutate({ id: review._id, status: "approved" })
                      }
                      disabled={statusMutation.isPending}
                      className="btn btn-outline btn-success text-[15px]"
                    >
                      Approve
                    </button>
                  )}
                  {status !== "rejected" && (
                    <button
                      onClick={() =>
                        statusMutation.mutate({ id: review._id, status: "rejected" })
                      }
                      disabled={statusMutation.isPending}
                      className="btn btn-outline btn-warning text-[15px]"
                    >
                      {status === "approved" ? "Hide" : "Reject"}
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(review._id)}
                    disabled={deleteMutation.isPending}
                    className="btn btn-outline btn-error text-[15px]"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ManageReviews;