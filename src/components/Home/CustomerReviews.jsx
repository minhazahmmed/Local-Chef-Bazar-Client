import { useQuery } from "@tanstack/react-query";
import axiosPublic from "../../api/axiosPublic";
import ReviewCard from "../shared/ReviewCard";
import Spinner from "../shared/Spinner";

const CustomerReviews = () => {
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["homeReviews"],
    queryFn: async () => {
      const res = await axiosPublic.get("/reviews", { params: { limit: 6 } });
      return res.data;
    },
  });

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold sm:text-3xl">What customers say</h2>
      <p className="mt-1 text-base-content/70">Honest words from people who ordered.</p>

      {isLoading ? (
        <Spinner />
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <ReviewCard key={review._id} review={review} />
          ))}
        </div>
      )}
    </section>
  );
};

export default CustomerReviews;