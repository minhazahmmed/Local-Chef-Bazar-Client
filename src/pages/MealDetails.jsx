import { Link, useParams } from "react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { LuChefHat, LuHash, LuMapPin, LuClock, LuAward, LuHeart, LuShoppingBag } from "react-icons/lu";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import useTitle from "../hooks/useTitle";
import useAxiosSecure from "../hooks/useAxiosSecure";
import Stars from "../components/shared/Stars";
import Spinner from "../components/shared/Spinner";
import ReviewSection from "../components/MealDetails/ReviewSection";
import { formatPrice } from "../utils/formatPrice";

const InfoItem = ({ icon: Icon, label, value, wide }) => (
  <div className={`flex items-start gap-3 ${wide ? "sm:col-span-2" : ""}`}>
    <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
      <Icon size={20} />
    </span>
    <div className="min-w-0">
      <dt className="text-sm font-medium text-base-content/75">{label}</dt>
      <dd className="text-base font-semibold text-base-content">{value}</dd>
    </div>
  </div>
);

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
        <h1 className="text-3xl font-bold text-base-content">Meal not found</h1>
        <p className="mt-2 text-base text-base-content/80">
          This meal may have been removed by the chef.
        </p>
        <Link to="/meals" className="btn btn-primary mt-6 h-12 text-base">
          Back to Meals
        </Link>
      </div>
    );
  }

  const isOwnMeal = meal.userEmail === user?.email;

  const handleFavorite = () => {
    favoriteMutation.mutate({ mealId: meal._id });
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <img
          src={meal.foodImage}
          alt={meal.foodName}
          className="h-72 w-full rounded-box border border-base-content/15 object-cover sm:h-96 lg:h-full lg:max-h-136"
        />

        <div>
          <h1 className="text-3xl font-bold text-base-content sm:text-4xl">
            {meal.foodName}
          </h1>

          <div className="mt-3 flex items-center gap-3">
            <Stars rating={meal.rating} />
            <span className="text-base font-semibold text-base-content/85">
              {Number(meal.rating).toFixed(1)}
            </span>
          </div>

          <p className="mt-4 text-3xl font-bold text-primary sm:text-4xl">
            {formatPrice(meal.price)}
          </p>

          <dl className="mt-6 grid gap-5 rounded-box border border-base-content/20 bg-base-100 p-5 sm:grid-cols-2">
            <InfoItem icon={LuChefHat} label="Chef Name" value={meal.chefName} />
            <InfoItem icon={LuHash} label="Chef ID" value={meal.chefId} />
            <InfoItem icon={LuMapPin} label="Delivery Area" value={meal.deliveryArea} />
            <InfoItem
              icon={LuClock}
              label="Estimated Delivery Time"
              value={meal.estimatedDeliveryTime}
            />
            <InfoItem
              icon={LuAward}
              label="Chef's Experience"
              value={meal.chefExperience}
              wide
            />
          </dl>

          <div className="mt-6">
            <p className="text-base font-semibold text-base-content">Ingredients</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {meal.ingredients?.map((item) => (
                <span
                  key={item}
                  className="badge badge-lg border-base-content/30 bg-base-100 text-[15px] font-medium text-base-content"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:gap-3">
            {isOwnMeal ? (
              <p className="w-full rounded-lg bg-base-200 px-4 py-3 text-base text-base-content/85">
                This is your own meal, so you cannot order it.
              </p>
            ) : (
              <>
                <Link
                  to={`/order/${meal._id}`}
                  className="btn btn-primary h-14 w-full gap-2 px-6 py-3 text-base sm:h-12 sm:w-auto sm:flex-none sm:px-8 sm:py-0"
                >
                  <LuShoppingBag size={20} />
                  Order Now
                </Link>
                <button
                  onClick={handleFavorite}
                  disabled={favoriteMutation.isPending}
                  className="btn btn-outline btn-primary h-14 w-full gap-2 border-2 px-6 py-3 text-base sm:h-12 sm:w-auto sm:flex-none sm:px-8 sm:py-0"
                >
                  <LuHeart size={20} />
                  Add to Favorite
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <ReviewSection mealId={meal._id} isOwnMeal={isOwnMeal} />
    </section>
  );
};

export default MealDetails;