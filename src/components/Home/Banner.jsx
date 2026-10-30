import { Link } from "react-router";
import { motion } from "framer-motion";
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
    <section className="bg-linear-to-br from-primary/15 via-base-200 to-base-200">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 md:grid-cols-2 lg:px-8 lg:py-24">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block rounded-full bg-primary/15 px-4 py-1.5 text-sm font-bold uppercase tracking-wide text-primary"
          >
            Homemade, not factory-made
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-5 text-4xl font-extrabold leading-tight text-base-content sm:text-5xl lg:text-6xl"
          >
            Fresh meals cooked in your{" "}
            <span className="text-primary">neighbour&apos;s kitchen</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-5 max-w-xl text-lg leading-relaxed text-base-content/85 sm:text-xl"
          >
            Pick from today&apos;s menu, order from a local home chef, and have
            it at your door while it is still warm.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link to="/meals" className="btn btn-primary btn-lg">
              Browse Meals
            </Link>
            <Link
              to={chefButton.to}
              className="btn btn-outline btn-primary btn-lg border-2"
            >
              {chefButton.label}
            </Link>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[15px] font-medium text-base-content/85"
          >
            {highlights.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary" />
                {item}
              </li>
            ))}
          </motion.ul>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative"
        >
          <div className="absolute -bottom-3 -right-3 h-full w-full rounded-box bg-primary/25" />
          <img
            src={bannerImage}
            alt="A table full of homemade dishes"
            fetchPriority="high"
            className="relative h-72 w-full rounded-box object-cover shadow-xl sm:h-96 lg:h-112"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Banner;