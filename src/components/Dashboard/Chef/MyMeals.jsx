import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import useAuth from "../../../hooks/useAuth";
import useTitle from "../../../hooks/useTitle";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Spinner from "../../shared/Spinner";
import Stars from "../../shared/Stars";
import SafeImage from "../../shared/SafeImage";
import { formatPrice } from "../../../utils/formatPrice";
import statusBadge from "../../../utils/statusBadge";
import UpdateMealModal from "./UpdateMealModal";

const statusNote = {
  pending: "Waiting for admin approval. Customers cannot see this meal yet.",
  rejected: "Rejected by admin. Update the meal (name or image) to send it for review again.",
};

const MyMeals = () => {
  useTitle("My Meals");
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [selectedMeal, setSelectedMeal] = useState(null);

  const { data: meals = [], isLoading } = useQuery({
    queryKey: ["myMeals", user.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/meals/chef/${user.email}`);
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => axiosSecure.delete(`/meals/${id}`),
    onSuccess: () => {
      toast.success("Meal deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["myMeals"] });
    },
    onError: () => toast.error("Could not delete the meal"),
  });

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Delete this meal?",
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
      <h1 className="text-2xl font-bold sm:text-3xl">My Meals</h1>

      {meals.length === 0 ? (
        <p className="mt-6 text-base text-base-content/85">
          You have not created any meals yet.
        </p>
      ) : (
        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {meals.map((meal) => {
            const status = meal.status || "approved";

            return (
              <div
                key={meal._id}
                className="flex flex-col overflow-hidden rounded-box border border-base-300 bg-base-100"
              >
                <div className="relative">
                  <SafeImage
                    src={meal.foodImage}
                    alt={meal.foodName}
                    className="h-44 w-full object-cover"
                  />
                  <span
                    className={`badge absolute left-3 top-3 h-7 text-sm capitalize ${statusBadge[status]}`}
                  >
                    {status === "approved" ? "Live" : status}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-4">
                  <h3 className="text-xl font-semibold">{meal.foodName}</h3>

                  {statusNote[status] && (
                    <p className="mt-2 rounded-lg bg-base-200 px-3 py-2 text-sm text-base-content/85">
                      {statusNote[status]}
                    </p>
                  )}

                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-lg font-bold text-primary">
                      {formatPrice(meal.price)}
                    </p>
                    <Stars rating={meal.rating} />
                  </div>

                  <dl className="mt-3 space-y-1 text-base">
                    <div className="flex justify-between gap-3">
                      <dt className="text-base-content/80">Ingredients</dt>
                      <dd className="text-right font-medium">
                        {meal.ingredients.join(", ")}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-base-content/80">Delivery Time</dt>
                      <dd className="font-medium">{meal.estimatedDeliveryTime}</dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-base-content/80">Chef Name</dt>
                      <dd className="font-medium">{meal.chefName}</dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-base-content/80">Chef ID</dt>
                      <dd className="font-medium">{meal.chefId}</dd>
                    </div>
                  </dl>

                  <div className="mt-auto flex gap-2 pt-4">
                    <button
                      onClick={() => setSelectedMeal(meal)}
                      className="btn btn-outline btn-primary flex-1 text-base"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(meal._id)}
                      className="btn btn-outline btn-error flex-1 text-base"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedMeal && (
        <UpdateMealModal
          meal={selectedMeal}
          onClose={() => setSelectedMeal(null)}
        />
      )}
    </div>
  );
};

export default MyMeals;