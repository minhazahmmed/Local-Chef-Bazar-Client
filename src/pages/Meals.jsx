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
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">All Meals</h1>
          <p className="mt-1 text-base-content/70">
            Home-cooked food from chefs in your area.
          </p>
        </div>

        <select
          value={sort}
          onChange={(e) => handleSort(e.target.value)}
          className="select w-full sm:w-56"
        >
          <option value="">Sort by price</option>
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </select>
      </div>

      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {meals.map((meal) => (
              <MealCard key={meal._id} meal={meal} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-10 flex justify-center">
              <div className="join">
                <button
                  className="join-item btn"
                  disabled={page === 1}
                  onClick={() => changePage(page - 1)}
                >
                  Prev
                </button>
                {[...Array(totalPages).keys()].map((i) => (
                  <button
                    key={i}
                    className={`join-item btn ${page === i + 1 ? "btn-primary" : ""}`}
                    onClick={() => changePage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  className="join-item btn"
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