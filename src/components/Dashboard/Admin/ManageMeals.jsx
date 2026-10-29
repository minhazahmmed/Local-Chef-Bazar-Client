import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { MdSearch } from "react-icons/md";
import useTitle from "../../../hooks/useTitle";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Spinner from "../../shared/Spinner";
import SafeImage from "../../shared/SafeImage";
import { formatPrice } from "../../../utils/formatPrice";
import statusBadge from "../../../utils/statusBadge";
import { formatDate } from "../../../utils/formatDate";

const tabs = [
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
  { key: "all", label: "All" },
];

const getStatus = (meal) => meal.status || "approved";

const ManageMeals = () => {
  useTitle("Manage Meals");
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState("pending");
  const [search, setSearch] = useState("");
  const [preview, setPreview] = useState(null);

  const { data: meals = [], isLoading } = useQuery({
    queryKey: ["adminMeals"],
    queryFn: async () => {
      const res = await axiosSecure.get("/meals/admin");
      return res.data;
    },
  });

  const refreshMeals = () => {
    queryClient.invalidateQueries({ queryKey: ["adminMeals"] });
    queryClient.invalidateQueries({ queryKey: ["meals"] });
    queryClient.invalidateQueries({ queryKey: ["dailyMeals"] });
  };

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) =>
      axiosSecure.patch(`/meals/${id}/status`, { status }),
    onSuccess: (res, variables) => {
      toast.success(
        variables.status === "approved"
          ? "Meal approved and now public"
          : "Meal rejected and hidden"
      );
      refreshMeals();
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || "Could not update the meal"),
  });

  const handleReject = async (meal) => {
    const result = await Swal.fire({
      icon: "warning",
      title: `Reject "${meal.foodName}"?`,
      text: "It will be hidden from the website. The chef can edit it and send it again.",
      showCancelButton: true,
      confirmButtonText: "Yes, reject",
      confirmButtonColor: "#c4372c",
    });

    if (result.isConfirmed) {
      statusMutation.mutate({ id: meal._id, status: "rejected" });
    }
  };

  const keyword = search.trim().toLowerCase();

  const filteredMeals = meals.filter((meal) => {
    const matchesTab = tab === "all" || getStatus(meal) === tab;
    const text = [meal.foodName, meal.chefName, meal.chefId, meal.userEmail]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return matchesTab && text.includes(keyword);
  });

  if (isLoading) return <Spinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold">Manage Meals</h1>
      <p className="mt-1 text-sm text-base-content/70">
        New meals stay hidden until you approve them. Check the photo carefully.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {tabs.map((item) => {
          const count =
            item.key === "all"
              ? meals.length
              : meals.filter((meal) => getStatus(meal) === item.key).length;

          return (
            <button
              key={item.key}
              onClick={() => setTab(item.key)}
              className={`btn btn-sm ${tab === item.key ? "btn-primary" : "btn-outline"}`}
            >
              {item.label} ({count})
            </button>
          );
        })}
      </div>

      <label className="input mt-4 w-full sm:max-w-sm">
        <MdSearch size={20} className="text-base-content/50" />
        <input
          type="search"
          className="grow"
          placeholder="Search by meal, chef name, chef ID or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </label>

      {filteredMeals.length === 0 ? (
        <p className="mt-8 text-base-content/70">No meals found.</p>
      ) : (
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredMeals.map((meal) => {
            const status = getStatus(meal);

            return (
              <div
                key={meal._id}
                className="flex flex-col overflow-hidden rounded-box border border-base-300 bg-base-100"
              >
                <button
                  type="button"
                  onClick={() => setPreview(meal)}
                  className="relative block"
                >
                  <SafeImage
                    src={meal.foodImage}
                    alt={meal.foodName}
                    className="h-48 w-full object-cover"
                  />
                  <span
                    className={`badge absolute left-3 top-3 capitalize ${statusBadge[status]}`}
                  >
                    {status}
                  </span>
                  <span className="absolute bottom-3 right-3 rounded bg-base-100/90 px-2 py-1 text-xs">
                    Click to enlarge
                  </span>
                </button>

                <div className="flex flex-1 flex-col p-4">
                  <h3 className="text-lg font-semibold">{meal.foodName}</h3>
                  <p className="mt-1 text-sm text-base-content/60">
                    {meal.chefName} · {meal.chefId}
                  </p>
                  <p className="truncate text-xs text-base-content/60">{meal.userEmail}</p>

                  <p className="mt-3 font-bold text-primary">{formatPrice(meal.price)}</p>
                  <p className="mt-1 text-sm text-base-content/70">
                    {meal.ingredients?.join(", ")}
                  </p>
                  <p className="mt-2 text-xs text-base-content/50">
                    {meal.createdAt ? formatDate(meal.createdAt) : "Older meal"}
                  </p>

                  <div className="mt-auto flex flex-wrap gap-2 pt-4">
                    {status !== "approved" && (
                      <button
                        onClick={() =>
                          statusMutation.mutate({ id: meal._id, status: "approved" })
                        }
                        disabled={statusMutation.isPending}
                        className="btn btn-outline btn-success btn-sm"
                      >
                        Approve
                      </button>
                    )}
                    {status !== "rejected" && (
                      <button
                        onClick={() => handleReject(meal)}
                        disabled={statusMutation.isPending}
                        className="btn btn-outline btn-warning btn-sm"
                      >
                        {status === "approved" ? "Take down" : "Reject"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {preview && (
        <div className="modal modal-open" onClick={() => setPreview(null)}>
          <div
            className="modal-box max-w-3xl p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={preview.foodImage}
              alt={preview.foodName}
              className="max-h-[75vh] w-full rounded-lg object-contain"
            />
            <div className="modal-action px-2 pb-2">
              <button className="btn" onClick={() => setPreview(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageMeals;