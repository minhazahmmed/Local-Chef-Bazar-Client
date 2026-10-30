import { useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import useAuth from "../hooks/useAuth";
import Loading from "../components/shared/Loading";

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [wasLoggedIn, setWasLoggedIn] = useState(null);

  if (!loading && wasLoggedIn === null) {
    setWasLoggedIn(Boolean(user));
  }

  if (loading || wasLoggedIn === null) return <Loading />;

  if (wasLoggedIn) {
    return <Navigate to={location.state || "/"} replace />;
  }

  return children || <Outlet />;
};

export default PublicRoute;