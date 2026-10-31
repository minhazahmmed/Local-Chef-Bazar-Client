import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { MdOutlineReceiptLong } from "react-icons/md";
import useAuth from "../../../hooks/useAuth";
import useTitle from "../../../hooks/useTitle";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Spinner from "../../shared/Spinner";
import statusBadge from "../../../utils/statusBadge";
import { formatDateTime } from "../../../utils/formatDate";
import { formatPrice } from "../../../utils/formatPrice";

const Row = ({ label, children }) => (
  <div className="flex items-start justify-between gap-4">
    <dt className="shrink-0 text-base-content/85">{label}</dt>
    <dd className="min-w-0 break-words text-right font-medium text-base-content">
      {children}
    </dd>
  </div>
);

const MyOrders = () => {
  useTitle("My Orders");
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [payingId, setPayingId] = useState(null);

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
      <h1 className="text-2xl font-bold text-base-content sm:text-3xl">
        My Orders
      </h1>
      <p className="mt-1 text-base text-base-content/85">
        Order status updates here automatically. Pay once the chef accepts.
      </p>

      {orders.length === 0 ? (
        <div className="mt-6 flex flex-col items-center rounded-box border border-base-300 bg-base-100 px-6 py-14 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <MdOutlineReceiptLong size={30} />
          </span>
          <p className="mt-4 text-lg font-semibold text-base-content">
            No orders yet
          </p>
          <p className="mt-1 text-base text-base-content/85">
            You have not ordered anything yet.
          </p>
        </div>
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
                className="flex flex-col rounded-box border border-base-300 bg-base-100 p-4 sm:p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="min-w-0 break-words text-xl font-semibold text-base-content">
                    {order.mealName}
                  </h3>
                  <span
                    className={`badge h-7 shrink-0 text-sm font-medium capitalize ${statusBadge[order.orderStatus]}`}
                  >
                    {order.orderStatus}
                  </span>
                </div>

                <dl className="mt-4 space-y-2.5 border-t border-base-300 pt-4 text-base">
                  <Row label="Price">{formatPrice(order.price)}</Row>
                  <Row label="Quantity">{order.quantity}</Row>
                  <Row label="Delivery Time">{order.estimatedDeliveryTime}</Row>
                  <Row label="Ordered On">{formatDateTime(order.orderTime)}</Row>
                  <Row label="Chef Name">{order.chefName}</Row>
                  <Row label="Chef ID">
                    <span className="break-all">{order.chefId}</span>
                  </Row>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-base-content/85">Payment</dt>
                    <dd>
                      <span
                        className={`badge h-7 text-sm font-medium capitalize ${
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
                      className="btn btn-primary h-11 min-h-11 w-full text-base"
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