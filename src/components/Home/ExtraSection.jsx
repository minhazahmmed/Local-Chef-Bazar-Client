import { motion } from "framer-motion";
import {
  MdOutlineRestaurantMenu,
  MdOutlineShoppingBag,
  MdOutlineDeliveryDining,
} from "react-icons/md";

const steps = [
  {
    icon: MdOutlineRestaurantMenu,
    title: "Pick a meal",
    text: "Look through the daily menu and choose what you feel like eating.",
  },
  {
    icon: MdOutlineShoppingBag,
    title: "Place your order",
    text: "Add your address, confirm the quantity and the chef gets to work.",
  },
  {
    icon: MdOutlineDeliveryDining,
    title: "Enjoy it fresh",
    text: "Your meal arrives at your door. Leave a review once you have tried it.",
  },
];

const ExtraSection = () => {
  return (
    <section className="bg-[#2b1d14]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">How it works</h2>
        <p className="mt-2 text-lg text-white/80">
          Three simple steps, nothing complicated.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              className="rounded-box border border-white/10 bg-base-100 p-7 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-content">
                  <step.icon size={28} />
                </span>
                <span className="text-5xl font-extrabold text-primary/30">
                  0{index + 1}
                </span>
              </div>
              <h3 className="mt-5 text-xl font-bold text-base-content">{step.title}</h3>
              <p className="mt-2 text-base leading-relaxed text-base-content/80">
                {step.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExtraSection;