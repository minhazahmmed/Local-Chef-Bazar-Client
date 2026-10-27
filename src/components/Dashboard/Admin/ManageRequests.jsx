import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import useTitle from "../../../hooks/useTitle";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Spinner from "../../shared/Spinner";
import statusBadge from "../../../utils/statusBadge";
import { formatDateTime } from "../../../utils/formatDate";

const ManageRequests = () => {
  useTitle("Manage Requests");
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

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
      } else {
        toast.success("Request has been rejected");
      }
      queryClient.invalidateQueries({ queryKey: ["allRequests"] });
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || "Could not update the request"),
  });

  const handleAction = async (request, action) => {
    const isApprove = action === "approve";
    const isAdminRequest = request.requestType === "admin";

    const result = await Swal.fire({
      icon: isApprove && isAdminRequest ? "warning" : "question",
      title: isApprove
        ? `Approve ${request.userName} as ${request.requestType}?`
        : `Reject ${request.userName}'s request?`,
      text:
        isApprove && isAdminRequest
          ? "This will give them full admin access to the platform."
          : "",
      showCancelButton: true,
      confirmButtonText: isApprove ? "Yes, approve" : "Yes, reject",
      confirmButtonColor: isApprove ? "#3f8f5a" : "#c4372c",
    });

    if (result.isConfirmed) {
      requestMutation.mutate({ id: request._id, action });
    }
  };

  if (isLoading) return <Spinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold">Manage Requests</h1>

      <div className="mt-6 overflow-x-auto rounded-box border border-base-300 bg-base-100">
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
            {requests.map((request) => {
              const done = request.requestStatus !== "pending";

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
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAction(request, "approve")}
                        disabled={done || requestMutation.isPending}
                        className="btn btn-outline btn-success btn-sm"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleAction(request, "reject")}
                        disabled={done || requestMutation.isPending}
                        className="btn btn-outline btn-error btn-sm"
                      >
                        Reject
                      </button>
                    </div>
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