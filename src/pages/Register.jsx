import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { LuUserPlus, LuUser, LuMail, LuMapPin, LuLock } from "react-icons/lu";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import useTitle from "../hooks/useTitle";
import axiosPublic from "../api/axiosPublic";
import uploadImage from "../utils/uploadImage";
import SocialLogin from "../components/shared/SocialLogin";

const labelClass = "mb-1.5 block text-[15px] font-semibold text-base-content";
const fieldClass =
  "input h-12 w-full gap-2 border-base-content/30 text-base focus-within:border-primary";
const errorClass = "mt-1.5 text-sm font-medium text-error";
const iconClass = "shrink-0 text-base-content/70";
const inputClass = "grow placeholder:text-base-content/50";

const Register = () => {
  useTitle("Register");
  const { registerUser, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state || "/";
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
      navigate(from, { replace: true });
    },
    onError: (error) => toast.error(error.message),
  });

  const onSubmit = (data) => registerMutation.mutate(data);

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-base-200 px-4 py-10 sm:py-14">
      <div className="w-full max-w-xl rounded-box border border-base-content/20 bg-base-100 p-5 shadow-sm sm:p-8">
        <div className="text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-content">
            <LuUserPlus size={26} />
          </span>
          <h1 className="mt-4 text-3xl font-bold text-base-content">Create your account</h1>
          <p className="mt-2 text-base text-base-content/80">
            Join to order from local chefs, or become one yourself.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-5">
          <div>
            <label className={labelClass}>Name</label>
            <label className={fieldClass}>
              <LuUser size={20} className={iconClass} />
              <input
                type="text"
                placeholder="Your full name"
                className={inputClass}
                {...register("name", { required: "Name is required" })}
              />
            </label>
            {errors.name && <p className={errorClass}>{errors.name.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Email</label>
            <label className={fieldClass}>
              <LuMail size={20} className={iconClass} />
              <input
                type="email"
                placeholder="you@example.com"
                className={inputClass}
                {...register("email", { required: "Email is required" })}
              />
            </label>
            {errors.email && <p className={errorClass}>{errors.email.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Profile Image</label>
            <input
              type="file"
              accept="image/*"
              className="file-input h-12 w-full border-base-content/30 text-base"
              {...register("image", { required: "Profile image is required" })}
            />
            {errors.image && <p className={errorClass}>{errors.image.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Address</label>
            <label className={fieldClass}>
              <LuMapPin size={20} className={iconClass} />
              <input
                type="text"
                placeholder="House, road, area, city"
                className={inputClass}
                {...register("address", { required: "Address is required" })}
              />
            </label>
            {errors.address && <p className={errorClass}>{errors.address.message}</p>}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Password</label>
              <label className={fieldClass}>
                <LuLock size={20} className={iconClass} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 6 characters"
                  className={`${inputClass} min-w-0`}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="shrink-0 text-base-content/70 hover:text-primary"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </label>
              {errors.password && <p className={errorClass}>{errors.password.message}</p>}
            </div>

            <div>
              <label className={labelClass}>Confirm Password</label>
              <label className={fieldClass}>
                <LuLock size={20} className={iconClass} />
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Type it again"
                  className={`${inputClass} min-w-0`}
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === watch("password") || "Passwords do not match",
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="shrink-0 text-base-content/70 hover:text-primary"
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </label>
              {errors.confirmPassword && (
                <p className={errorClass}>{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="btn btn-primary h-12 w-full text-base"
          >
            {registerMutation.isPending ? "Creating account..." : "Register"}
          </button>
        </form>

        <div className="divider my-6 text-sm font-medium text-base-content/70">OR</div>

        <SocialLogin />

        <p className="mt-6 text-center text-[15px] text-base-content/80">
          Already have an account?{" "}
          <Link
            to="/login"
            state={location.state}
            className="font-semibold text-primary hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;