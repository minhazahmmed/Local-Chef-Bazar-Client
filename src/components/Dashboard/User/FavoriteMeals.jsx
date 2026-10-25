import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useAuth from "../../../hooks/useAuth";
import useTitle from "../../../hooks/useTitle";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Spinner from "../../shared/Spinner";
import { formatDate } from "../../../utils/formatDate";

const FavoriteMeals = () => {
  useTitle("Favorite Meals");
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ["favorites", user.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/favorites/user/${user.email}`);
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => axiosSecure.delete(`/favorites/${id}`),
    onSuccess: () => {
      toast.success("Meal removed from favorites successfully.");
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
    onError: () => toast.error("Could not remove the meal"),
  });

  if (isLoading) return <Spinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold">Favorite Meals</h1>

      {favorites.length === 0 ? (
        <p className="mt-6 text-base-content/70">You have no favorite meals yet.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-box border border-base-300 bg-base-100">
          <table className="table">
            <thead>
              <tr>
                <th>Meal Name</th>
                <th>Chef Name</th>
                <th>Price</th>
                <th>Date Added</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {favorites.map((item) => (
                <tr key={item._id}>
                  <td className="font-medium">{item.mealName}</td>
                  <td>{item.chefName}</td>
                  <td>${item.price}</td>
                  <td>{formatDate(item.addedTime)}</td>
                  <td>
                    <button
                      onClick={() => deleteMutation.mutate(item._id)}
                      className="btn btn-outline btn-error btn-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FavoriteMeals;