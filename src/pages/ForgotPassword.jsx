import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { LuKeyRound, LuMail, LuArrowLeft } from "react-icons/lu";
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
    <div className="flex min-h-[80vh] items-center justify-center bg-base-200 px-4 py-10 sm:py-14">
      <div className="w-full max-w-md rounded-box border border-base-content/20 bg-base-100 p-5 shadow-sm sm:p-8">
        <div className="text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-content">
            <LuKeyRound size={26} />
          </span>
          <h1 className="mt-4 text-3xl font-bold text-base-content">Forgot password?</h1>
          <p className="mt-2 text-base text-base-content/80">
            Enter your email and we will send you a link to set a new password.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-5">
          <div>
            <label className="mb-1.5 block text-[15px] font-semibold text-base-content">
              Email
            </label>
            <label className="input h-12 w-full gap-2 border-base-content/30 text-base focus-within:border-primary">
              <LuMail size={20} className="shrink-0 text-base-content/70" />
              <input
                type="email"
                placeholder="you@example.com"
                className="grow placeholder:text-base-content/50"
                {...register("email", { required: "Email is required" })}
              />
            </label>
            {errors.email && (
              <p className="mt-1.5 text-sm font-medium text-error">{errors.email.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={resetMutation.isPending}
            className="btn btn-primary h-12 w-full text-base"
          >
            {resetMutation.isPending ? "Sending..." : "Send reset link"}
          </button>
        </form>

        <p className="mt-6 text-center text-[15px] text-base-content/80">
          Remembered it?{" "}
          <Link
            to="/login"
            className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
          >
            <LuArrowLeft size={16} />
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;