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
    <section className="border-y border-base-300 bg-base-200">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-base-content sm:text-3xl">
          How it works
        </h2>
        <p className="mt-1 text-lg text-base-content/80">
          Three simple steps, nothing complicated.
        </p>

        <div className="mt-8 grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.title} className="flex gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-base-100 text-primary">
                <step.icon size={26} />
              </span>
              <div>
                <h3 className="text-xl font-semibold text-base-content">
                  {index + 1}. {step.title}
                </h3>
                <p className="mt-1 text-base leading-relaxed text-base-content/80">
                  {step.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExtraSection;