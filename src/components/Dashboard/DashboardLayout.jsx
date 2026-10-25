import { Link, NavLink, Outlet } from "react-router";
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
} from "react-icons/md";
import useAuth from "../hooks/useAuth";
import useUserInfo from "../hooks/useUserInfo";
import Loading from "../components/shared/Loading";

const linksByRole = {
  user: [
    { to: "/dashboard/profile", label: "My Profile", icon: MdOutlinePerson },
    { to: "/dashboard/my-orders", label: "My Orders", icon: MdOutlineShoppingBag },
    { to: "/dashboard/my-reviews", label: "My Reviews", icon: MdOutlineStarOutline },
    { to: "/dashboard/favorites", label: "Favorite Meals", icon: MdOutlineFavoriteBorder },
  ],
  chef: [
    { to: "/dashboard/profile", label: "My Profile", icon: MdOutlinePerson },
    { to: "/dashboard/create-meal", label: "Create Meal", icon: MdOutlineAddCircleOutline },
    { to: "/dashboard/my-meals", label: "My Meals", icon: MdOutlineRestaurantMenu },
    { to: "/dashboard/order-requests", label: "Order Requests", icon: MdOutlineInbox },
  ],
  admin: [
    { to: "/dashboard/profile", label: "My Profile", icon: MdOutlinePerson },
    { to: "/dashboard/manage-users", label: "Manage Users", icon: MdOutlinePeople },
    { to: "/dashboard/manage-requests", label: "Manage Requests", icon: MdOutlineHowToReg },
    { to: "/dashboard/statistics", label: "Platform Statistics", icon: MdOutlineBarChart },
  ],
};

const DashboardLayout = () => {
  const { user } = useAuth();
  const { userInfo, isLoading } = useUserInfo();

  if (isLoading) return <Loading />;

  const links = linksByRole[userInfo.role] || linksByRole.user;

  const closeDrawer = () => {
    document.getElementById("dashboard-drawer").checked = false;
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] font-medium transition-colors ${
      isActive
        ? "bg-primary text-primary-content"
        : "text-base-content/75 hover:bg-base-200"
    }`;

  return (
    <div className="drawer lg:drawer-open">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex min-h-screen flex-col bg-base-200">
        <div className="flex items-center gap-2 border-b border-base-300 bg-base-100 px-4 py-3 lg:hidden">
          <label htmlFor="dashboard-drawer" className="btn btn-ghost btn-square">
            <HiMenuAlt3 size={24} />
          </label>
          <span className="font-semibold">Dashboard</span>
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

        <aside className="flex min-h-full w-64 flex-col border-r border-base-300 bg-base-100 p-4">
          <Link to="/" className="flex items-center gap-2 px-2 py-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-content">
              <LuChefHat size={20} />
            </span>
            <span className="text-lg font-semibold">LocalChefBazaar</span>
          </Link>

          <div className="mt-6 flex items-center gap-3 rounded-lg bg-base-200 p-3">
            <div className="avatar">
              <div className="w-10 rounded-full">
                <img
                  src={userInfo.image || user?.photoURL}
                  alt={userInfo.name}
                />
              </div>
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{userInfo.name}</p>
              <p className="text-xs capitalize text-base-content/60">
                {userInfo.role}
              </p>
            </div>
          </div>

          <ul className="mt-6 flex flex-col gap-1">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} onClick={closeDrawer} className={linkClass}>
                  <link.icon size={20} />
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="mt-auto border-t border-base-300 pt-4">
            <Link
              to="/"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] font-medium text-base-content/75 hover:bg-base-200"
            >
              <MdOutlineHome size={20} />
              Back to Home
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DashboardLayout;