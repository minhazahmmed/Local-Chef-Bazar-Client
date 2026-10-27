import { Link, useParams } from "react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import useTitle from "../hooks/useTitle";
import useAxiosSecure from "../hooks/useAxiosSecure";
import Stars from "../components/shared/Stars";
import Spinner from "../components/shared/Spinner";
import ReviewSection from "../components/MealDetails/ReviewSection";

const MealDetails = () => {
  useTitle("Meal Details");
  const { id } = useParams();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: meal,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["meal", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/meals/${id}`);
      return res.data;
    },
  });

  const favoriteMutation = useMutation({
    mutationFn: (favorite) => axiosSecure.post("/favorites", favorite),
    onSuccess: (res) => {
      if (res.data.exists) {
        toast.error("This meal is already in your favorites");
      } else {
        toast.success("Added to favorites");
      }
    },
        onError: (error) =>
      toast.error(error.response?.data?.message || "Could not add to favorites"),
  });

  if (isLoading) return <Spinner />;

  if (isError || !meal) {
    return (
      <div className="px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Meal not found</h1>
        <p className="mt-2 text-base-content/70">
          This meal may have been removed by the chef.
        </p>
        <Link to="/meals" className="btn btn-primary mt-6">
          Back to Meals
        </Link>
      </div>
    );
  }

  const isOwnMeal = meal.userEmail === user.email;

  const handleFavorite = () => {
    favoriteMutation.mutate({ mealId: meal._id });
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <img
          src={meal.foodImage}
          alt={meal.foodName}
          className="h-72 w-full rounded-box object-cover sm:h-96"
        />

        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">{meal.foodName}</h1>

          <div className="mt-3 flex items-center gap-3">
            <Stars rating={meal.rating} />
            <span className="text-sm text-base-content/70">
              {Number(meal.rating).toFixed(1)}
            </span>
          </div>

          <p className="mt-4 text-2xl font-bold text-primary">${meal.price}</p>

          <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
            <div>
              <dt className="text-base-content/60">Chef Name</dt>
              <dd className="font-medium">{meal.chefName}</dd>
            </div>
            <div>
              <dt className="text-base-content/60">Chef ID</dt>
              <dd className="font-medium">{meal.chefId}</dd>
            </div>
            <div>
              <dt className="text-base-content/60">Delivery Area</dt>
              <dd className="font-medium">{meal.deliveryArea}</dd>
            </div>
            <div>
              <dt className="text-base-content/60">Estimated Delivery Time</dt>
              <dd className="font-medium">{meal.estimatedDeliveryTime}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-base-content/60">Chef&apos;s Experience</dt>
              <dd className="font-medium">{meal.chefExperience}</dd>
            </div>
          </dl>

          <div className="mt-6">
            <p className="text-sm text-base-content/60">Ingredients</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {meal.ingredients?.map((item) => (
                <span key={item} className="badge badge-outline">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {isOwnMeal ? (
              <p className="rounded-lg bg-base-200 px-4 py-3 text-sm text-base-content/70">
                This is your own meal, so you cannot order it.
              </p>
            ) : (
              <Link to={`/order/${meal._id}`} className="btn btn-primary">
                Order Now
              </Link>
            )}
            {!isOwnMeal && (
              <button
                onClick={handleFavorite}
                disabled={favoriteMutation.isPending}
                className="btn btn-outline btn-primary"
              >
                Add to Favorite
              </button>
            )}
          </div>
        </div>
      </div>

      <ReviewSection mealId={meal._id} isOwnMeal={isOwnMeal} />
    </section>
  );
};

export default MealDetails;