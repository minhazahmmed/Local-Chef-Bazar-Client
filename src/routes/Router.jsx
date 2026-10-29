import { createBrowserRouter, Navigate } from "react-router";
import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import Home from "../pages/Home";
import Meals from "../pages/Meals";
import MealDetails from "../pages/MealDetails";
import OrderPage from "../pages/OrderPage";
import PaymentSuccess from "../pages/PaymentSuccess";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import ErrorPage from "../pages/ErrorPage";
import MyProfile from "../components/Dashboard/MyProfile";
import MyOrders from "../components/Dashboard/User/MyOrders";
import MyReview from "../components/Dashboard/User/MyReview";
import FavoriteMeals from "../components/Dashboard/User/FavoriteMeals";
import CreateMeal from "../components/Dashboard/Chef/CreateMeal";
import MyMeals from "../components/Dashboard/Chef/MyMeals";
import OrderRequests from "../components/Dashboard/Chef/OrderRequests";
import ManageUsers from "../components/Dashboard/Admin/ManageUsers";
import ManageRequests from "../components/Dashboard/Admin/ManageRequests";
import PlatformStatistics from "../components/Dashboard/Admin/PlatformStatistics";
import PrivateRoute from "./PrivateRoute";
import ChefRoute from "./ChefRoute";
import AdminRoute from "./AdminRoute";
import ManageReviews from "../components/Dashboard/Admin/ManageReviews";
import ManageMeals from "../components/Dashboard/Admin/ManageMeals";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "meals", element: <Meals /> },
      {
        path: "meals/:id",
        element: (
          <PrivateRoute>
            <MealDetails />
          </PrivateRoute>
        ),
      },
      {
        path: "order/:id",
        element: (
          <PrivateRoute>
            <OrderPage />
          </PrivateRoute>
        ),
      },
      {
        path: "payment-success",
        element: (
          <PrivateRoute>
            <PaymentSuccess />
          </PrivateRoute>
        ),
      },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "forgot-password", element: <ForgotPassword /> },
    ],
  },
  
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Navigate to="/dashboard/profile" replace /> },
      { path: "profile", element: <MyProfile /> },
      { path: "my-orders", element: <MyOrders /> },
      { path: "my-reviews", element: <MyReview /> },
      { path: "favorites", element: <FavoriteMeals /> },
      {
        path: "create-meal",
        element: (
          <ChefRoute>
            <CreateMeal />
          </ChefRoute>
        ),
      },
      {
        path: "my-meals",
        element: (
          <ChefRoute>
            <MyMeals />
          </ChefRoute>
        ),
      },
      {
        path: "order-requests",
        element: (
          <ChefRoute>
            <OrderRequests />
          </ChefRoute>
        ),
      },
      {
        path: "manage-users",
        element: (
          <AdminRoute>
            <ManageUsers />
          </AdminRoute>
        ),
      },
      {
        path: "manage-requests",
        element: (
          <AdminRoute>
            <ManageRequests />
          </AdminRoute>
        ),
      },
      {
  path: "manage-reviews",
  element: (
    <AdminRoute>
      <ManageReviews />
    </AdminRoute>
  ),
},
{
  path: "manage-meals",
  element: (
    <AdminRoute>
      <ManageMeals />
    </AdminRoute>
  ),
},
      {
        path: "statistics",
        element: (
          <AdminRoute>
            <PlatformStatistics />
          </AdminRoute>
        ),
      },
    ],
  },
]);

export default router;