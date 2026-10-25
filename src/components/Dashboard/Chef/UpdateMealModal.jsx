import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import uploadImage from "../../../utils/uploadImage";

const UpdateMealModal = ({ meal, onClose }) => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      foodName: meal.foodName,
      price: meal.price,
      rating: meal.rating,
      ingredients: meal.ingredients.join(", "),
      deliveryArea: meal.deliveryArea,
      estimatedDeliveryTime: meal.estimatedDeliveryTime,
      chefExperience: meal.chefExperience,
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      const foodImage = data.foodImage?.[0]
        ? await uploadImage(data.foodImage[0])
        : meal.foodImage;

      return axiosSecure.patch(`/meals/${meal._id}`, {
        foodName: data.foodName,
        foodImage,
        price: Number(data.price),
        rating: Number(data.rating),
        ingredients: data.ingredients.split(",").map((item) => item.trim()),
        deliveryArea: data.deliveryArea,
        estimatedDeliveryTime: data.estimatedDeliveryTime,
        chefExperience: data.chefExperience,
      });
    },
    onSuccess: () => {
      toast.success("Meal updated successfully");
      queryClient.invalidateQueries({ queryKey: ["myMeals"] });
      onClose();
    },
    onError: () => toast.error("Could not update the meal"),
  });

  const onSubmit = (data) => updateMutation.mutate(data);

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <h3 className="text-lg font-semibold">Update meal</h3>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-4 grid gap-4 sm:grid-cols-2"
        >
          <div>
            <label className="mb-1 block text-sm font-medium">Food Name</label>
            <input
              type="text"
              className="input w-full"
              {...register("foodName", { required: "Food name is required" })}
            />
            {errors.foodName && (
              <p className="mt-1 text-sm text-error">{errors.foodName.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">New Image (optional)</label>
            <input
              type="file"
              accept="image/*"
              className="file-input w-full"
              {...register("foodImage")}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Price ($)</label>
            <input
              type="number"
              step="0.01"
              className="input w-full"
              {...register("price", { required: "Price is required" })}
            />
            {errors.price && (
              <p className="mt-1 text-sm text-error">{errors.price.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Rating</label>
            <input
              type="number"
              step="0.1"
              className="input w-full"
              {...register("rating", {
                min: { value: 0, message: "Minimum is 0" },
                max: { value: 5, message: "Maximum is 5" },
              })}
            />
            {errors.rating && (
              <p className="mt-1 text-sm text-error">{errors.rating.message}</p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium">
              Ingredients (separate with commas)
            </label>
            <input
              type="text"
              className="input w-full"
              {...register("ingredients", { required: "Ingredients are required" })}
            />
            {errors.ingredients && (
              <p className="mt-1 text-sm text-error">{errors.ingredients.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Delivery Area</label>
            <input
              type="text"
              className="input w-full"
              {...register("deliveryArea", { required: "Delivery area is required" })}
            />
            {errors.deliveryArea && (
              <p className="mt-1 text-sm text-error">{errors.deliveryArea.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Estimated Delivery Time</label>
            <input
              type="text"
              className="input w-full"
              {...register("estimatedDeliveryTime", {
                required: "Delivery time is required",
              })}
            />
            {errors.estimatedDeliveryTime && (
              <p className="mt-1 text-sm text-error">
                {errors.estimatedDeliveryTime.message}
              </p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium">Chef&apos;s Experience</label>
            <input
              type="text"
              className="input w-full"
              {...register("chefExperience", { required: "Experience is required" })}
            />
            {errors.chefExperience && (
              <p className="mt-1 text-sm text-error">{errors.chefExperience.message}</p>
            )}
          </div>

          <div className="modal-action sm:col-span-2">
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="btn btn-primary"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateMealModal;