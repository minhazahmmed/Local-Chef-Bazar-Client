import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import useAuth from "./useAuth";

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

const useAxiosSecure = () => {
  const { logOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const interceptor = axiosSecure.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          await logOut();
          navigate("/login");
        }
        return Promise.reject(error);
      }
    );

    return () => axiosSecure.interceptors.response.eject(interceptor);
  }, [logOut, navigate]);

  return axiosSecure;
};

export default useAxiosSecure;