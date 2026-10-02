import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("dreamhouse_logged_in");
    setIsLoggedIn(loggedIn === "true");
  }, []);

  return (
    <header className="absolute left-0 top-0 z-50 w-full">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-5 py-5 sm:px-8 lg:px-10">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e8eee5] text-[#0b5d46]">
            <svg width="25" height="25" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 11.5 12 4l9 7.5V21H3V11.5Z"
                stroke="currentColor"
                strokeWidth="1.7"
              />
              <path
                d="M8 21v-6h8v6M12 4v4"
                stroke="currentColor"
                strokeWidth="1.7"
              />
            </svg>
          </div>

          <div>
            <p className="font-serif text-base font-bold leading-none text-[#173d32]">
              DreamHouse
            </p>
            <p className="mt-1.5 text-[10px] font-medium tracking-[0.25em] text-[#8a928c]">
              PLANNER
            </p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-8 text-[11px] font-medium text-[#53615a] md:flex">
          <a href="#home" className="transition hover:text-[#0b5d46]">
            Home
          </a>

          <a href="#features" className="transition hover:text-[#0b5d46]">
            Features
          </a>

          <a href="#templates" className="transition hover:text-[#0b5d46]">
            Templates
          </a>

          <a href="#how-it-works" className="transition hover:text-[#0b5d46]">
            How It Works
          </a>

          <a href="#about" className="transition hover:text-[#0b5d46]">
            About
          </a>
        </nav>

        {/* Right Buttons */}
        <div className="flex items-center gap-2.5">

          {/* Theme Button */}
          <button className="hidden h-10 w-10 items-center justify-center rounded-full border border-[#d9ded6] bg-white/70 text-base md:flex">
            ☼
          </button>

          {/* LOGIN / LOGOUT BUTTON */}
          {isLoggedIn ? (
            <button
              onClick={() => {
                localStorage.removeItem("dreamhouse_logged_in");
                setIsLoggedIn(false);
              }}
              className="rounded-full border border-[#ccd4cc] bg-white/70 px-5 py-3 text-[11px] font-semibold text-[#315348] transition hover:bg-[#0b5d46] hover:text-white"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="rounded-full border border-[#ccd4cc] bg-white/70 px-5 py-3 text-[11px] font-semibold text-[#315348] transition hover:bg-[#0b5d46] hover:text-white"
            >
              Login
            </Link>
          )}

          {/* Get Started */}
          <Link
            to="/create-project"
            className="rounded-full bg-[#0b5d46] px-5 py-3 text-[11px] font-bold text-white shadow-lg shadow-[#0b5d46]/20"
          >
            Get Started
          </Link>

        </div>
      </div>
    </header>
  );
}