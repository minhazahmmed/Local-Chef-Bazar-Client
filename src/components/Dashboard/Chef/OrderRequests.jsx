import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { MdSearch } from "react-icons/md";
import useTitle from "../../../hooks/useTitle";
import useUserInfo from "../../../hooks/useUserInfo";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Spinner from "../../shared/Spinner";
import { formatPrice } from "../../../utils/formatPrice";
import statusBadge from "../../../utils/statusBadge";
import { formatDateTime } from "../../../utils/formatDate";

const tabs = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "accepted", label: "Accepted" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
];

const OrderRequests = () => {
  useTitle("Order Requests");
  const { userInfo } = useUserInfo();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orderRequests", userInfo.chefId],
    enabled: !!userInfo.chefId,
    refetchInterval: 5000,
    queryFn: async () => {
      const res = await axiosSecure.get(`/orders/chef/${userInfo.chefId}`);
      return res.data;
    },
  });

  const refreshOrders = () =>
    queryClient.invalidateQueries({ queryKey: ["orderRequests"] });

  const onError = (error) =>
    toast.error(error.response?.data?.message || "Something went wrong");

  const statusMutation = useMutation({
    mutationFn: ({ id, orderStatus }) =>
      axiosSecure.patch(`/orders/${id}/status`, { orderStatus }),
    onSuccess: (res, variables) => {
      toast.success(`Order ${variables.orderStatus}`);
      refreshOrders();
    },
    onError,
  });

  const removeMutation = useMutation({
    mutationFn: (id) => axiosSecure.delete(`/orders/${id}`),
    onSuccess: () => {
      toast.success("Order removed from your list");
      refreshOrders();
    },
    onError,
  });

  const clearMutation = useMutation({
    mutationFn: () => axiosSecure.delete("/orders/chef/completed"),
    onSuccess: (res) => {
      toast.success(`${res.data.removed} completed orders cleared`);
      refreshOrders();
    },
    onError,
  });

  const updateStatus = (id, orderStatus) => {
    statusMutation.mutate({ id, orderStatus });
  };

  const handleRemove = async (id) => {
    const result = await Swal.fire({
      icon: "question",
      title: "Remove this order?",
      text: "It will disappear from your list. The customer's record stays safe.",
      showCancelButton: true,
      confirmButtonText: "Yes, remove",
      confirmButtonColor: "#c4372c",
    });

    if (result.isConfirmed) removeMutation.mutate(id);
  };

  const completedCount = orders.filter((order) =>
    ["delivered", "cancelled"].includes(order.orderStatus)
  ).length;

  const handleClear = async () => {
    const result = await Swal.fire({
      icon: "warning",
      title: `Clear ${completedCount} completed orders?`,
      text: "All delivered and cancelled orders will be removed from your list.",
      showCancelButton: true,
      confirmButtonText: "Yes, clear all",
      confirmButtonColor: "#c4372c",
    });

    if (result.isConfirmed) clearMutation.mutate();
  };

  const keyword = search.trim().toLowerCase();

  const filteredOrders = orders.filter((order) => {
    const matchesTab = tab === "all" || order.orderStatus === tab;
    const text = [order.mealName, order.userEmail, order.userAddress, order._id]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return matchesTab && text.includes(keyword);
  });

  if (isLoading) return <Spinner />;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold sm:text-3xl">Order Requests</h1>
        <button
          onClick={handleClear}
          disabled={completedCount === 0 || clearMutation.isPending}
          className="btn btn-outline btn-error btn-sm text-sm sm:btn-md sm:text-base"
        >
          Clear completed ({completedCount})
        </button>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {tabs.map((item) => {
          const count =
            item.key === "all"
              ? orders.length
              : orders.filter((order) => order.orderStatus === item.key).length;

          return (
            <button
              key={item.key}
              onClick={() => setTab(item.key)}
              className={`btn btn-sm text-sm sm:text-base ${
                tab === item.key ? "btn-primary" : "btn-outline"
              }`}
            >
              {item.label} ({count})
            </button>
          );
        })}
      </div>

      <label className="input mt-4 w-full text-base sm:max-w-md">
        <MdSearch size={22} className="text-base-content/70" />
        <input
          type="search"
          className="grow text-base placeholder:text-base-content/70"
          placeholder="Search by meal, email or address"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </label>

      {filteredOrders.length === 0 ? (
        <p className="mt-8 text-base text-base-content/85">No orders found.</p>
      ) : (
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredOrders.map((order) => {
            const isPending = order.orderStatus === "pending";
            const isAccepted = order.orderStatus === "accepted";
            const isCompleted = ["delivered", "cancelled"].includes(order.orderStatus);
            const isPaid = order.paymentStatus.toLowerCase() === "paid";

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
                  <div className="flex justify-between">
                    <dt className="text-base-content/80">Price</dt>
                    <dd className="font-medium">{formatPrice(order.price)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-base-content/80">Quantity</dt>
                    <dd className="font-medium">{order.quantity}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-base-content/80">User Email</dt>
                    <dd className="truncate font-medium">{order.userEmail}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-base-content/80">Address</dt>
                    <dd className="text-right font-medium">{order.userAddress}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-base-content/80">Order Time</dt>
                    <dd className="text-right font-medium">
                      {formatDateTime(order.orderTime)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
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

                {isAccepted && !isPaid && (
                  <p className="mt-3 text-sm text-base-content/85">
                    Waiting for the customer to pay. You can deliver after payment.
                  </p>
                )}

                <div className="mt-auto pt-5">
                  {isCompleted ? (
                    <button
                      onClick={() => handleRemove(order._id)}
                      disabled={removeMutation.isPending}
                      className="btn btn-outline btn-error btn-sm w-full text-sm sm:btn-md sm:text-base"
                    >
                      Remove from list
                    </button>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => updateStatus(order._id, "cancelled")}
                        disabled={!isPending || statusMutation.isPending}
                        className="btn btn-outline btn-error btn-sm text-sm sm:btn-md sm:text-base"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => updateStatus(order._id, "accepted")}
                        disabled={!isPending || statusMutation.isPending}
                        className="btn btn-outline btn-primary btn-sm text-sm sm:btn-md sm:text-base"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => updateStatus(order._id, "delivered")}
                        disabled={!isAccepted || !isPaid || statusMutation.isPending}
                        className="btn btn-outline btn-success btn-sm text-sm sm:btn-md sm:text-base"
                      >
                        Deliver
                      </button>
                    </div>
                  )}
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