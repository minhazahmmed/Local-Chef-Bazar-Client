import { useState } from "react";
import { Navigate, useLocation } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import axiosPublic from "../../api/axiosPublic";

const silentErrors = ["auth/popup-closed-by-user", "auth/cancelled-popup-request"];

const errorMessages = {
  "auth/popup-blocked": "Your browser blocked the Google window. Please allow pop-ups for this site and try again.",
  "auth/network-request-failed": "Network problem. Please check your connection and try again.",
  "auth/unauthorized-domain": "This website is not authorized for Google sign in yet.",
};

const SocialLogin = () => {
  const { googleLogin, user } = useAuth();
  const location = useLocation();
  const from = location.state || "/";
  const [signingIn, setSigningIn] = useState(false);
  const [done, setDone] = useState(false);

  const saveUserMutation = useMutation({
    mutationFn: (firebaseUser) =>
      axiosPublic.post("/users", {
        name: firebaseUser.displayName,
        email: firebaseUser.email,
        image: firebaseUser.photoURL,
        address: "",
      }),
    onSuccess: () => {
      toast.success("Logged in successfully");
      setDone(true);
    },
    onError: (error) =>
      toast.error(
        error.response?.data?.message || "Could not finish sign in. Please try again."
      ),
  });

  const handleGoogleLogin = () => {
    if (signingIn) return;

    setSigningIn(true);

    googleLogin()
      .then((result) => saveUserMutation.mutate(result.user))
      .catch((error) => {
        if (silentErrors.includes(error.code)) return;
        toast.error(errorMessages[error.code] || "Google sign in failed. Please try again.");
      })
      .finally(() => setSigningIn(false));
  };

  if (done && user) {
    return <Navigate to={from} replace />;
  }

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      disabled={signingIn || saveUserMutation.isPending}
      className="btn btn-outline h-12 w-full gap-3 border-base-content/30 text-base font-semibold"
    >
      <FcGoogle size={24} />
      Continue with Google
    </button>
  );
};

export default SocialLogin;