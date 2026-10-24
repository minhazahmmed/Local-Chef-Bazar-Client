import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { LuChefHat } from "react-icons/lu";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import useAuth from "../../hooks/useAuth";

const Navbar = () => {
  const { user, logOut } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const closeMenu = () => setOpen(false);

  const handleLogout = () => {
    logOut()
      .then(() => {
        closeMenu();
        navigate("/");
      })
      .catch((err) => console.error(err));
  };

  const linkClass = ({ isActive }) =>
    `block py-2 text-[15px] font-medium transition-colors lg:py-0 ${
      isActive ? "text-primary" : "text-base-content/75 hover:text-primary"
    }`;

  const links = (
    <>
      <li>
        <NavLink to="/" className={linkClass} onClick={closeMenu}>
          Home
        </NavLink>
      </li>
      <li>
        <NavLink to="/meals" className={linkClass} onClick={closeMenu}>
          Meals
        </NavLink>
      </li>
      {user && (
        <li>
          <NavLink to="/dashboard" className={linkClass} onClick={closeMenu}>
            Dashboard
          </NavLink>
        </li>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-base-300 bg-base-100">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo + Project Name */}
        <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-content">
            <LuChefHat size={20} />
          </span>
          <span className="font-heading text-lg font-semibold text-base-content sm:text-xl">
            LocalChefBazar
          </span>
        </Link>

        {/* Desktop links */}
        <nav className="hidden lg:block">
          <ul className="flex items-center gap-8">{links}</ul>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <>
              <div className="avatar" title={user.displayName || "Profile"}>
                <div className="w-9 rounded-full ring-2 ring-primary/30 ring-offset-2 ring-offset-base-100">
                  <img
                    src={
                      user.photoURL ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user.displayName || "User"
                      )}&background=c8461a&color=fff`
                    }
                    alt={user.displayName || "User"}
                  />
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-primary btn-sm hidden sm:inline-flex"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link to="/login" className="btn btn-outline btn-primary btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            className="btn btn-ghost btn-square lg:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <HiX size={24} /> : <HiMenuAlt3 size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <div className="border-t border-base-300 bg-base-100 lg:hidden">
          <ul className="flex flex-col px-4 py-2">{links}</ul>
          <div className="flex gap-2 border-t border-base-300 px-4 py-3 sm:hidden">
            {user ? (
              <button
                onClick={handleLogout}
                className="btn btn-primary btn-sm flex-1"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="btn btn-outline btn-primary btn-sm flex-1"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="btn btn-primary btn-sm flex-1"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;