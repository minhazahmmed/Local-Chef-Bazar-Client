import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useAuth from "../../../hooks/useAuth";
import useTitle from "../../../hooks/useTitle";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Spinner from "../../shared/Spinner";
import statusBadge from "../../../utils/statusBadge";
import { formatDateTime } from "../../../utils/formatDate";
import { formatPrice } from "../../../utils/formatPrice";

const MyOrders = () => {
  useTitle("My Orders");
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [payingId, setPayingId] = useState(null);

  // Browser er Back button diye Stripe theke fire ele loading state reset hobe
  useEffect(() => {
    const reset = (event) => {
      if (event.persisted) setPayingId(null);
    };
    window.addEventListener("pageshow", reset);
    return () => window.removeEventListener("pageshow", reset);
  }, []);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["myOrders", user.email],
    refetchInterval: 5000,
    queryFn: async () => {
      const res = await axiosSecure.get(`/orders/user/${user.email}`);
      return res.data;
    },
  });

  const payMutation = useMutation({
    mutationFn: (orderId) =>
      axiosSecure.post(
        "/create-checkout-session",
        { orderId },
        { timeout: 20000 }
      ),
    onSuccess: (res) => {
      window.location.href = res.data.url;
    },
    onError: (error) => {
      setPayingId(null);
      toast.error(
        error.code === "ECONNABORTED"
          ? "Server is not responding. Please try again."
          : error.response?.data?.message || "Could not start the payment"
      );
    },
  });

  const handlePay = (orderId) => {
    setPayingId(orderId);
    payMutation.mutate(orderId);
  };

  if (isLoading) return <Spinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold sm:text-3xl">My Orders</h1>

      {orders.length === 0 ? (
        <p className="mt-6 text-base text-base-content/85">
          You have not ordered anything yet.
        </p>
      ) : (
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {orders.map((order) => {
            const canPay =
              order.orderStatus === "accepted" &&
              order.paymentStatus.toLowerCase() === "pending";
            const isPaying = payingId === order._id;

            return (
              <div
                key={order._id}
                className="flex flex-col rounded-box border border-base-300 bg-base-100 p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-xl font-semibold">{order.mealName}</h3>
                  <span
                    className={`badge h-7 text-sm capitalize ${statusBadge[order.orderStatus]}`}
                  >
                    {order.orderStatus}
                  </span>
                </div>

                <dl className="mt-4 space-y-2 text-base">
                  <div className="flex justify-between gap-3">
                    <dt className="text-base-content/80">Price</dt>
                    <dd className="font-medium">{formatPrice(order.price)}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-base-content/80">Quantity</dt>
                    <dd className="font-medium">{order.quantity}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-base-content/80">Delivery Time</dt>
                    <dd className="font-medium">{order.estimatedDeliveryTime}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-base-content/80">Ordered On</dt>
                    <dd className="text-right font-medium">
                      {formatDateTime(order.orderTime)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-base-content/80">Chef Name</dt>
                    <dd className="font-medium">{order.chefName}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-base-content/80">Chef ID</dt>
                    <dd className="font-medium">{order.chefId}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-base-content/80">Payment</dt>
                    <dd>
                      <span
                        className={`badge h-7 text-sm capitalize ${
                          statusBadge[order.paymentStatus.toLowerCase()]
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </dd>
                  </div>
                </dl>

                {canPay && (
                  <div className="mt-auto pt-5">
                    <button
                      onClick={() => handlePay(order._id)}
                      disabled={isPaying}
                      className="btn btn-primary btn-sm w-full text-sm sm:btn-md sm:text-base"
                    >
                      {isPaying ? (
                        <>
                          <span className="loading loading-spinner loading-sm" />
                          Redirecting...
                        </>
                      ) : (
                        "Pay"
                      )}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrders;