import { Navigate, useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAuth from "../hooks/useAuth";
import useTitle from "../hooks/useTitle";
import useUserInfo from "../hooks/useUserInfo";
import useAxiosSecure from "../hooks/useAxiosSecure";
import Spinner from "../components/shared/Spinner";
import { formatDateTime } from "../utils/formatDate";
import { formatPrice } from "../utils/formatPrice";


const OrderPage = () => {
  useTitle("Place Order");
  const { id } = useParams();
  const { user } = useAuth();
  const { userInfo, isLoading: userLoading } = useUserInfo();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const {
    data: meal,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["meal", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/meals/${id}`);
      return res.data;
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    values: {
      mealName: meal?.foodName || "",
      price: meal?.price || 0,
      quantity: 1,
      chefId: meal?.chefId || "",
      userEmail: user.email,
      userAddress: userInfo.address || "",
      orderStatus: "pending",
    },
  });

  const orderMutation = useMutation({
    mutationFn: (order) => axiosSecure.post("/orders", order),
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Order placed successfully!",
        confirmButtonColor: "#c8461a",
      });
      navigate("/dashboard/my-orders");
    },
    onError: (error) =>
      Swal.fire({
        icon: "error",
        title: "Order failed",
        text: error.response?.data?.message || "Please try again",
        confirmButtonColor: "#c8461a",
      }),
  });

  const quantity = Number(watch("quantity")) || 0;
  const totalPrice = Number((meal?.price * quantity).toFixed(2)) || 0;

  const onSubmit = async (data) => {
    if (userInfo.status === "fraud") {
      Swal.fire({
        icon: "error",
        title: "Order blocked",
        text: "Your account has been marked as fraud, so you cannot place orders.",
        confirmButtonColor: "#c8461a",
      });
      return;
    }

    const result = await Swal.fire({
      icon: "question",
      title: `Your total price is ${formatPrice(totalPrice)}.`,
      text: "Do you want to confirm the order?",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#c8461a",
    });

    if (!result.isConfirmed) return;

    orderMutation.mutate({
      foodId: meal._id,
      quantity: Number(data.quantity),
      userAddress: data.userAddress,
    });
  };

  if (isLoading || userLoading) return <Spinner />;

  if (isError || !meal) return <Navigate to="/meals" replace />;

  if (meal.userEmail === user.email) {
    return <Navigate to={`/meals/${id}`} replace />;
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold sm:text-3xl">Confirm your order</h1>
      <p className="mt-1 text-base-content/70">
        Check the details and add your delivery address.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 space-y-4 rounded-box border border-base-300 bg-base-100 p-6"
      >
        <div>
          <label className="mb-1 block text-sm font-medium">Meal Name</label>
          <input
            readOnly
            className="input w-full bg-base-200"
            {...register("mealName")}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Price</label>
            <input
              readOnly
              className="input w-full bg-base-200"
              {...register("price")}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Quantity</label>
            <input
              type="number"
              className="input w-full"
              {...register("quantity", {
                required: "Quantity is required",
                min: { value: 1, message: "Minimum quantity is 1" },
              })}
            />
            {errors.quantity && (
              <p className="mt-1 text-sm text-error">{errors.quantity.message}</p>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
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
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Your Delivery Address</label>
          <input
            type="text"
            placeholder="House, road, area, city"
            className="input w-full"
            {...register("userAddress", { required: "Delivery address is required" })}
          />
          {errors.userAddress && (
            <p className="mt-1 text-sm text-error">{errors.userAddress.message}</p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Order Status</label>
            <input
              readOnly
              className="input w-full bg-base-200"
              {...register("orderStatus")}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Order Time</label>
            <input
              readOnly
              value={formatDateTime(new Date())}
              className="input w-full bg-base-200"
            />
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-base-300 pt-4">
          <p className="text-base-content/70">Total</p>
          <p className="text-2xl font-bold text-primary">{formatPrice(totalPrice)}</p>
        </div>

        <button
          type="submit"
          disabled={orderMutation.isPending}
          className="btn btn-primary w-full"
        >
          Confirm Order
        </button>
      </form>
    </section>
  );
};

export default OrderPage;