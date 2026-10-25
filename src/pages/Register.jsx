import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import useTitle from "../hooks/useTitle";
import axiosPublic from "../api/axiosPublic";
import uploadImage from "../utils/uploadImage";
import SocialLogin from "../components/shared/SocialLogin";

const Register = () => {
  useTitle("Register");
  const { registerUser, updateUserProfile } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const registerMutation = useMutation({
    mutationFn: async (data) => {
      const imageUrl = await uploadImage(data.image[0]);
      await registerUser(data.email, data.password);
      await updateUserProfile(data.name, imageUrl);
      await axiosPublic.post("/users", {
        name: data.name,
        email: data.email,
        image: imageUrl,
        address: data.address,
      });
    },
    onSuccess: () => {
      toast.success("Account created successfully");
      navigate("/");
    },
    onError: (error) => toast.error(error.message),
  });

  const onSubmit = (data) => registerMutation.mutate(data);

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-base-200 px-4 py-12">
      <div className="w-full max-w-lg rounded-box border border-base-300 bg-base-100 p-6 sm:p-8">
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="mt-1 text-sm text-base-content/70">
          Join to order from local chefs, or become one yourself.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Name</label>
            <input
              type="text"
              placeholder="Your full name"
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
              type="email"
              placeholder="you@example.com"
              className="input w-full"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-error">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Profile Image</label>
            <input
              type="file"
              accept="image/*"
              className="file-input w-full"
              {...register("image", { required: "Profile image is required" })}
            />
            {errors.image && (
              <p className="mt-1 text-sm text-error">{errors.image.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Address</label>
            <input
              type="text"
              placeholder="House, road, area, city"
              className="input w-full"
              {...register("address", { required: "Address is required" })}
            />
            {errors.address && (
              <p className="mt-1 text-sm text-error">{errors.address.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <input
              type="password"
              placeholder="At least 6 characters"
              className="input w-full"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Password must be at least 6 characters" },
              })}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-error">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Confirm Password</label>
            <input
              type="password"
              placeholder="Type the password again"
              className="input w-full"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              })}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-error">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="btn btn-primary w-full"
          >
            {registerMutation.isPending ? "Creating account..." : "Register"}
          </button>
        </form>

        <div className="divider text-sm">OR</div>

        <SocialLogin />

        <p className="mt-6 text-center text-sm text-base-content/70">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;