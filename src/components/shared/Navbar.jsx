import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router";
import { LuChefHat } from "react-icons/lu";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import useAuth from "../../hooks/useAuth";
import useUserInfo from "../../hooks/useUserInfo";

const Navbar = () => {
  const { user, logOut } = useAuth();
  const { userInfo } = useUserInfo();
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const headerRef = useRef(null);

  const closeMenu = () => setOpen(false);

  if (lastPath !== location.pathname) {
    setLastPath(location.pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    const startY = window.scrollY;

    const handleScroll = () => {
      if (Math.abs(window.scrollY - startY) > 60) setOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [open]);

  const handleLogout = () => {
    logOut()
      .then(() => {
        closeMenu();
        navigate("/");
      })
      .catch((err) => console.error(err));
  };

  const linkClass = ({ isActive }) =>
    `block py-3 text-lg font-semibold transition-colors lg:py-0 lg:text-[17px] ${
      isActive ? "text-primary" : "text-base-content/90 hover:text-primary"
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
    <header
      ref={headerRef}
      className="sticky top-0 z-50 border-b border-base-content/15 bg-base-100"
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-content">
            <LuChefHat size={24} />
          </span>
          <span className="text-xl font-bold text-base-content sm:text-2xl">
            LocalChefBazaar
          </span>
        </Link>

        <nav className="hidden lg:block">
          <ul className="flex items-center gap-8">{links}</ul>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <>
              <div className="avatar" title={userInfo.name || user.displayName || "Profile"}>
                <div className="w-10 rounded-full ring-2 ring-primary/30 ring-offset-2 ring-offset-base-100">
                  <img
                    src={
                      userInfo.image ||
                      user.photoURL ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user.displayName || "User"
                      )}&background=c8461a&color=fff`
                    }
                    alt={userInfo.name || user.displayName || "User"}
                  />
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-primary hidden text-base sm:inline-flex"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link to="/login" className="btn btn-outline btn-primary border-2 text-base">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary text-base">
                Register
              </Link>
            </div>
          )}

          <button
            className="btn btn-ghost btn-square lg:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <HiX size={28} /> : <HiMenuAlt3 size={28} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-base-content/15 bg-base-100 lg:hidden">
          <ul className="flex flex-col px-4 py-2">{links}</ul>
          <div className="flex gap-3 border-t border-base-content/15 px-4 py-4 sm:hidden">
            {user ? (
              <button
                onClick={handleLogout}
                className="btn btn-primary flex-1 text-base"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="btn btn-outline btn-primary flex-1 border-2 text-base"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="btn btn-primary flex-1 text-base"
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