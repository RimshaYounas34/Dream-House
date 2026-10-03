import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="border-b border-slate-100 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-2xl">
            🏡
          </div>

          <div>
            <p className="text-lg font-bold leading-none text-slate-900">
              Dream House
            </p>

            <p className="mt-1 text-[9px] font-semibold tracking-[0.3em] text-slate-500">
              PLANNER
            </p>
          </div>
        </Link>

        {/* NAVIGATION */}
        <nav className="hidden items-center gap-7 md:flex">

          <Link
            to="/"
            className="text-sm font-medium text-slate-700 hover:text-green-700"
          >
            Home
          </Link>

          <a
            href="#how-it-works"
            className="text-sm font-medium text-slate-700 hover:text-green-700"
          >
            How It Works
          </a>

          <a
            href="#features"
            className="text-sm font-medium text-slate-700 hover:text-green-700"
          >
            Features
          </a>

          <Link
            to="/templates"
            className="text-sm font-medium text-slate-700 hover:text-green-700"
          >
            Templates
          </Link>

          <span className="text-sm font-medium text-slate-700">
            Pricing
          </span>

          <Link
            to="/help"
            className="text-sm font-medium text-slate-700 hover:text-green-700"
          >
            Blog
          </Link>

        </nav>

        {/* BUTTONS */}
        <div className="hidden items-center gap-3 md:flex">

          <Link
            to="/login"
            className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Log in
          </Link>

          <Link
            to="/signup"
            className="rounded-lg bg-green-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-800"
          >
            Get Started
          </Link>

        </div>

        {/* MOBILE BUTTON */}
        <button className="rounded-lg border border-slate-200 px-3 py-2 text-xl md:hidden">
          ☰
        </button>

      </div>
    </header>
  );
}

export default Navbar;