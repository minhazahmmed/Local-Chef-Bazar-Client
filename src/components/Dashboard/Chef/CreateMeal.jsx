import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import useTitle from "../../../hooks/useTitle";
import useUserInfo from "../../../hooks/useUserInfo";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import uploadImage from "../../../utils/uploadImage";
import Spinner from "../../shared/Spinner";

const CreateMeal = () => {
  useTitle("Create Meal");
  const { userInfo, isLoading } = useUserInfo();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    values: {
      chefName: userInfo.name || "",
      chefId: userInfo.chefId || "",
      userEmail: userInfo.email || "",
      chefExperience: userInfo.chefExperienceYears ?? "",
    },
  });

  const mealMutation = useMutation({
    mutationFn: async (data) => {
      const foodImage = await uploadImage(data.foodImage[0]);
      return axiosSecure.post("/meals", {
        foodName: data.foodName,
        chefName: data.chefName,
        foodImage,
        price: Number(data.price),
        ingredients: data.ingredients.split(",").map((item) => item.trim()),
        deliveryArea: data.deliveryArea,
        estimatedDeliveryTime: data.estimatedDeliveryTime,
        chefExperience: data.chefExperience,
      });
    },
    onSuccess: () => {
      toast.success("Meal submitted! It will be public after admin approval.");
      queryClient.invalidateQueries({ queryKey: ["userInfo"] });
      reset();
    },
    onError: (error) =>
      toast.error(
        error.response?.data?.message || error.message || "Could not create the meal"
      ),
  });

  const onSubmit = (data) => {
    if (userInfo.status === "fraud") {
      Swal.fire({
        icon: "error",
        title: "Not allowed",
        text: "Your account has been marked as fraud, so you cannot create meals.",
        confirmButtonColor: "#c8461a",
      });
      return;
    }

    mealMutation.mutate(data);
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold">Create Meal</h1>
      <p className="mt-1 text-sm text-base-content/70">
        Every new meal is reviewed by an admin before it appears on the website.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 grid gap-4 rounded-box border border-base-300 bg-base-100 p-4 sm:grid-cols-2 sm:p-6"
      >
        <div>
          <label className="mb-1 block text-sm font-medium">Food Name</label>
          <input
            type="text"
            placeholder="Spicy Chicken Biriyani"
            className="input w-full"
            {...register("foodName", { required: "Food name is required" })}
          />
          {errors.foodName && (
            <p className="mt-1 text-sm text-error">{errors.foodName.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Chef Name</label>
          <input
            type="text"
            className="input w-full"
            {...register("chefName", { required: "Chef name is required" })}
          />
          {errors.chefName && (
            <p className="mt-1 text-sm text-error">{errors.chefName.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Food Image</label>
          <input
            type="file"
            accept="image/*"
            className="file-input w-full"
            {...register("foodImage", {
              required: "Food image is required",
              validate: {
                type: (files) =>
                  ["image/jpeg", "image/png", "image/webp"].includes(files[0]?.type) ||
                  "Use a JPG, PNG or WEBP image",
                size: (files) =>
                  files[0]?.size <= 5 * 1024 * 1024 || "Image must be under 5 MB",
              },
            })}
          />
          {errors.foodImage && (
            <p className="mt-1 text-sm text-error">{errors.foodImage.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Price (৳ BDT)</label>
          <input
            type="number"
            step="1"
            placeholder="450"
            className="input w-full"
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
          <label className="mb-1 block text-sm font-medium">Rating</label>
          <input readOnly value="0" className="input w-full bg-base-200" />
          <p className="mt-1 text-xs text-base-content/60">
            Starts at 0 and updates from customer reviews.
          </p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Delivery Area</label>
          <input
            type="text"
            placeholder="Mirpur, Dhaka"
            className="input w-full"
            {...register("deliveryArea", { required: "Delivery area is required" })}
          />
          <p className="mt-1 text-xs text-base-content/60">
            The areas where you deliver this meal.
          </p>
          {errors.deliveryArea && (
            <p className="mt-1 text-sm text-error">{errors.deliveryArea.message}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium">
            Ingredients (separate with commas)
          </label>
          <input
            type="text"
            placeholder="Chicken, Rice, Onion, Spices"
            className="input w-full"
            {...register("ingredients", { required: "Ingredients are required" })}
          />
          {errors.ingredients && (
            <p className="mt-1 text-sm text-error">{errors.ingredients.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Estimated Delivery Time</label>
          <label className="input w-full">
            <input
              type="number"
              placeholder="30"
              className="grow"
              {...register("estimatedDeliveryTime", {
                required: "Delivery time is required",
                min: { value: 5, message: "At least 5 minutes" },
                max: { value: 300, message: "At most 300 minutes" },
              })}
            />
            <span className="label">minutes</span>
          </label>
          {errors.estimatedDeliveryTime && (
            <p className="mt-1 text-sm text-error">
              {errors.estimatedDeliveryTime.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Chef&apos;s Experience</label>
          <label className="input w-full">
            <input
              type="number"
              placeholder="5"
              className="grow"
              {...register("chefExperience", {
                required: "Experience is required",
                min: { value: 0, message: "Cannot be negative" },
                max: { value: 60, message: "At most 60 years" },
              })}
            />
            <span className="label">years</span>
          </label>
          <p className="mt-1 text-xs text-base-content/60">
            Saved once and shown the same on all your meals.
          </p>
          {errors.chefExperience && (
            <p className="mt-1 text-sm text-error">{errors.chefExperience.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Chef ID</label>
          <input
            readOnly
            className="input w-full bg-base-200"
            {...register("chefId")}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Your Email</label>
          <input
            readOnly
            className="input w-full bg-base-200"
            {...register("userEmail")}
          />
        </div>

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={mealMutation.isPending}
            className="btn btn-primary w-full"
          >
            {mealMutation.isPending ? "Creating..." : "Create Meal"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateMeal;