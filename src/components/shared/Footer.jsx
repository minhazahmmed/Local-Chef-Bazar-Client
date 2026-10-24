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

const socials = [
  { label: "Facebook", icon: FaFacebookF, href: "https://facebook.com" },
  { label: "Instagram", icon: FaInstagram, href: "https://instagram.com" },
  { label: "YouTube", icon: FaYoutube, href: "https://youtube.com" },
  { label: "LinkedIn", icon: FaLinkedinIn, href: "https://linkedin.com" },
];

const Footer = () => {
  return (
    <footer className="bg-neutral text-neutral-content">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {/* Brand */}
        <div>
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-content">
              <LuChefHat size={20} />
            </span>
            <span className="font-heading text-xl font-semibold text-white">
              LocalChefBazar
            </span>
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-neutral-content/80">
            A small marketplace for neighbourhood home cooks to share what they
            make best, and for everyone else to enjoy it fresh at their door.
          </p>
          <div className="mt-5 flex gap-2">
            {socials.map(({ label, icon: Icon, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-neutral-content transition-colors hover:border-primary hover:bg-primary hover:text-white"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="font-heading text-base font-semibold text-white">
            Explore
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link to="/" className="text-neutral-content/80 hover:text-white">
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/meals"
                className="text-neutral-content/80 hover:text-white"
              >
                Meals
              </Link>
            </li>
            <li>
              <Link
                to="/login"
                className="text-neutral-content/80 hover:text-white"
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                className="text-neutral-content/80 hover:text-white"
              >
                Register
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-heading text-base font-semibold text-white">
            Contact
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-neutral-content/80">
            <li className="flex items-start gap-2">
              <MdOutlineLocationOn size={18} className="mt-0.5 shrink-0" />
              <span>West Bakalia, DC Road, Chittagong, Bangladesh</span>
            </li>
            <li className="flex items-center gap-2">
              <MdOutlinePhone size={18} className="shrink-0" />
              <span>+880 1878438206</span>
            </li>
            <li className="flex items-center gap-2">
              <MdOutlineMail size={18} className="shrink-0" />
              <span>localchefbazar@gmail.com</span>
            </li>
          </ul>
        </div>

        {/* Working hours */}
        <div>
          <h3 className="font-heading text-base font-semibold text-white">
            Working Hours
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-neutral-content/80">
            <li className="flex justify-between gap-4">
              <span>Sat - Thu</span>
              <span>9:00 AM - 10:00 PM</span>
            </li>
            <li className="flex justify-between gap-4">
              <span>Friday</span>
              <span>2:00 PM - 10:00 PM</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-sm text-neutral-content/70 sm:flex-row sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} LocalChefBazar. All rights reserved.
          </p>
          <p>Cooked up with care in Bangladesh.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
