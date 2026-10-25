import { Link, useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import useTitle from "../hooks/useTitle";
import SocialLogin from "../components/shared/SocialLogin";

const Login = () => {
  useTitle("Login");
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const loginMutation = useMutation({
    mutationFn: ({ email, password }) => loginUser(email, password),
    onSuccess: () => {
      toast.success("Welcome back!");
      navigate(from, { replace: true });
    },
    onError: () => toast.error("Wrong email or password"),
  });

  const onSubmit = (data) => loginMutation.mutate(data);

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-base-200 px-4 py-12">
      <div className="w-full max-w-md rounded-box border border-base-300 bg-base-100 p-6 sm:p-8">
        <h1 className="text-2xl font-bold">Login</h1>
        <p className="mt-1 text-sm text-base-content/70">
          Welcome back. Your next home-cooked meal is waiting.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
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
            <label className="mb-1 block text-sm font-medium">Password</label>
            <input
              type="password"
              placeholder="Your password"
              className="input w-full"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-error">{errors.password.message}</p>
            )}
          </div>

          <div className="text-right">
            <Link to="/forgot-password" className="text-sm text-primary hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="btn btn-primary w-full"
          >
            {loginMutation.isPending ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="divider text-sm">OR</div>

        <SocialLogin />

        <p className="mt-6 text-center text-sm text-base-content/70">
          New here?{" "}
          <Link to="/register" className="font-medium text-primary hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;