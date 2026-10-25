import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import useTitle from "../../../hooks/useTitle";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Spinner from "../../shared/Spinner";
import statusBadge from "../../../utils/statusBadge";

const ManageUsers = () => {
  useTitle("Manage Users");
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data;
    },
  });

  const fraudMutation = useMutation({
    mutationFn: (id) => axiosSecure.patch(`/users/${id}/fraud`),
    onSuccess: () => {
      toast.success("User has been marked as fraud");
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
    },
    onError: () => toast.error("Could not update the user"),
  });

  const handleFraud = async (user) => {
    const result = await Swal.fire({
      icon: "warning",
      title: `Mark ${user.name} as fraud?`,
      text: "They will no longer be able to order or create meals.",
      showCancelButton: true,
      confirmButtonText: "Yes, mark as fraud",
      confirmButtonColor: "#c4372c",
    });

    if (result.isConfirmed) fraudMutation.mutate(user._id);
  };

  if (isLoading) return <Spinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold">Manage Users</h1>

      <div className="mt-6 overflow-x-auto rounded-box border border-base-300 bg-base-100">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td className="font-medium">{user.name}</td>
                <td>{user.email}</td>
                <td className="capitalize">{user.role}</td>
                <td>
                  <span className={`badge capitalize ${statusBadge[user.status]}`}>
                    {user.status}
                  </span>
                </td>
                <td>
                  {user.role !== "admin" && user.status !== "fraud" && (
                    <button
                      onClick={() => handleFraud(user)}
                      className="btn btn-outline btn-error btn-sm"
                    >
                      Make Fraud
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;