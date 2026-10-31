import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { MdDeleteOutline, MdFavoriteBorder } from "react-icons/md";
import useAuth from "../../../hooks/useAuth";
import useTitle from "../../../hooks/useTitle";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Spinner from "../../shared/Spinner";
import { formatDate } from "../../../utils/formatDate";
import { formatPrice } from "../../../utils/formatPrice";

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

  const isDeleting = (id) =>
    deleteMutation.isPending && deleteMutation.variables === id;

  return (
    <div>
      <h1 className="text-2xl font-bold text-base-content sm:text-3xl">
        Favorite Meals
      </h1>
      <p className="mt-1 text-base text-base-content/85">
        {favorites.length === 0
          ? "Meals you save will show up here."
          : `You have saved ${favorites.length} ${
              favorites.length === 1 ? "meal" : "meals"
            }.`}
      </p>

      {favorites.length === 0 ? (
        <div className="mt-6 flex flex-col items-center rounded-box border border-base-300 bg-base-100 px-6 py-14 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <MdFavoriteBorder size={30} />
          </span>
          <p className="mt-4 text-lg font-semibold text-base-content">
            No favorite meals yet
          </p>
          <p className="mt-1 text-base text-base-content/85">
            Tap the heart on any meal to save it here.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-6 hidden overflow-x-auto rounded-box border border-base-300 bg-base-100 md:block">
            <table className="table text-base">
              <thead>
                <tr className="text-base text-base-content">
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
                    <td className="font-semibold text-base-content">
                      {item.mealName}
                    </td>
                    <td className="text-base-content/90">{item.chefName}</td>
                    <td className="font-medium text-base-content">
                      {formatPrice(item.price)}
                    </td>
                    <td className="text-base-content/90">
                      {formatDate(item.addedTime)}
                    </td>
                    <td className="text-right">
                      <button
                        onClick={() => deleteMutation.mutate(item._id)}
                        disabled={isDeleting(item._id)}
                        className="btn btn-outline btn-error h-10 min-h-10 gap-1 text-[15px]"
                      >
                        {isDeleting(item._id) ? (
                          <span className="loading loading-spinner loading-sm" />
                        ) : (
                          <MdDeleteOutline size={20} />
                        )}
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 md:hidden">
            {favorites.map((item) => (
              <div
                key={item._id}
                className="flex flex-col rounded-box border border-base-300 bg-base-100 p-4"
              >
                <h3 className="break-words text-lg font-semibold text-base-content">
                  {item.mealName}
                </h3>

                <dl className="mt-3 space-y-2 text-base">
                  <div className="flex justify-between gap-3">
                    <dt className="text-base-content/85">Chef</dt>
                    <dd className="break-words text-right font-medium text-base-content">
                      {item.chefName}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-base-content/85">Price</dt>
                    <dd className="font-semibold text-base-content">
                      {formatPrice(item.price)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-base-content/85">Added</dt>
                    <dd className="text-right font-medium text-base-content">
                      {formatDate(item.addedTime)}
                    </dd>
                  </div>
                </dl>

                <button
                  onClick={() => deleteMutation.mutate(item._id)}
                  disabled={isDeleting(item._id)}
                  className="btn btn-outline btn-error mt-4 h-11 min-h-11 w-full gap-1 text-base"
                >
                  {isDeleting(item._id) ? (
                    <span className="loading loading-spinner loading-sm" />
                  ) : (
                    <MdDeleteOutline size={20} />
                  )}
                  Remove
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default FavoriteMeals;