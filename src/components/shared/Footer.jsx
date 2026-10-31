import { Link } from "react-router";
import { LuChefHat } from "react-icons/lu";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
} from "react-icons/fa";
import {
  MdOutlineMail,
  MdOutlinePhone,
  MdOutlineLocationOn,
} from "react-icons/md";
import useAuth from "../../hooks/useAuth";

const socials = [
  { label: "Facebook", icon: FaFacebookF, href: "https://facebook.com" },
  { label: "Instagram", icon: FaInstagram, href: "https://instagram.com" },
  { label: "YouTube", icon: FaYoutube, href: "https://youtube.com" },
  { label: "LinkedIn", icon: FaLinkedinIn, href: "https://linkedin.com" },
];

const linkClass =
  "inline-block text-base text-neutral-content/90 transition-colors hover:text-primary";

const headingClass = "text-lg font-bold text-white";

const Footer = () => {
  const { user } = useAuth();

  return (
    <footer className="bg-neutral text-neutral-content">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:gap-12 lg:px-8">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-content">
              <LuChefHat size={24} />
            </span>
            <span className="text-2xl font-bold text-white">
              LocalChefBazaar
            </span>
          </Link>
          <p className="mt-4 text-base leading-relaxed text-neutral-content/90">
            A small marketplace for neighbourhood home cooks to share what they
            make best, and for everyone else to enjoy it fresh at their door.
          </p>
          <div className="mt-6 flex gap-3">
            {socials.map(({ label, icon: Icon, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:border-primary hover:bg-primary"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className={headingClass}>Explore</h3>
          <span className="mt-2 block h-1 w-10 rounded-full bg-primary" />
          <ul className="mt-5 space-y-3">
            <li>
              <Link to="/" className={linkClass}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/meals" className={linkClass}>
                Meals
              </Link>
            </li>
            <li>
              <Link to="/coverage" className={linkClass}>
                Coverage
              </Link>
            </li>
            {user ? (
              <li>
                <Link to="/dashboard" className={linkClass}>
                  Dashboard
                </Link>
              </li>
            ) : (
              <>
                <li>
                  <Link to="/login" className={linkClass}>
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className={linkClass}>
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>

        <div>
          <h3 className={headingClass}>Contact</h3>
          <span className="mt-2 block h-1 w-10 rounded-full bg-primary" />
          <ul className="mt-5 space-y-4 text-base text-neutral-content/90">
            <li className="flex items-start gap-3">
              <MdOutlineLocationOn
                size={22}
                className="mt-0.5 shrink-0 text-primary"
              />
              <span>West Bakalia, DC Road, Chittagong, Bangladesh</span>
            </li>
            <li className="flex items-center gap-3">
              <MdOutlinePhone size={22} className="shrink-0 text-primary" />
              <span>+880 12345678910</span>
            </li>
            <li className="flex items-center gap-3">
              <MdOutlineMail size={22} className="shrink-0 text-primary" />
              <span className="break-all">localchefbazar@gmail.com</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className={headingClass}>Working Hours</h3>
          <span className="mt-2 block h-1 w-10 rounded-full bg-primary" />
          <ul className="mt-5 space-y-3 text-base text-neutral-content/90">
            <li className="flex flex-wrap justify-between gap-x-4 border-b border-white/15 pb-3">
              <span className="font-semibold text-white">Sat - Thu</span>
              <span>9:00 AM - 10:00 PM</span>
            </li>
            <li className="flex flex-wrap justify-between gap-x-4">
              <span className="font-semibold text-white">Friday</span>
              <span>2:00 PM - 10:00 PM</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-[15px] text-neutral-content/85 sm:flex-row sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} LocalChefBazaar. All rights reserved.
          </p>
          <p>Cooked up with care in Bangladesh.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
