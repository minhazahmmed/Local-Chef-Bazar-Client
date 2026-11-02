import { useQuery } from "@tanstack/react-query";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import axiosPublic from "../../api/axiosPublic";
import ReviewCard from "../shared/ReviewCard";
import Spinner from "../shared/Spinner";

const CustomerReviews = () => {
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["homeReviews"],
    queryFn: async () => {
      const res = await axiosPublic.get("/reviews", { params: { limit: 12 } });
      return res.data;
    },
  });

  const canLoop = reviews.length >= 7;

  return (
    <section className="overflow-hidden bg-base-100">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-base-content sm:text-3xl">
          What customers say
        </h2>
        <p className="mt-1 text-lg text-base-content/80">
          Honest words from people who ordered.
        </p>

        {isLoading ? (
          <Spinner />
        ) : reviews.length === 0 ? (
          <p className="mt-8 text-lg text-base-content/80">No reviews yet.</p>
        ) : (
          <Swiper
            className="mt-8 !pb-12 [&_.swiper-pagination-bullet-active]:!bg-primary"
            modules={[Autoplay, Pagination]}
            grabCursor
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            loop={canLoop}
            rewind={!canLoop}
            speed={600}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{ clickable: true }}
          >
            {reviews.map((review) => (
              <SwiperSlide key={review._id} className="!h-auto">
                <ReviewCard review={review} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
};

export default CustomerReviews;