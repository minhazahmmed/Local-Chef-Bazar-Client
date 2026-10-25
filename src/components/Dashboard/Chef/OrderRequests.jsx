import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useTitle from "../../../hooks/useTitle";
import useUserInfo from "../../../hooks/useUserInfo";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Spinner from "../../shared/Spinner";
import statusBadge from "../../../utils/statusBadge";
import { formatDateTime } from "../../../utils/formatDate";

const OrderRequests = () => {
  useTitle("Order Requests");
  const { userInfo } = useUserInfo();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orderRequests", userInfo.chefId],
    enabled: !!userInfo.chefId,
    refetchInterval: 5000,
    queryFn: async () => {
      const res = await axiosSecure.get(`/orders/chef/${userInfo.chefId}`);
      return res.data;
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, orderStatus }) =>
      axiosSecure.patch(`/orders/${id}/status`, { orderStatus }),
    onSuccess: (res, variables) => {
      toast.success(`Order ${variables.orderStatus}`);
      queryClient.invalidateQueries({ queryKey: ["orderRequests"] });
    },
    onError: () => toast.error("Could not update the order"),
  });

  const updateStatus = (id, orderStatus) => {
    statusMutation.mutate({ id, orderStatus });
  };

  if (isLoading) return <Spinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold">Order Requests</h1>

      {orders.length === 0 ? (
        <p className="mt-6 text-base-content/70">No one has ordered from you yet.</p>
      ) : (
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {orders.map((order) => {
            const isPending = order.orderStatus === "pending";
            const isAccepted = order.orderStatus === "accepted";

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
                    <dd className="font-medium">${order.price}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-base-content/60">Quantity</dt>
                    <dd className="font-medium">{order.quantity}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-base-content/60">User Email</dt>
                    <dd className="truncate font-medium">{order.userEmail}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-base-content/60">Address</dt>
                    <dd className="text-right font-medium">{order.userAddress}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-base-content/60">Order Time</dt>
                    <dd className="font-medium">{formatDateTime(order.orderTime)}</dd>
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

                <div className="mt-5 grid grid-cols-3 gap-2">
                  <button
                    onClick={() => updateStatus(order._id, "cancelled")}
                    disabled={!isPending || statusMutation.isPending}
                    className="btn btn-outline btn-error btn-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => updateStatus(order._id, "accepted")}
                    disabled={!isPending || statusMutation.isPending}
                    className="btn btn-outline btn-primary btn-sm"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => updateStatus(order._id, "delivered")}
                    disabled={!isAccepted || statusMutation.isPending}
                    className="btn btn-outline btn-success btn-sm"
                  >
                    Deliver
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderRequests;