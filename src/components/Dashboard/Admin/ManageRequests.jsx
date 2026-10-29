import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { MdSearch } from "react-icons/md";
import useTitle from "../../../hooks/useTitle";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Spinner from "../../shared/Spinner";
import statusBadge from "../../../utils/statusBadge";
import { formatDateTime } from "../../../utils/formatDate";

const ManageRequests = () => {
  useTitle("Manage Requests");
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["allRequests"],
    queryFn: async () => {
      const res = await axiosSecure.get("/requests");
      return res.data;
    },
  });

  const requestMutation = useMutation({
    mutationFn: ({ id, action }) =>
      axiosSecure.patch(`/requests/${id}`, { action }),
    onSuccess: (res, variables) => {
      if (variables.action === "approve") {
        toast.success("Request approved successfully");
      } else if (variables.action === "reject") {
        toast.success("Request has been rejected");
      } else {
        toast.success("Request moved back to pending");
      }
      queryClient.invalidateQueries({ queryKey: ["allRequests"] });
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || "Could not update the request"),
  });

  const handleAction = async (request, action) => {
    const isApprove = action === "approve";
    const isReopen = action === "reopen";
    const isAdminRequest = request.requestType === "admin";

    let title = `Reject ${request.userName}'s request?`;
    let confirmText = "Yes, reject";
    let color = "#c4372c";
    let text = "";

    if (isApprove) {
      title = `Approve ${request.userName} as ${request.requestType}?`;
      confirmText = "Yes, approve";
      color = "#3f8f5a";
      if (isAdminRequest) text = "This will give them full admin access to the platform.";
    }

    if (isReopen) {
      title = `Reopen ${request.userName}'s request?`;
      confirmText = "Yes, reopen";
      color = "#c8461a";
      text = "It will go back to pending so you can decide again.";
    }

    const result = await Swal.fire({
      icon: isApprove && isAdminRequest ? "warning" : "question",
      title,
      text,
      showCancelButton: true,
      confirmButtonText: confirmText,
      confirmButtonColor: color,
    });

    if (result.isConfirmed) {
      requestMutation.mutate({ id: request._id, action });
    }
  };

  const keyword = search.trim().toLowerCase();

  const filteredRequests = requests.filter((request) => {
    const matchesStatus =
      statusFilter === "all" || request.requestStatus === statusFilter;
    const text = [request.userName, request.userEmail, request._id]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return matchesStatus && text.includes(keyword);
  });

  if (isLoading) return <Spinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold">Manage Requests</h1>
      <p className="mt-1 text-sm text-base-content/70">
        To change someone&apos;s role after approval, use Manage Users.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <label className="input w-full sm:max-w-sm">
          <MdSearch size={20} className="text-base-content/50" />
          <input
            type="search"
            className="grow"
            placeholder="Search by name, email or ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="select w-full sm:w-44"
        >
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="mt-4 overflow-x-auto rounded-box border border-base-300 bg-base-100">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Request Type</th>
              <th>Status</th>
              <th>Request Time</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.length === 0 && (
              <tr>
                <td colSpan={6} className="py-10 text-center text-base-content/60">
                  No requests found.
                </td>
              </tr>
            )}

            {filteredRequests.map((request) => {
              const isPending = request.requestStatus === "pending";
              const isRejected = request.requestStatus === "rejected";

              return (
                <tr key={request._id}>
                  <td className="font-medium">{request.userName}</td>
                  <td>{request.userEmail}</td>
                  <td className="capitalize">{request.requestType}</td>
                  <td>
                    <span
                      className={`badge capitalize ${statusBadge[request.requestStatus]}`}
                    >
                      {request.requestStatus}
                    </span>
                  </td>
                  <td>{formatDateTime(request.requestTime)}</td>
                  <td>
                    {isRejected ? (
                      <button
                        onClick={() => handleAction(request, "reopen")}
                        disabled={requestMutation.isPending}
                        className="btn btn-outline btn-sm"
                      >
                        Reopen
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAction(request, "approve")}
                          disabled={!isPending || requestMutation.isPending}
                          className="btn btn-outline btn-success btn-sm"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleAction(request, "reject")}
                          disabled={!isPending || requestMutation.isPending}
                          className="btn btn-outline btn-error btn-sm"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageRequests;