import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { MdChevronLeft, MdChevronRight, MdSearch } from "react-icons/md";
import useTitle from "../../../hooks/useTitle";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Spinner from "../../shared/Spinner";
import statusBadge from "../../../utils/statusBadge";
import { formatDateTime } from "../../../utils/formatDate";

const pageSize = 6;

const getPageNumbers = (current, total) => {
  if (total <= 5) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const pages = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) pages.push("start-gap");
  for (let page = start; page <= end; page += 1) pages.push(page);
  if (end < total - 1) pages.push("end-gap");
  pages.push(total);

  return pages;
};

const Pagination = ({ page, totalPages, onChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 sm:justify-end">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
        className="btn btn-outline h-10 min-h-10 gap-1 px-3 text-[15px]"
      >
        <MdChevronLeft size={20} />
        Prev
      </button>

      <span className="px-2 text-base font-medium text-base-content sm:hidden">
        Page {page} of {totalPages}
      </span>

      <div className="hidden items-center gap-2 sm:flex">
        {getPageNumbers(page, totalPages).map((item) =>
          typeof item === "string" ? (
            <span key={item} className="px-1 text-base text-base-content/85">
              ...
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => onChange(item)}
              aria-current={item === page ? "page" : undefined}
              className={`btn h-10 min-h-10 w-10 px-0 text-[15px] ${
                item === page ? "btn-primary" : "btn-outline"
              }`}
            >
              {item}
            </button>
          )
        )}
      </div>

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Next page"
        className="btn btn-outline h-10 min-h-10 gap-1 px-3 text-[15px]"
      >
        Next
        <MdChevronRight size={20} />
      </button>
    </div>
  );
};

const ManageRequests = () => {
  useTitle("Manage Requests");
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

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
      toast.error(
        error.response?.data?.message || "Could not update the request"
      ),
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
      if (isAdminRequest)
        text = "This will give them full admin access to the platform.";
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

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleStatusFilter = (event) => {
    setStatusFilter(event.target.value);
    setPage(1);
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

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRequests.length / pageSize)
  );
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const visibleRequests = filteredRequests.slice(
    startIndex,
    startIndex + pageSize
  );

  if (isLoading) return <Spinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-base-content sm:text-3xl">
        Manage Requests
      </h1>
      <p className="mt-1 text-base text-base-content/85">
        To change someone&apos;s role after approval, use Manage Users.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <label className="input w-full text-base sm:max-w-md">
          <MdSearch size={22} className="text-base-content/70" />
          <input
            type="search"
            className="grow text-base placeholder:text-base-content/70"
            placeholder="Search by name, email or ID"
            value={search}
            onChange={handleSearch}
          />
        </label>

        <select
          value={statusFilter}
          onChange={handleStatusFilter}
          className="select w-full text-base sm:w-52"
        >
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {filteredRequests.length === 0 && (
        <p className="mt-8 text-center text-base text-base-content/85">
          No requests found.
        </p>
      )}

      {filteredRequests.length > 0 && (
        <>
          <div className="mt-4 hidden overflow-x-auto rounded-box border border-base-300 bg-base-100 lg:block">
            <table className="table text-base">
              <thead>
                <tr className="text-base text-base-content">
                  <th>Name</th>
                  <th>Email</th>
                  <th>Request Type</th>
                  <th>Status</th>
                  <th>Request Time</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {visibleRequests.map((request) => {
                  const isPending = request.requestStatus === "pending";
                  const isRejected = request.requestStatus === "rejected";

                  return (
                    <tr key={request._id}>
                      <td className="font-medium">{request.userName}</td>
                      <td>{request.userEmail}</td>
                      <td className="capitalize">{request.requestType}</td>
                      <td>
                        <span
                          className={`badge badge-lg capitalize ${statusBadge[request.requestStatus]}`}
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
                            className="btn btn-outline text-[15px]"
                          >
                            Reopen
                          </button>
                        ) : (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleAction(request, "approve")}
                              disabled={!isPending || requestMutation.isPending}
                              className="btn btn-outline btn-success text-[15px]"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleAction(request, "reject")}
                              disabled={!isPending || requestMutation.isPending}
                              className="btn btn-outline btn-error text-[15px]"
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

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:hidden">
            {visibleRequests.map((request) => {
              const isPending = request.requestStatus === "pending";
              const isRejected = request.requestStatus === "rejected";

              return (
                <div
                  key={request._id}
                  className="flex flex-col rounded-box border border-base-300 bg-base-100 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="min-w-0 break-words text-lg font-semibold text-base-content">
                      {request.userName}
                    </h3>
                    <span
                      className={`badge h-7 shrink-0 text-sm font-medium capitalize ${statusBadge[request.requestStatus]}`}
                    >
                      {request.requestStatus}
                    </span>
                  </div>

                  <dl className="mt-3 space-y-3 border-t border-base-300 pt-3 text-base">
                    <div>
                      <dt className="text-[15px] text-base-content/85">
                        Email
                      </dt>
                      <dd className="break-words font-medium text-base-content [overflow-wrap:anywhere]">
                        {request.userEmail}
                      </dd>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <dt className="shrink-0 text-base-content/85">
                        Request Type
                      </dt>
                      <dd className="font-medium capitalize text-base-content">
                        {request.requestType}
                      </dd>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <dt className="shrink-0 text-base-content/85">
                        Request Time
                      </dt>
                      <dd className="text-right font-medium text-base-content">
                        {formatDateTime(request.requestTime)}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-auto pt-4">
                    {isRejected ? (
                      <button
                        onClick={() => handleAction(request, "reopen")}
                        disabled={requestMutation.isPending}
                        className="btn btn-outline h-11 min-h-11 w-full text-base"
                      >
                        Reopen
                      </button>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => handleAction(request, "approve")}
                          disabled={!isPending || requestMutation.isPending}
                          className="btn btn-outline btn-success h-11 min-h-11 text-base"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleAction(request, "reject")}
                          disabled={!isPending || requestMutation.isPending}
                          className="btn btn-outline btn-error h-11 min-h-11 text-base"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-center text-base text-base-content/85 sm:text-left">
              Showing {startIndex + 1}-{startIndex + visibleRequests.length} of{" "}
              {filteredRequests.length} requests
            </p>
            <Pagination
              page={currentPage}
              totalPages={totalPages}
              onChange={setPage}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ManageRequests;