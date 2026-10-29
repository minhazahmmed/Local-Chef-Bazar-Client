import axios from "axios";
import auth from "../firebase/firebase.config";

const axiosPublic = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

axiosPublic.interceptors.request.use(async (config) => {
  const currentUser = auth.currentUser;

  if (currentUser && !config.headers.Authorization) {
    const idToken = await currentUser.getIdToken();
    config.headers.Authorization = `Bearer ${idToken}`;
  }

  return config;
});

export default axiosPublic;