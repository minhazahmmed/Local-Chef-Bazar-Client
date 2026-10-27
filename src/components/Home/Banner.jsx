import { Link } from "react-router";
import { motion } from "framer-motion";
import useAuth from "../../hooks/useAuth";
import useUserInfo from "../../hooks/useUserInfo";

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
    <section className="bg-base-200">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:px-8 lg:py-20">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-sm font-semibold uppercase tracking-wide text-primary"
          >
            Homemade, not factory-made
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-3 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl"
          >
            Fresh meals cooked in your neighbour&apos;s kitchen
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-4 max-w-lg text-base leading-relaxed text-base-content/75"
          >
            Pick from today&apos;s menu, order from a local home chef, and have
            it at your door while it is still warm.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-7 flex flex-wrap gap-3"
          >
            <Link to="/meals" className="btn btn-primary">
              Browse Meals
            </Link>
            <Link to={chefButton.to} className="btn btn-outline btn-primary">
              {chefButton.label}
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80"
            alt="A table full of homemade dishes"
            className="h-72 w-full rounded-box object-cover sm:h-96"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Banner;