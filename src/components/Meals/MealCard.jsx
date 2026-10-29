import { Link } from "react-router";
import { MdOutlineLocationOn } from "react-icons/md";
import Stars from "../shared/Stars";
import { formatPrice } from "../../utils/formatPrice";


const MealCard = ({ meal }) => {
  return (
    <div className="flex flex-col overflow-hidden rounded-box border border-base-300 bg-base-100">
      <img
        src={meal.foodImage}
        alt={meal.foodName}
        className="h-48 w-full object-cover"
      />

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-lg font-semibold">{meal.foodName}</h3>

        <p className="mt-1 text-sm text-base-content/70">
          By {meal.chefName} <span className="text-base-content/50">({meal.chefId})</span>
        </p>

        <p className="mt-2 flex items-center gap-1 text-sm text-base-content/70">
          <MdOutlineLocationOn size={16} />
          {meal.deliveryArea}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <p className="text-lg font-bold text-primary">{formatPrice(meal.price)}</p>
          <div className="flex items-center gap-2">
            <Stars rating={meal.rating} />
            <span className="text-sm text-base-content/70">
              {Number(meal.rating).toFixed(1)}
            </span>
          </div>
        </div>

        <Link to={`/meals/${meal._id}`} className="btn btn-primary btn-sm mt-4">
          See Details
        </Link>
      </div>
    </div>
  );
};

export default MealCard;