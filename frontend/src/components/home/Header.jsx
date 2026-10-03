import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Sparkles,
  ArrowRight,
  Menu,
} from "lucide-react";

export default function Header() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) =>
    `group relative px-1 py-2.5 text-[14px] transition-colors ${
      isActive(path)
        ? "font-semibold text-[#08724f]"
        : "font-medium text-[#63736e] hover:text-[#08724f]"
    }`;

  return (
    <header className="relative z-[100] w-full border-b border-[#e8eeeb] bg-white">

      <div className="mx-auto flex h-[86px] w-full max-w-[1550px] items-center justify-between px-6 sm:px-10 lg:px-14 xl:px-20">

        {/* =====================================================
            LOGO
        ===================================================== */}

        <Link
          to="/"
          className="group flex shrink-0 items-center gap-3.5"
        >
          <div className="flex h-[50px] w-[50px] items-center justify-center rounded-[14px] bg-[#eef7f3] transition-all duration-300 group-hover:bg-[#08724f]">

            <Home
              size={27}
              strokeWidth={1.8}
              className="text-[#08724f] transition-colors duration-300 group-hover:text-white"
            />

          </div>

          <div className="leading-none">

            <p className="text-[21px] font-bold tracking-[-0.04em] text-[#17342c]">
              Dream House
            </p>

            <div className="mt-1.5 flex items-center gap-2">

              <span className="h-px w-5 bg-[#08724f]" />

              <p className="text-[8px] font-bold uppercase tracking-[0.45em] text-[#78877f]">
                Planner
              </p>

            </div>

          </div>
        </Link>

        {/* =====================================================
            NAVIGATION
        ===================================================== */}

        <nav className="hidden items-center gap-8 lg:flex xl:gap-11">

          {/* HOME */}

          <Link
            to="/"
            className={navLinkClass("/")}
          >
            Home

            {isActive("/") && (
              <span className="absolute bottom-0 left-1/2 h-[2px] w-5 -translate-x-1/2 rounded-full bg-[#08724f]" />
            )}
          </Link>

          {/* FEATURES */}

          <Link
            to="/features"
            className={navLinkClass("/features")}
          >
            Features

            {isActive("/features") && (
              <span className="absolute bottom-0 left-1/2 h-[2px] w-10 -translate-x-1/2 rounded-full bg-[#08724f]" />
            )}
          </Link>

          {/* HOW IT WORKS */}

          <Link
            to="/how-it-works"
            className={navLinkClass("/how-it-works")}
          >
            How It Works

            {isActive("/how-it-works") && (
              <span className="absolute bottom-0 left-1/2 h-[2px] w-12 -translate-x-1/2 rounded-full bg-[#08724f]" />
            )}
          </Link>

          {/* TEMPLATES */}

          <Link
            to="/templates"
            className={navLinkClass("/templates")}
          >
            Templates

            {isActive("/templates") && (
              <span className="absolute bottom-0 left-1/2 h-[2px] w-10 -translate-x-1/2 rounded-full bg-[#08724f]" />
            )}
          </Link>

          {/* MY DESIGNS */}

          <Link
            to="/my-designs"
            className={navLinkClass("/my-designs")}
          >
            My Designs

            {isActive("/my-designs") && (
              <span className="absolute bottom-0 left-1/2 h-[2px] w-10 -translate-x-1/2 rounded-full bg-[#08724f]" />
            )}
          </Link>

          {/* CONTACT */}

          <Link
            to="/contact"
            className={navLinkClass("/contact")}
          >
            Contact

            {isActive("/contact") && (
              <span className="absolute bottom-0 left-1/2 h-[2px] w-8 -translate-x-1/2 rounded-full bg-[#08724f]" />
            )}
          </Link>

        </nav>

        {/* =====================================================
            RIGHT SIDE
        ===================================================== */}

        <div className="hidden items-center gap-4 md:flex">

          {/* LOGIN */}

          <Link
            to="/login"
            className="px-3 py-2.5 text-[14px] font-semibold text-[#52635c] transition-colors hover:text-[#08724f]"
          >
            Login
          </Link>

          {/* SIGN UP */}

          <Link
            to="/signup"
            className="group flex h-[46px] items-center gap-2 rounded-[11px] bg-[#08724f] px-5 shadow-[0_7px_20px_rgba(8,114,79,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#065d40]"
            style={{
              backgroundColor: "#08724f",
            }}
          >

            <Sparkles
              size={15}
              strokeWidth={2}
              style={{
                color: "#ffffff",
              }}
            />

            <span
              style={{
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: 700,
                whiteSpace: "nowrap",
              }}
            >
              Sign Up
            </span>

            <ArrowRight
              size={14}
              strokeWidth={2}
              style={{
                color: "#ffffff",
              }}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />

          </Link>

        </div>

        {/* =====================================================
            MOBILE
        ===================================================== */}

        <button
          type="button"
          aria-label="Open menu"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#dce6e1] bg-white text-[#08724f] lg:hidden"
        >
          <Menu size={21} />
        </button>

      </div>

    </header>
  );
}