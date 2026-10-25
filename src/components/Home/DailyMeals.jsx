import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import axiosPublic from "../../api/axiosPublic";
import MealCard from "../Meals/MealCard";
import Spinner from "../shared/Spinner";

const DailyMeals = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["dailyMeals"],
    queryFn: async () => {
      const res = await axiosPublic.get("/meals", {
        params: { page: 1, limit: 6 },
      });
      return res.data;
    },
  });

  const meals = data?.meals || [];

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold sm:text-3xl">Today&apos;s Meals</h2>
          <p className="mt-1 text-base-content/70">
            Cooked this morning by chefs near you.
          </p>
        </div>
        <Link to="/meals" className="text-sm font-medium text-primary hover:underline">
          See all
        </Link>
      </div>

      {isLoading ? (
        <Spinner />
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {meals.map((meal) => (
            <MealCard key={meal._id} meal={meal} />
          ))}
        </div>
      )}
    </section>
  );
};

export default DailyMeals;