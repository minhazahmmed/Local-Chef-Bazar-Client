import { Link } from "react-router";
import { LuCheck } from "react-icons/lu";
import useAuth from "../../hooks/useAuth";
import useUserInfo from "../../hooks/useUserInfo";
import bannerImage from "../../assets/banner.avif";

const highlights = ["Cooked fresh daily", "Local home chefs", "Secure payment"];

const Banner = () => {
  const { user } = useAuth();
  const { userInfo } = useUserInfo();

  let chefButton = { to: "/register", label: "Become a Chef" };

  if (user) {
    chefButton = { to: "/dashboard/profile", label: "Become a Chef" };
  }

  if (userInfo.role === "chef") {
    chefButton = { to: "/dashboard/create-meal", label: "Create a Meal" };
  }

  if (userInfo.role === "admin") {
    chefButton = { to: "/dashboard/statistics", label: "Open Dashboard" };
  }

  return (
    <section className="border-b border-base-300 bg-base-100">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:gap-14 lg:px-8 lg:py-20">
        <div>
          <h1 className="text-4xl font-bold leading-tight text-base-content sm:text-5xl lg:text-6xl">
            Fresh home-cooked meals from chefs near you
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-base-content/85 sm:text-xl">
            Pick from today&apos;s menu, order from a local home chef, and have
            it at your door while it is still warm.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/meals" className="btn btn-primary btn-lg">
              Browse Meals
            </Link>
            <Link
              to={chefButton.to}
              className="btn btn-outline btn-lg border-base-300 text-base-content hover:border-base-content hover:bg-base-200"
            >
              {chefButton.label}
            </Link>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[15px] font-medium text-base-content/85">
            {highlights.map((item) => (
              <li key={item} className="flex items-center gap-1.5">
                <LuCheck size={18} className="text-secondary" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <img
          src={bannerImage}
          alt="A table full of homemade dishes"
          fetchPriority="high"
          className="h-72 w-full rounded-box object-cover sm:h-96 lg:h-112"
        />
      </div>
    </section>
  );
};

export default Banner;