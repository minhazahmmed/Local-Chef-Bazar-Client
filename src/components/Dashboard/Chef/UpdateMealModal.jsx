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
      ingredients: meal.ingredients.join(", "),
      deliveryArea: meal.deliveryArea,
      estimatedDeliveryTime: parseInt(meal.estimatedDeliveryTime, 10) || "",
      chefExperience: parseInt(meal.chefExperience, 10) || 0,
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
        ingredients: data.ingredients.split(",").map((item) => item.trim()),
        deliveryArea: data.deliveryArea,
        estimatedDeliveryTime: data.estimatedDeliveryTime,
        chefExperience: data.chefExperience,
      });
    },
    onSuccess: (res) => {
      toast.success(
        res.data.sentForReview
          ? "Meal updated. It will be public again after admin approval."
          : "Meal updated successfully"
      );
      queryClient.invalidateQueries({ queryKey: ["myMeals"] });
      onClose();
    },
    onError: (error) =>
      toast.error(
        error.response?.data?.message || error.message || "Could not update the meal"
      ),
  });

  const onSubmit = (data) => updateMutation.mutate(data);

  return (
    <div className="modal modal-open">
      <div className="modal-box max-h-[90vh] max-w-2xl">
        <h3 className="text-xl font-semibold sm:text-2xl">Update meal</h3>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-4 grid gap-4 sm:grid-cols-2"
        >
          <div>
            <label className="mb-1 block text-base font-medium">Food Name</label>
            <input
              type="text"
              className="input w-full text-base"
              {...register("foodName", { required: "Food name is required" })}
            />
            {errors.foodName && (
              <p className="mt-1 text-sm text-error">{errors.foodName.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-base font-medium">
              New Image (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              className="file-input w-full text-base"
              {...register("foodImage")}
            />
          </div>

          <div>
            <label className="mb-1 block text-base font-medium">Price (৳ BDT)</label>
            <input
              type="number"
              step="1"
              className="input w-full text-base"
              {...register("price", {
                required: "Price is required",
                min: { value: 100, message: "Price must be at least ৳100" },
                max: { value: 50000, message: "Price cannot be more than ৳50,000" },
              })}
            />
            {errors.price && (
              <p className="mt-1 text-sm text-error">{errors.price.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-base font-medium">Rating</label>
            <input
              readOnly
              value={Number(meal.rating).toFixed(1)}
              className="input w-full bg-base-200 text-base"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-base font-medium">
              Ingredients (separate with commas)
            </label>
            <input
              type="text"
              className="input w-full text-base"
              {...register("ingredients", { required: "Ingredients are required" })}
            />
            {errors.ingredients && (
              <p className="mt-1 text-sm text-error">{errors.ingredients.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-base font-medium">Delivery Area</label>
            <input
              type="text"
              className="input w-full text-base"
              {...register("deliveryArea", { required: "Delivery area is required" })}
            />
            {errors.deliveryArea && (
              <p className="mt-1 text-sm text-error">{errors.deliveryArea.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-base font-medium">
              Estimated Delivery Time
            </label>
            <label className="input w-full text-base">
              <input
                type="number"
                className="grow text-base"
                {...register("estimatedDeliveryTime", {
                  required: "Delivery time is required",
                  min: { value: 5, message: "At least 5 minutes" },
                  max: { value: 300, message: "At most 300 minutes" },
                })}
              />
              <span className="label text-base text-base-content/80">minutes</span>
            </label>
            {errors.estimatedDeliveryTime && (
              <p className="mt-1 text-sm text-error">
                {errors.estimatedDeliveryTime.message}
              </p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-base font-medium">
              Chef&apos;s Experience
            </label>
            <label className="input w-full text-base">
              <input
                type="number"
                className="grow text-base"
                {...register("chefExperience", {
                  required: "Experience is required",
                  min: { value: 0, message: "Cannot be negative" },
                  max: { value: 60, message: "At most 60 years" },
                })}
              />
              <span className="label text-base text-base-content/80">years</span>
            </label>
            <p className="mt-1 text-sm text-base-content/80">
              Updates the experience on all your meals.
            </p>
            {errors.chefExperience && (
              <p className="mt-1 text-sm text-error">{errors.chefExperience.message}</p>
            )}
          </div>

          <div className="modal-action sm:col-span-2">
            <button type="button" className="btn text-base" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="btn btn-primary text-base"
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