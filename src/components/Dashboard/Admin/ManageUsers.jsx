import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { MdChevronLeft, MdChevronRight, MdSearch } from "react-icons/md";
import useAuth from "../../../hooks/useAuth";
import useTitle from "../../../hooks/useTitle";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Spinner from "../../shared/Spinner";

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

const ManageUsers = () => {
  useTitle("Manage Users");
  const { user: currentUser } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(1);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data;
    },
  });

  const onError = (error) =>
    toast.error(error.response?.data?.message || "Could not update the user");

  const roleMutation = useMutation({
    mutationFn: ({ id, role }) =>
      axiosSecure.patch(`/users/${id}/role`, { role }),
    onSuccess: () => {
      toast.success("Role updated successfully");
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
      queryClient.invalidateQueries({ queryKey: ["allRequests"] });
    },
    onError,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) =>
      axiosSecure.patch(`/users/${id}/status`, { status }),
    onSuccess: (res, variables) => {
      toast.success(
        variables.status === "fraud"
          ? "User has been marked as fraud"
          : "User has been restored to active"
      );
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
    },
    onError,
  });

  const handleRoleChange = async (user, role) => {
    let text = "";
    if (role === "admin")
      text = "This gives them full admin access to the platform.";
    if (user.role === "chef") {
      text = "Their meals will be hidden until they become a chef again.";
    }

    const result = await Swal.fire({
      icon: role === "admin" ? "warning" : "question",
      title: `Change ${user.name}'s role to ${role}?`,
      text,
      showCancelButton: true,
      confirmButtonText: "Yes, change role",
      confirmButtonColor: "#c8461a",
    });

    if (result.isConfirmed) roleMutation.mutate({ id: user._id, role });
  };

  const handleStatusChange = async (user, status) => {
    const isFraud = status === "fraud";

    const result = await Swal.fire({
      icon: isFraud ? "warning" : "question",
      title: isFraud
        ? `Mark ${user.name} as fraud?`
        : `Restore ${user.name} to active?`,
      text: isFraud
        ? "They will no longer be able to order or create meals."
        : "They will be able to order or create meals again.",
      showCancelButton: true,
      confirmButtonText: isFraud ? "Yes, mark as fraud" : "Yes, restore",
      confirmButtonColor: isFraud ? "#c4372c" : "#3f8f5a",
    });

    if (result.isConfirmed) statusMutation.mutate({ id: user._id, status });
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleRoleFilter = (event) => {
    setRoleFilter(event.target.value);
    setPage(1);
  };

  const keyword = search.trim().toLowerCase();

  const filteredUsers = users.filter((user) => {
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const text = [user.name, user.email, user.chefId, user._id]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return matchesRole && text.includes(keyword);
  });

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const visibleUsers = filteredUsers.slice(startIndex, startIndex + pageSize);

  if (isLoading) return <Spinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-base-content sm:text-3xl">
        Manage Users
      </h1>
      <p className="mt-1 text-base text-base-content/85">
        Change a role or status from the dropdowns. You can undo any change
        later.
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
          value={roleFilter}
          onChange={handleRoleFilter}
          className="select w-full text-base sm:w-52"
        >
          <option value="all">All roles</option>
          <option value="user">User</option>
          <option value="chef">Chef</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {filteredUsers.length === 0 && (
        <p className="mt-8 text-center text-base text-base-content/85">
          No users found.
        </p>
      )}

      {filteredUsers.length > 0 && (
        <>
          <div className="mt-4 hidden overflow-x-auto rounded-box border border-base-300 bg-base-100 lg:block">
            <table className="table text-base">
              <thead>
                <tr className="text-base text-base-content">
                  <th>Name</th>
                  <th>Email</th>
                  <th>ID</th>
                  <th>Role</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {visibleUsers.map((user) => {
                  const isSelf = user.email === currentUser.email;
                  const isAdmin = user.role === "admin";

                  return (
                    <tr key={user._id}>
                      <td className="font-medium">{user.name}</td>
                      <td>{user.email}</td>
                      <td
                        title={user._id}
                        className="text-base text-base-content/85"
                      >
                        {user.chefId || `...${user._id.slice(-6)}`}
                      </td>
                      <td>
                        <select
                          value={user.role}
                          disabled={isSelf || roleMutation.isPending}
                          onChange={(e) =>
                            handleRoleChange(user, e.target.value)
                          }
                          className="select w-32 text-base"
                        >
                          <option value="user">User</option>
                          <option value="chef">Chef</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td>
                        <select
                          value={user.status}
                          disabled={
                            isSelf || isAdmin || statusMutation.isPending
                          }
                          onChange={(e) =>
                            handleStatusChange(user, e.target.value)
                          }
                          className={`select w-32 text-base ${
                            user.status === "fraud" ? "text-error" : ""
                          }`}
                        >
                          <option value="active">Active</option>
                          <option value="fraud">Fraud</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:hidden">
            {visibleUsers.map((user) => {
              const isSelf = user.email === currentUser.email;
              const isAdmin = user.role === "admin";

              return (
                <div
                  key={user._id}
                  className="flex flex-col rounded-box border border-base-300 bg-base-100 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="min-w-0 break-words text-lg font-semibold text-base-content">
                      {user.name}
                    </h3>
                    {isSelf && (
                      <span className="badge badge-primary badge-outline h-7 shrink-0 text-sm">
                        You
                      </span>
                    )}
                  </div>

                  <dl className="mt-3 space-y-3 border-t border-base-300 pt-3 text-base">
                    <div>
                      <dt className="text-[15px] text-base-content/85">
                        Email
                      </dt>
                      <dd className="break-words font-medium text-base-content [overflow-wrap:anywhere]">
                        {user.email}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[15px] text-base-content/85">ID</dt>
                      <dd className="break-all font-medium text-base-content">
                        {user.chefId || user._id}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-[15px] font-semibold text-base-content">
                        Role
                      </label>
                      <select
                        value={user.role}
                        disabled={isSelf || roleMutation.isPending}
                        onChange={(e) => handleRoleChange(user, e.target.value)}
                        className="select h-11 w-full text-base"
                      >
                        <option value="user">User</option>
                        <option value="chef">Chef</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-1 block text-[15px] font-semibold text-base-content">
                        Status
                      </label>
                      <select
                        value={user.status}
                        disabled={isSelf || isAdmin || statusMutation.isPending}
                        onChange={(e) =>
                          handleStatusChange(user, e.target.value)
                        }
                        className={`select h-11 w-full text-base ${
                          user.status === "fraud" ? "text-error" : ""
                        }`}
                      >
                        <option value="active">Active</option>
                        <option value="fraud">Fraud</option>
                      </select>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-center text-base text-base-content/85 sm:text-left">
              Showing {startIndex + 1}-{startIndex + visibleUsers.length} of{" "}
              {filteredUsers.length} users
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

export default ManageUsers;