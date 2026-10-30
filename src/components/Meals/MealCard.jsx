import { Link } from "react-router";
import { LuMapPin, LuChefHat } from "react-icons/lu";
import Stars from "../shared/Stars";
import { formatPrice } from "../../utils/formatPrice";

const MealCard = ({ meal }) => {
  return (
    <div className="group flex flex-col overflow-hidden rounded-box border border-base-content/20 bg-base-100 transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-52 overflow-hidden sm:h-56">
        <img
          src={meal.foodImage}
          alt={meal.foodName}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute right-3 top-3 rounded-full bg-base-100 px-3.5 py-1 text-base font-bold text-primary shadow">
          {formatPrice(meal.price)}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-1 text-xl font-bold text-base-content">
          {meal.foodName}
        </h3>

        <p className="mt-2 flex items-center gap-2 text-[15px] font-medium text-base-content/85">
          <LuChefHat size={18} className="shrink-0 text-primary" />
          <span className="truncate">
            {meal.chefName}{" "}
            <span className="font-normal text-base-content/60">({meal.chefId})</span>
          </span>
        </p>

        <p className="mt-1.5 flex items-center gap-2 text-[15px] text-base-content/85">
          <LuMapPin size={18} className="shrink-0 text-primary" />
          <span className="truncate">{meal.deliveryArea}</span>
        </p>

        <div className="mt-3 flex items-center gap-2">
          <Stars rating={meal.rating} />
          <span className="text-[15px] font-semibold text-base-content/85">
            {Number(meal.rating).toFixed(1)}
          </span>
        </div>

        <Link
          to={`/meals/${meal._id}`}
          className="btn btn-primary mt-5 h-11 text-base"
        >
          See Details
        </Link>
      </div>
    </div>
  );
};

export default MealCard;