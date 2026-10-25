import { MdOutlineRestaurantMenu, MdOutlineShoppingBag, MdOutlineDeliveryDining } from "react-icons/md";

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
    <section className="bg-base-200">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold sm:text-3xl">How it works</h2>
        <p className="mt-1 text-base-content/70">Three simple steps, nothing complicated.</p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="rounded-box border border-base-300 bg-base-100 p-6"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <step.icon size={24} />
                </span>
                <span className="text-3xl font-bold text-base-300">0{index + 1}</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-base-content/75">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExtraSection;