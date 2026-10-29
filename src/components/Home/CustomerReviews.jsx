import { useQuery } from "@tanstack/react-query";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
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

  const canLoop = reviews.length >= 6;

  return (
    <section className="overflow-hidden bg-base-200">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-base-content sm:text-4xl">
            What customers say
          </h2>
          <p className="mt-2 text-lg text-base-content/80">
            Honest words from people who ordered.
          </p>
        </div>

        {isLoading ? (
          <Spinner />
        ) : reviews.length === 0 ? (
          <p className="mt-10 text-center text-lg text-base-content/80">
            No reviews yet.
          </p>
        ) : (
          <Swiper
            className="review-swiper mt-10 !pb-14 !pt-4"
            modules={[Autoplay, EffectCoverflow, Pagination]}
            effect="coverflow"
            grabCursor
            centeredSlides
            slidesPerView="auto"
            loop={canLoop}
            rewind={!canLoop}
            speed={700}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            coverflowEffect={{
              rotate: 28,
              stretch: 0,
              depth: 140,
              modifier: 1,
              slideShadows: false,
            }}
            pagination={{ clickable: true }}
          >
            {reviews.map((review) => (
              <SwiperSlide
                key={review._id}
                className="!h-auto !w-[86%] sm:!w-[400px]"
              >
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