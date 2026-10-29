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
      axiosSecure.post("/create-checkout-session", { orderId }),
    onSuccess: (res) => {
      window.location.href = res.data.url;
    },
    onError: () => toast.error("Could not start the payment"),
  });

  if (isLoading) return <Spinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold">My Orders</h1>

      {orders.length === 0 ? (
        <p className="mt-6 text-base-content/70">You have not ordered anything yet.</p>
      ) : (
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {orders.map((order) => {
            const canPay =
              order.orderStatus === "accepted" &&
              order.paymentStatus.toLowerCase() === "pending";

            return (
              <div
                key={order._id}
                className="rounded-box border border-base-300 bg-base-100 p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold">{order.mealName}</h3>
                  <span
                    className={`badge capitalize ${statusBadge[order.orderStatus]}`}
                  >
                    {order.orderStatus}
                  </span>
                </div>

                <dl className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-base-content/60">Price</dt>
                    <dd className="font-medium">{formatPrice(order.price)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-base-content/60">Quantity</dt>
                    <dd className="font-medium">{order.quantity}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-base-content/60">Delivery Time</dt>
                    <dd className="font-medium">{order.estimatedDeliveryTime}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-base-content/60">Ordered On</dt>
                    <dd className="font-medium">{formatDateTime(order.orderTime)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-base-content/60">Chef Name</dt>
                    <dd className="font-medium">{order.chefName}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-base-content/60">Chef ID</dt>
                    <dd className="font-medium">{order.chefId}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-base-content/60">Payment</dt>
                    <dd>
                      <span
                        className={`badge capitalize ${
                          statusBadge[order.paymentStatus.toLowerCase()]
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </dd>
                  </div>
                </dl>

                {canPay && (
                  <button
                    onClick={() => payMutation.mutate(order._id)}
                    disabled={payMutation.isPending}
                    className="btn btn-primary btn-sm mt-5 w-full"
                  >
                    Pay
                  </button>
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