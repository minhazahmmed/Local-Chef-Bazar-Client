import { Link, NavLink, Outlet, ScrollRestoration } from "react-router";
import { LuChefHat } from "react-icons/lu";
import { HiMenuAlt3 } from "react-icons/hi";
import {
  MdOutlinePerson,
  MdOutlineShoppingBag,
  MdOutlineStarOutline,
  MdOutlineFavoriteBorder,
  MdOutlineAddCircleOutline,
  MdOutlineRestaurantMenu,
  MdOutlineInbox,
  MdOutlinePeople,
  MdOutlineHowToReg,
  MdOutlineBarChart,
  MdOutlineHome,
  MdOutlineRateReview,
} from "react-icons/md";
import useAuth from "../hooks/useAuth";
import useUserInfo from "../hooks/useUserInfo";
import Loading from "../components/shared/Loading";

const customerLinks = [
  {
    to: "/dashboard/my-orders",
    label: "My Orders",
    icon: MdOutlineShoppingBag,
  },
  {
    to: "/dashboard/my-reviews",
    label: "My Reviews",
    icon: MdOutlineStarOutline,
  },
  {
    to: "/dashboard/favorites",
    label: "Favorite Meals",
    icon: MdOutlineFavoriteBorder,
  },
];

const linksByRole = {
  user: [
    { to: "/dashboard/profile", label: "My Profile", icon: MdOutlinePerson },
    ...customerLinks,
  ],
  chef: [
    { to: "/dashboard/profile", label: "My Profile", icon: MdOutlinePerson },
    {
      to: "/dashboard/create-meal",
      label: "Create Meal",
      icon: MdOutlineAddCircleOutline,
    },
    {
      to: "/dashboard/my-meals",
      label: "My Meals",
      icon: MdOutlineRestaurantMenu,
    },
    {
      to: "/dashboard/order-requests",
      label: "Order Requests",
      icon: MdOutlineInbox,
    },
  ],
  admin: [
    { to: "/dashboard/profile", label: "My Profile", icon: MdOutlinePerson },
    {
      to: "/dashboard/manage-users",
      label: "Manage Users",
      icon: MdOutlinePeople,
    },
    {
      to: "/dashboard/manage-requests",
      label: "Manage Requests",
      icon: MdOutlineHowToReg,
    },
    {
      to: "/dashboard/manage-reviews",
      label: "Manage Reviews",
      icon: MdOutlineRateReview,
    },
    {
      to: "/dashboard/manage-meals",
      label: "Manage Meals",
      icon: MdOutlineRestaurantMenu,
    },
    {
      to: "/dashboard/statistics",
      label: "Platform Statistics",
      icon: MdOutlineBarChart,
    },
  ],
};

const DashboardLayout = () => {
  const { user } = useAuth();
  const { userInfo, isLoading } = useUserInfo();

  if (isLoading) return <Loading />;

  const links = linksByRole[userInfo.role] || linksByRole.user;
  const showCustomerLinks =
    userInfo.role === "chef" || userInfo.role === "admin";

  const closeDrawer = () => {
    document.getElementById("dashboard-drawer").checked = false;
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-3 py-3 text-base font-semibold transition-colors ${
      isActive
        ? "bg-primary text-primary-content"
        : "text-base-content/90 hover:bg-base-200"
    }`;

  const renderLinks = (list) =>
    list.map((link) => (
      <li key={link.to}>
        <NavLink to={link.to} onClick={closeDrawer} className={linkClass}>
          <link.icon size={22} />
          {link.label}
        </NavLink>
      </li>
    ));

  return (
    <div className="drawer lg:drawer-open">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />
      <ScrollRestoration />

      <div className="drawer-content flex min-h-screen flex-col bg-base-200">
        <div className="flex items-center gap-2 border-b border-base-content/20 bg-base-100 px-4 py-3 lg:hidden">
          <label
            htmlFor="dashboard-drawer"
            className="btn btn-ghost btn-square"
          >
            <HiMenuAlt3 size={28} />
          </label>
          <span className="text-lg font-bold text-base-content">Dashboard</span>
        </div>

        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </div>

      <div className="drawer-side z-40">
        <label
          htmlFor="dashboard-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>

        <aside className="flex min-h-full w-72 flex-col border-r border-base-content/20 bg-base-100 p-4">
          <Link to="/" className="flex items-center gap-2 px-2 py-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-content">
              <LuChefHat size={24} />
            </span>
            <span className="text-xl font-bold text-base-content">LocalChefBazaar</span>
          </Link>

          <div className="mt-6 flex items-center gap-3 rounded-lg border border-base-content/15 bg-base-200 p-3">
            <div className="avatar">
              <div className="w-12 rounded-full ring-2 ring-primary/30 ring-offset-2 ring-offset-base-200">
                <img
                  src={userInfo.image || user?.photoURL}
                  alt={userInfo.name}
                />
              </div>
            </div>
            <div className="min-w-0">
              <p className="truncate text-base font-bold text-base-content">
                {userInfo.name}
              </p>
              <p className="text-sm font-medium capitalize text-base-content/80">
                {userInfo.role}
              </p>
            </div>
          </div>

          <ul className="mt-6 flex flex-col gap-1">{renderLinks(links)}</ul>

          {showCustomerLinks && (
            <>
              <p className="mt-6 px-3 text-sm font-bold uppercase tracking-wide text-base-content/70">
                As a customer
              </p>
              <ul className="mt-2 flex flex-col gap-1">
                {renderLinks(customerLinks)}
              </ul>
            </>
          )}

          <div className="mt-auto border-t border-base-content/20 pt-4">
            <Link
              to="/"
              className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-semibold text-base-content/90 hover:bg-base-200"
            >
              <MdOutlineHome size={22} />
              Back to Home
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DashboardLayout;