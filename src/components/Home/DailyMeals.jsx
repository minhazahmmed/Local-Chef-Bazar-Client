import { Link } from "react-router";
import { motion } from "framer-motion";
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
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-base-content sm:text-4xl">
            Today&apos;s Meals
          </h2>
          <p className="mt-2 text-lg text-base-content/80">
            Cooked this morning by chefs near you.
          </p>
        </div>
        <Link
          to="/meals"
          className="btn btn-outline btn-primary btn-sm border-2 sm:btn-md"
        >
          See all
        </Link>
      </div>

      {isLoading ? (
        <Spinner />
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {meals.map((meal, index) => (
            <motion.div
              key={meal._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
            >
              <MealCard meal={meal} />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
};

export default DailyMeals;