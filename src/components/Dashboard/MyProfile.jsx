import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";
import useUserInfo from "../../hooks/useUserInfo";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import uploadImage from "../../utils/uploadImage";
import Spinner from "../shared/Spinner";
import statusBadge from "../../utils/statusBadge";

const EditProfileModal = ({ userInfo, onClose }) => {
  const { updateUserProfile } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: userInfo.name,
      address: userInfo.address || "",
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      const image = data.image?.[0]
        ? await uploadImage(data.image[0])
        : userInfo.image;

      await axiosSecure.patch("/users/profile", {
        name: data.name,
        address: data.address,
        image,
      });

      await updateUserProfile(data.name, image).catch(() => null);
    },
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["userInfo"] });
      queryClient.invalidateQueries({ queryKey: ["myReviews"] });
      queryClient.invalidateQueries({ queryKey: ["myMeals"] });
      onClose();
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || "Could not update your profile"),
  });

  const onSubmit = (data) => updateMutation.mutate(data);

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="text-lg font-semibold">Edit profile</h3>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Name</label>
            <input
              type="text"
              className="input w-full"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-error">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              readOnly
              value={userInfo.email}
              className="input w-full bg-base-200"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Address</label>
            <input
              type="text"
              className="input w-full"
              {...register("address", { required: "Address is required" })}
            />
            {errors.address && (
              <p className="mt-1 text-sm text-error">{errors.address.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              New Profile Image (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              className="file-input w-full"
              {...register("image")}
            />
          </div>

          <div className="modal-action">
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="btn btn-primary"
            >
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const MyProfile = () => {
  useTitle("My Profile");
  const { user } = useAuth();
  const { userInfo, isLoading } = useUserInfo();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);

  const { data: requests = [] } = useQuery({
    queryKey: ["myRequests", userInfo.email],
    enabled: !!userInfo.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/requests/user/${userInfo.email}`);
      return res.data;
    },
  });

  const pendingRequest = requests.find((item) => item.requestStatus === "pending");

  const requestMutation = useMutation({
    mutationFn: (requestType) => axiosSecure.post("/requests", { requestType }),
    onSuccess: () => {
      toast.success("Your request has been sent to the admin");
      queryClient.invalidateQueries({ queryKey: ["myRequests"] });
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || "Could not send request"),
  });

  const handleRequest = async (requestType) => {
    const result = await Swal.fire({
      icon: "question",
      title: `Send ${requestType} request?`,
      text: "The admin will review your request and approve or reject it.",
      showCancelButton: true,
      confirmButtonText: "Yes, send request",
      confirmButtonColor: "#c8461a",
    });

    if (result.isConfirmed) requestMutation.mutate(requestType);
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <button
          onClick={() => setEditing(true)}
          className="btn btn-outline btn-primary btn-sm"
        >
          Edit Profile
        </button>
      </div>

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
          <div className="mt-6 border-t border-base-300 pt-6">
            {pendingRequest && (
              <p className="mb-4 rounded-lg bg-warning/15 px-4 py-3 text-sm">
                Your <span className="font-semibold">{pendingRequest.requestType}</span>{" "}
                request is waiting for the admin&apos;s decision.
              </p>
            )}

            <div className="flex flex-wrap gap-3">
              {userInfo.role !== "chef" && (
                <button
                  onClick={() => handleRequest("chef")}
                  disabled={requestMutation.isPending || !!pendingRequest}
                  className="btn btn-primary"
                >
                  Be a Chef
                </button>
              )}
              <button
                onClick={() => handleRequest("admin")}
                disabled={requestMutation.isPending || !!pendingRequest}
                className="btn btn-outline btn-primary"
              >
                Be an Admin
              </button>
            </div>
          </div>
        )}
      </div>

      {editing && (
        <EditProfileModal userInfo={userInfo} onClose={() => setEditing(false)} />
      )}
    </div>
  );
};

export default MyProfile;