import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import useTitle from "../hooks/useTitle";

const ForgotPassword = () => {
  useTitle("Forgot Password");
  const { resetPassword } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const resetMutation = useMutation({
    mutationFn: (email) => resetPassword(email),
    onSuccess: () => {
      toast.success("Reset link sent. Please check your email.");
      reset();
    },
    onError: (error) => toast.error(error.message),
  });

  const onSubmit = (data) => resetMutation.mutate(data.email);

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-base-200 px-4 py-12">
      <div className="w-full max-w-md rounded-box border border-base-300 bg-base-100 p-6 sm:p-8">
        <h1 className="text-2xl font-bold">Forgot password?</h1>
        <p className="mt-1 text-sm text-base-content/70">
          Enter your email and we will send you a link to set a new password.
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

          <button
            type="submit"
            disabled={resetMutation.isPending}
            className="btn btn-primary w-full"
          >
            {resetMutation.isPending ? "Sending..." : "Send reset link"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-base-content/70">
          Remembered it?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;