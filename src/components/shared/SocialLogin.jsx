import { useLocation, useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import axiosPublic from "../../api/axiosPublic";

const SocialLogin = () => {
  const { googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state || "/";

  const googleMutation = useMutation({
    mutationFn: async () => {
      const result = await googleLogin();
      const { displayName, email, photoURL } = result.user;
      await axiosPublic.post("/users", {
        name: displayName,
        email,
        image: photoURL,
        address: "",
      });
    },
    onSuccess: () => {
      toast.success("Logged in successfully");
      navigate(from, { replace: true });
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <button
      type="button"
      onClick={() => googleMutation.mutate()}
      disabled={googleMutation.isPending}
      className="btn btn-outline w-full gap-2"
    >
      <FcGoogle size={20} />
      Continue with Google
    </button>
  );
};

export default SocialLogin;