import { Navigate } from "react-router";
import useUserInfo from "../hooks/useUserInfo";
import Loading from "../components/shared/Loading";

const ChefRoute = ({ children }) => {
  const { userInfo, isLoading } = useUserInfo();

  if (isLoading) return <Loading />;

  if (userInfo.role !== "chef") return <Navigate to="/dashboard/profile" replace />;

  return children;
};

export default ChefRoute;