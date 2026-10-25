import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";
import useUserInfo from "../../hooks/useUserInfo";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Spinner from "../shared/Spinner";
import statusBadge from "../../utils/statusBadge";

const MyProfile = () => {
  useTitle("My Profile");
  const { user } = useAuth();
  const { userInfo, isLoading } = useUserInfo();
  const axiosSecure = useAxiosSecure();

  const requestMutation = useMutation({
    mutationFn: (requestType) =>
      axiosSecure.post("/requests", {
        userName: userInfo.name,
        userEmail: userInfo.email,
        requestType,
        requestStatus: "pending",
        requestTime: new Date().toISOString(),
      }),
    onSuccess: () => toast.success("Your request has been sent to the admin"),
    onError: (error) =>
      toast.error(error.response?.data?.message || "Could not send request"),
  });

  if (isLoading) return <Spinner />;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold">My Profile</h1>

      <div className="mt-6 rounded-box border border-base-300 bg-base-100 p-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <div className="avatar">
            <div className="w-24 rounded-full">
              <img src={userInfo.image || user.photoURL} alt={userInfo.name} />
            </div>
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-semibold">{userInfo.name}</h2>
            <p className="text-base-content/70">{userInfo.email}</p>
          </div>
        </div>

        <dl className="mt-6 grid gap-4 border-t border-base-300 pt-6 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-base-content/60">Address</dt>
            <dd className="font-medium">{userInfo.address || "Not added yet"}</dd>
          </div>
          <div>
            <dt className="text-base-content/60">Role</dt>
            <dd>
              <span className="badge badge-primary capitalize">{userInfo.role}</span>
            </dd>
          </div>
          <div>
            <dt className="text-base-content/60">Status</dt>
            <dd>
              <span className={`badge capitalize ${statusBadge[userInfo.status]}`}>
                {userInfo.status}
              </span>
            </dd>
          </div>
          {userInfo.role === "chef" && (
            <div>
              <dt className="text-base-content/60">Chef ID</dt>
              <dd className="font-medium">{userInfo.chefId}</dd>
            </div>
          )}
        </dl>

        {userInfo.role !== "admin" && (
          <div className="mt-6 flex flex-wrap gap-3 border-t border-base-300 pt-6">
            {userInfo.role !== "chef" && (
              <button
                onClick={() => requestMutation.mutate("chef")}
                disabled={requestMutation.isPending}
                className="btn btn-primary"
              >
                Be a Chef
              </button>
            )}
            <button
              onClick={() => requestMutation.mutate("admin")}
              disabled={requestMutation.isPending}
              className="btn btn-outline btn-primary"
            >
              Be an Admin
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProfile;