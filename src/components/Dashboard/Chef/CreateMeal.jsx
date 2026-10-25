import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
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
      rating: 0,
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
        rating: Number(data.rating),
        ingredients: data.ingredients.split(",").map((item) => item.trim()),
        deliveryArea: data.deliveryArea,
        estimatedDeliveryTime: data.estimatedDeliveryTime,
        chefExperience: data.chefExperience,
        chefId: data.chefId,
        userEmail: data.userEmail,
        createdAt: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      toast.success("Meal created successfully");
      reset();
    },
    onError: () => toast.error("Could not create the meal"),
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

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 grid gap-4 rounded-box border border-base-300 bg-base-100 p-6 sm:grid-cols-2"
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
            {...register("foodImage", { required: "Food image is required" })}
          />
          {errors.foodImage && (
            <p className="mt-1 text-sm text-error">{errors.foodImage.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Price ($)</label>
          <input
            type="number"
            step="0.01"
            placeholder="12.99"
            className="input w-full"
            {...register("price", {
              required: "Price is required",
              min: { value: 1, message: "Price must be at least 1" },
            })}
          />
          {errors.price && (
            <p className="mt-1 text-sm text-error">{errors.price.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Rating (0 to 5)</label>
          <input
            type="number"
            step="0.1"
            className="input w-full"
            {...register("rating", {
              required: "Rating is required",
              min: { value: 0, message: "Minimum is 0" },
              max: { value: 5, message: "Maximum is 5" },
            })}
          />
          {errors.rating && (
            <p className="mt-1 text-sm text-error">{errors.rating.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Delivery Area</label>
          <input
            type="text"
            placeholder="Mirpur, Dhaka"
            className="input w-full"
            {...register("deliveryArea", { required: "Delivery area is required" })}
          />
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
          <input
            type="text"
            placeholder="30 minutes"
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

        <div>
          <label className="mb-1 block text-sm font-medium">Chef&apos;s Experience</label>
          <input
            type="text"
            placeholder="5 years of home cooking"
            className="input w-full"
            {...register("chefExperience", { required: "Experience is required" })}
          />
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