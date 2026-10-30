import { Link, useRouteError } from "react-router";
import useTitle from "../hooks/useTitle";

const ErrorPage = () => {
  useTitle("Something went wrong");
  const error = useRouteError();
  const notFound = error?.status === 404;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-base-100 px-4 text-center">
      <p className="text-7xl font-bold text-primary">{notFound ? "404" : "Oops"}</p>
      <h1 className="mt-4 text-3xl font-semibold">
        {notFound ? "This page does not exist" : "Something went wrong"}
      </h1>
      <p className="mt-2 max-w-md text-base-content/90">
        {notFound
          ? "The page you are looking for may have moved or never existed."
          : "Please try again in a moment."}
      </p>
      <Link to="/" className="btn btn-primary mt-6 text-[16px]">
        Back to Home
      </Link>
    </div>
  );
};

export default ErrorPage;