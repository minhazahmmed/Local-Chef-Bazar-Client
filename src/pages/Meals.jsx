import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import useTitle from "../hooks/useTitle";
import axiosPublic from "../api/axiosPublic";
import MealCard from "../components/Meals/MealCard";
import Spinner from "../components/shared/Spinner";

const limit = 10;

const Meals = () => {
  useTitle("Meals");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["meals", sort, page],
    queryFn: async () => {
      const res = await axiosPublic.get("/meals", {
        params: { sort, page, limit },
      });
      return res.data;
    },
    placeholderData: keepPreviousData,
  });

  const meals = data?.meals || [];
  const totalPages = Math.ceil((data?.total || 0) / limit);

  const handleSort = (value) => {
    setSort(value);
    setPage(1);
  };

  const changePage = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-base-content sm:text-4xl">All Meals</h1>
          <p className="mt-2 text-base text-base-content/85 sm:text-lg">
            Home-cooked food from chefs in your area.
          </p>
        </div>

        <select
          value={sort}
          onChange={(e) => handleSort(e.target.value)}
          className="select h-12 w-full border-base-content/30 text-base sm:w-64"
        >
          <option value="">Sort by price</option>
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </select>
      </div>

      {isLoading ? (
        <Spinner />
      ) : meals.length === 0 ? (
        <div className="mt-10 rounded-box border border-base-content/20 bg-base-100 px-4 py-16 text-center">
          <p className="text-xl font-semibold text-base-content">No meals available yet</p>
          <p className="mt-2 text-base text-base-content/80">
            Please check back soon. New chefs join every day.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {meals.map((meal) => (
              <MealCard key={meal._id} meal={meal} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <div className="join">
                <button
                  className="join-item btn h-11 border-base-content/30 text-base"
                  disabled={page === 1}
                  onClick={() => changePage(page - 1)}
                >
                  Prev
                </button>
                {[...Array(totalPages).keys()].map((i) => (
                  <button
                    key={i}
                    className={`join-item btn h-11 text-base ${
                      page === i + 1 ? "btn-primary" : "border-base-content/30"
                    }`}
                    onClick={() => changePage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  className="join-item btn h-11 border-base-content/30 text-base"
                  disabled={page === totalPages}
                  onClick={() => changePage(page + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default Meals;