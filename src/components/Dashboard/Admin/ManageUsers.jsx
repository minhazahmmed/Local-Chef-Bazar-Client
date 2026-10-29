import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { MdSearch } from "react-icons/md";
import useAuth from "../../../hooks/useAuth";
import useTitle from "../../../hooks/useTitle";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Spinner from "../../shared/Spinner";

const ManageUsers = () => {
  useTitle("Manage Users");
  const { user: currentUser } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

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
    mutationFn: ({ id, role }) => axiosSecure.patch(`/users/${id}/role`, { role }),
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
    if (role === "admin") text = "This gives them full admin access to the platform.";
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

  const keyword = search.trim().toLowerCase();

  const filteredUsers = users.filter((user) => {
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const text = [user.name, user.email, user.chefId, user._id]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return matchesRole && text.includes(keyword);
  });

  if (isLoading) return <Spinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold">Manage Users</h1>
      <p className="mt-1 text-sm text-base-content/70">
        Change a role or status from the dropdowns. You can undo any change later.
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
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="select w-full sm:w-44"
        >
          <option value="all">All roles</option>
          <option value="user">User</option>
          <option value="chef">Chef</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="mt-4 overflow-x-auto rounded-box border border-base-300 bg-base-100">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>ID</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={5} className="py-10 text-center text-base-content/60">
                  No users found.
                </td>
              </tr>
            )}

            {filteredUsers.map((user) => {
              const isSelf = user.email === currentUser.email;
              const isAdmin = user.role === "admin";

              return (
                <tr key={user._id}>
                  <td className="font-medium">{user.name}</td>
                  <td>{user.email}</td>
                  <td className="text-sm text-base-content/70">
                    {user.chefId || `...${user._id.slice(-6)}`}
                  </td>
                  <td>
                    <select
                      value={user.role}
                      disabled={isSelf || roleMutation.isPending}
                      onChange={(e) => handleRoleChange(user, e.target.value)}
                      className="select select-sm w-28"
                    >
                      <option value="user">User</option>
                      <option value="chef">Chef</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td>
                    <select
                      value={user.status}
                      disabled={isSelf || isAdmin || statusMutation.isPending}
                      onChange={(e) => handleStatusChange(user, e.target.value)}
                      className={`select select-sm w-28 ${
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
    </div>
  );
};

export default ManageUsers;