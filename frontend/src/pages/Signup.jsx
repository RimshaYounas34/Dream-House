import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { registerUser } from "../services/authApi";

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

 const handleSignup = async (e) => {
  e.preventDefault();

  if (!name || !email || !password || !confirmPassword) {
    alert("Please fill in all fields.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  if (password.length < 6) {
    alert("Password must be at least 6 characters.");
    return;
  }

  try {
    await registerUser({ name, email, password });
    navigate("/dashboard");
  } catch (error) {
    alert(error.message || "Unable to create account. Please try again.");
  }
};
  return (
    <div className="min-h-screen bg-[#f8f5eb] text-[#173d32]">

      {/* Header */}
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-5 py-6 sm:px-8 lg:px-10">
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

        <Link
          to="/login"
          className="rounded-full border border-[#ccd4cc] bg-white px-5 py-2.5 text-[11px] font-semibold text-[#315348] transition hover:bg-[#0b5d46] hover:text-white"
        >
          Login
        </Link>
      </div>

      {/* Signup */}
      <main className="flex min-h-[calc(100vh-100px)] items-center justify-center px-5 py-10">
        <div className="w-full max-w-[430px]">

          <div className="mb-7 text-center">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#0b5d46]">
              Get Started
            </p>

            <h1 className="font-serif text-4xl font-medium leading-tight text-[#173d32]">
              Create your account
            </h1>

            <p className="mx-auto mt-3 max-w-[340px] text-[12px] leading-6 text-[#718078]">
              Start designing your dream home with DreamHouse Planner.
            </p>
          </div>

          <div className="rounded-3xl border border-[#dce2da] bg-white p-6 shadow-sm sm:p-8">

            <form onSubmit={handleSignup}>

              {/* Name */}
              <div>
                <label className="mb-2 block text-[11px] font-semibold text-[#315348]">
                  Full Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="h-11 w-full rounded-xl border border-[#dce2da] bg-[#fbfcf9] px-4 text-[12px] text-[#173d32] outline-none transition placeholder:text-[#a0aaa3] focus:border-[#0b5d46] focus:ring-2 focus:ring-[#0b5d46]/10"
                />
              </div>

              {/* Email */}
              <div className="mt-5">
                <label className="mb-2 block text-[11px] font-semibold text-[#315348]">
                  Email Address
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="h-11 w-full rounded-xl border border-[#dce2da] bg-[#fbfcf9] px-4 text-[12px] text-[#173d32] outline-none transition placeholder:text-[#a0aaa3] focus:border-[#0b5d46] focus:ring-2 focus:ring-[#0b5d46]/10"
                />
              </div>

              {/* Password */}
              <div className="mt-5">
                <label className="mb-2 block text-[11px] font-semibold text-[#315348]">
                  Password
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="h-11 w-full rounded-xl border border-[#dce2da] bg-[#fbfcf9] px-4 text-[12px] text-[#173d32] outline-none transition placeholder:text-[#a0aaa3] focus:border-[#0b5d46] focus:ring-2 focus:ring-[#0b5d46]/10"
                />
              </div>

              {/* Confirm Password */}
              <div className="mt-5">
                <label className="mb-2 block text-[11px] font-semibold text-[#315348]">
                  Confirm Password
                </label>

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="h-11 w-full rounded-xl border border-[#dce2da] bg-[#fbfcf9] px-4 text-[12px] text-[#173d32] outline-none transition placeholder:text-[#a0aaa3] focus:border-[#0b5d46] focus:ring-2 focus:ring-[#0b5d46]/10"
                />
              </div>

              {/* Signup Button */}
              <button
                type="submit"
                className="mt-6 flex h-11 w-full items-center justify-center rounded-xl bg-[#0b5d46] text-[11px] font-bold text-white shadow-lg shadow-[#0b5d46]/20 transition hover:bg-[#094c3a]"
              >
                Create Account
                <span className="ml-2 text-sm">→</span>
              </button>
            </form>

            {/* Login */}
            <div className="mt-6 border-t border-[#e7ebe5] pt-5 text-center">
              <p className="text-[11px] text-[#718078]">
                Already have an account?
              </p>

              <Link
                to="/login"
                className="mt-2 inline-block text-[11px] font-semibold text-[#0b5d46] hover:underline"
              >
                Sign in to your account
              </Link>
            </div>
          </div>

          <p className="mt-5 text-center text-[10px] leading-5 text-[#8a928c]">
            By creating an account, you agree to our Terms and Privacy Policy.
          </p>

        </div>
      </main>
    </div>
  );
}