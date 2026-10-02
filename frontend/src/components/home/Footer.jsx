import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#123d31] px-5 py-16 text-white sm:px-8 lg:px-10">
      <div className="mx-auto max-w-[1200px]">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Link to="/" className="font-serif text-2xl font-semibold">DreamHouse</Link>
            <p className="mt-5 max-w-[320px] text-[13px] leading-6 text-[#b9c9c1]">
              A simple space to plan, visualize and organize your dream home.
            </p>
          </div>

          <div>
            <h3 className="text-[13px] font-bold">Product</h3>
            <div className="mt-5 space-y-3 text-[12px] text-[#b9c9c1]">
              <a href="#features" className="block hover:text-white">Features</a>
              <a href="#templates" className="block hover:text-white">Templates</a>
              <a href="#how-it-works" className="block hover:text-white">How It Works</a>
            </div>
          </div>

          <div>
            <h3 className="text-[13px] font-bold">Company</h3>
            <div className="mt-5 space-y-3 text-[12px] text-[#b9c9c1]">
              <a href="#about" className="block hover:text-white">About</a>
              <a href="#home" className="block hover:text-white">Home</a>
              <Link to="/templates" className="block hover:text-white">Browse</Link>
            </div>
          </div>

          <div>
            <h3 className="text-[13px] font-bold">Support</h3>
            <div className="mt-5 space-y-3 text-[12px] text-[#b9c9c1]">
              <Link to="/help" className="block hover:text-white">Help Center</Link>
              <Link to="/settings" className="block hover:text-white">Settings</Link>
              <a href="mailto:hello@dreamhouseplanner.com" className="block hover:text-white">Contact</a>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col justify-between gap-3 border-t border-white/10 pt-6 text-[11px] text-[#9fb3aa] sm:flex-row">
          <p>© 2026 DreamHouse Planner. All rights reserved.</p>
          <p>Plan better. Build smarter.</p>
        </div>
      </div>
    </footer>
  );
}
