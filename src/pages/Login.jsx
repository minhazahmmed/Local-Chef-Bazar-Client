import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { LuLogIn, LuMail, LuLock } from "react-icons/lu";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import useTitle from "../hooks/useTitle";
import SocialLogin from "../components/shared/SocialLogin";

const labelClass = "mb-1.5 block text-[15px] font-semibold text-base-content";
const fieldClass =
  "input h-12 w-full gap-2 border-base-content/30 text-base focus-within:border-primary";
const errorClass = "mt-1.5 text-sm font-medium text-error";

const Login = () => {
  useTitle("Login");
  const { loginUser, user } = useAuth();
  const location = useLocation();
  const from = location.state || "/";
  const [showPassword, setShowPassword] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const loginMutation = useMutation({
    mutationFn: ({ email, password }) => loginUser(email, password),
    onSuccess: () => {
      toast.success("Welcome back!");
      setLoggedIn(true);
    },
    onError: () => toast.error("Wrong email or password"),
  });

  const onSubmit = (data) => loginMutation.mutate(data);

  if (loggedIn && user) {
    return <Navigate to={from} replace />;
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-base-200 px-4 py-10 sm:py-14">
      <div className="w-full max-w-md rounded-box border border-base-content/20 bg-base-100 p-5 shadow-sm sm:p-8">
        <div className="text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-content">
            <LuLogIn size={26} />
          </span>
          <h1 className="mt-4 text-3xl font-bold text-base-content">Login</h1>
          <p className="mt-2 text-base text-base-content/80">
            Welcome back. Your next home-cooked meal is waiting.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-5">
          <div>
            <label className={labelClass}>Email</label>
            <label className={fieldClass}>
              <LuMail size={20} className="shrink-0 text-base-content/70" />
              <input
                type="email"
                placeholder="you@example.com"
                className="grow placeholder:text-base-content/50"
                {...register("email", { required: "Email is required" })}
              />
            </label>
            {errors.email && <p className={errorClass}>{errors.email.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Password</label>
            <label className={fieldClass}>
              <LuLock size={20} className="shrink-0 text-base-content/70" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Your password"
                className="grow placeholder:text-base-content/50"
                {...register("password", { required: "Password is required" })}
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

          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-[15px] font-semibold text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="btn btn-primary h-12 w-full text-base"
          >
            {loginMutation.isPending ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="divider my-6 text-sm font-medium text-base-content/70">OR</div>

        <SocialLogin />

        <p className="mt-6 text-center text-[15px] text-base-content/80">
          New here?{" "}
          <Link
            to="/register"
            state={location.state}
            className="font-semibold text-primary hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;