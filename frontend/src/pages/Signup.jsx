import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [googleLoading, setGoogleLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  // ============================================
  // NORMAL EMAIL/PASSWORD SIGNUP
  // ============================================
  const handleSignup = (e) => {
    e.preventDefault();

    if (
      !name.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {
      alert("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    const existingUsers =
      JSON.parse(localStorage.getItem("dreamhouse_users")) || [];

    const cleanEmail = email.trim().toLowerCase();

    const emailExists = existingUsers.some(
      (user) => user.email.toLowerCase() === cleanEmail
    );

    if (emailExists) {
      alert("An account with this email already exists.");
      return;
    }

    setLoading(true);

    const newUser = {
      id: Date.now(),
      name: name.trim(),
      email: cleanEmail,
      password: password,
      role: "User",
      status: "Active",
      projects: 0,
      lastLogin: new Date().toLocaleDateString(),
      joined: new Date().toLocaleDateString(),
      authProvider: "Email",
    };

    localStorage.setItem(
      "dreamhouse_users",
      JSON.stringify([...existingUsers, newUser])
    );

    localStorage.setItem("dreamhouse_name", newUser.name);
    localStorage.setItem("dreamhouse_email", newUser.email);
    localStorage.setItem("dreamhouse_password", newUser.password);
    localStorage.setItem("dreamhouse_role", "User");
    localStorage.setItem("dreamhouse_logged_in", "true");

    setLoading(false);

    alert("Account created successfully!");

    navigate("/dashboard");
  };

  // ============================================
  // GOOGLE SIGN UP
  // ============================================
  const handleGoogleSignup = async () => {
    try {
      setGoogleLoading(true);

      const provider = new GoogleAuthProvider();

      provider.setCustomParameters({
        prompt: "select_account",
      });

      const result = await signInWithPopup(auth, provider);

      const user = result.user;

      const existingUsers =
        JSON.parse(localStorage.getItem("dreamhouse_users")) || [];

      const cleanEmail = user.email?.toLowerCase();

      const existingUser = existingUsers.find(
        (item) => item.email.toLowerCase() === cleanEmail
      );

      if (!existingUser) {
        const newUser = {
          id: Date.now(),
          name: user.displayName || "Google User",
          email: user.email,
          role: "User",
          status: "Active",
          projects: 0,
          lastLogin: new Date().toLocaleDateString(),
          joined: new Date().toLocaleDateString(),
          authProvider: "Google",
          photoURL: user.photoURL || "",
        };

        localStorage.setItem(
          "dreamhouse_users",
          JSON.stringify([...existingUsers, newUser])
        );
      } else {
        const updatedUsers = existingUsers.map((item) =>
          item.email.toLowerCase() === cleanEmail
            ? {
                ...item,
                lastLogin: new Date().toLocaleDateString(),
                status: "Active",
                photoURL: user.photoURL || item.photoURL || "",
              }
            : item
        );

        localStorage.setItem(
          "dreamhouse_users",
          JSON.stringify(updatedUsers)
        );
      }

      localStorage.setItem(
        "dreamhouse_name",
        user.displayName || "Google User"
      );

      localStorage.setItem(
        "dreamhouse_email",
        user.email || ""
      );

      localStorage.setItem("dreamhouse_role", "User");
      localStorage.setItem("dreamhouse_logged_in", "true");
      localStorage.setItem("dreamhouse_auth_provider", "Google");

      if (user.photoURL) {
        localStorage.setItem(
          "dreamhouse_photo",
          user.photoURL
        );
      }

      alert("Google sign-in successful!");

      navigate("/dashboard");
    } catch (error) {
      console.error("Google Sign-In Error:", error);

      if (error.code === "auth/popup-closed-by-user") {
        return;
      }

      if (error.code === "auth/popup-blocked") {
        alert(
          "Google popup was blocked by your browser. Please allow popups and try again."
        );
        return;
      }

      if (error.code === "auth/unauthorized-domain") {
        alert(
          "This website domain is not authorized in Firebase Authentication."
        );
        return;
      }

      alert(
        error.message ||
          "Google sign-in failed. Please try again."
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f5ed] text-[#173d32]">
      <div className="grid min-h-screen lg:grid-cols-[46%_54%]">

        {/* =====================================================
            LEFT IMAGE PANEL
        ===================================================== */}
        <div className="relative hidden overflow-hidden lg:block">

          {/* Main house image */}
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=90"
            alt="Modern dream house"
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* Elegant image overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#102e27]/90 via-[#173d32]/65 to-[#173d32]/35" />

          {/* Soft decorative glow */}
          <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-[#d9e7d8]/10 blur-3xl" />
          <div className="absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-[#d9e7d8]/10 blur-3xl" />

          <div className="relative z-10 flex min-h-screen flex-col justify-between p-10 xl:p-14">

            {/* Logo */}
            <Link
              to="/"
              className="flex w-fit items-center gap-3 text-white"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 backdrop-blur-md">
                <svg
                  width="21"
                  height="21"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                >
                  <path d="M3 11.5 12 4l9 7.5" />
                  <path d="M5.5 10.5V20h13v-9.5" />
                  <path d="M9.5 20v-5h5v5" />
                </svg>
              </div>

              <div>
                <div className="font-serif text-lg">
                  DreamHouse
                </div>

                <div className="text-[9px] uppercase tracking-[0.25em] text-white/60">
                  Planner
                </div>
              </div>
            </Link>

            {/* Center content */}
            <div className="max-w-xl">

              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/85 backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-[#c8dcc8]" />
                Smart Home Planning
              </div>

              <h1 className="max-w-lg font-serif text-5xl leading-[1.02] text-white xl:text-6xl">
                Turn your idea
                <br />
                into a home.
              </h1>

              <p className="mt-6 max-w-md text-sm leading-7 text-white/75 xl:text-[15px]">
                Design intelligent floor plans, customize every room,
                and bring your dream home to life with beautiful
                2D and 3D visualization.
              </p>

              {/* Feature strip */}
              <div className="mt-9 grid max-w-lg grid-cols-3 gap-3">

                <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
                  <div className="font-serif text-2xl text-white">
                    2D
                  </div>

                  <div className="mt-1 text-[10px] uppercase tracking-wider text-white/55">
                    Floor Plans
                  </div>
                </div>

                <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
                  <div className="font-serif text-2xl text-white">
                    3D
                  </div>

                  <div className="mt-1 text-[10px] uppercase tracking-wider text-white/55">
                    Visualization
                  </div>
                </div>

                <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
                  <div className="font-serif text-2xl text-white">
                    AI
                  </div>

                  <div className="mt-1 text-[10px] uppercase tracking-wider text-white/55">
                    Smart Design
                  </div>
                </div>

              </div>

              {/* Floating architectural card */}
              <div className="mt-8 flex w-fit items-center gap-3 rounded-2xl border border-white/15 bg-black/15 px-4 py-3 backdrop-blur-md">

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M4 19V7l8-4 8 4v12" />
                    <path d="M8 19v-5h8v5" />
                    <path d="M8 10h8" />
                  </svg>
                </div>

                <div>
                  <p className="text-xs font-medium text-white">
                    Your space. Your vision.
                  </p>

                  <p className="mt-0.5 text-[10px] text-white/50">
                    Designed around you.
                  </p>
                </div>

              </div>

            </div>

            {/* Bottom */}
            <div className="flex items-center justify-between gap-4">

              <p className="text-[10px] uppercase tracking-[0.18em] text-white/45">
                © {new Date().getFullYear()} DreamHouse Planner
              </p>

              <div className="h-px w-20 bg-white/20" />

            </div>

          </div>
        </div>

        {/* =====================================================
            RIGHT FORM PANEL
        ===================================================== */}
        <div className="flex min-h-screen items-center justify-center px-5 py-8 sm:px-8 lg:px-12 xl:px-20">

          <div className="w-full max-w-[470px]">

            {/* Mobile Logo */}
            <div className="mb-8 lg:hidden">

              <Link
                to="/"
                className="flex w-fit items-center gap-3"
              >

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#173d32] text-white">
                  <svg
                    width="19"
                    height="19"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M3 11.5 12 4l9 7.5" />
                    <path d="M5.5 10.5V20h13v-9.5" />
                    <path d="M9.5 20v-5h5v5" />
                  </svg>
                </div>

                <div>
                  <div className="font-serif text-lg font-semibold">
                    DreamHouse
                  </div>

                  <div className="text-[9px] uppercase tracking-[0.22em] text-[#789087]">
                    Planner
                  </div>
                </div>

              </Link>

            </div>

            {/* Heading */}
            <div className="mb-7">

              <div className="mb-3 flex items-center gap-2">
                <span className="h-px w-7 bg-[#173d32]" />

                <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#668076]">
                  Get Started
                </span>
              </div>

              <h2 className="font-serif text-[38px] leading-[1.08] tracking-tight text-[#173d32] sm:text-[42px]">
                Create your account
              </h2>

              <p className="mt-3 max-w-md text-[13px] leading-6 text-[#75827c]">
                Start designing your dream home with smart floor
                planning and powerful design tools.
              </p>

            </div>

            {/* Google */}
            <button
              type="button"
              onClick={handleGoogleSignup}
              disabled={googleLoading || loading}
              className="group flex w-full items-center justify-center gap-3 rounded-2xl border border-[#d7ddd5] bg-white px-5 py-3.5 text-[13px] font-semibold text-[#29463c] shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#173d32] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
            >

              {googleLoading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#173d32] border-t-transparent" />

                  Connecting to Google...
                </>
              ) : (
                <>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#e4e7e2] bg-white text-sm font-bold shadow-sm">
                    <span className="bg-gradient-to-r from-[#4285F4] via-[#34A853] to-[#EA4335] bg-clip-text text-transparent">
                      G
                    </span>
                  </span>

                  Continue with Google
                </>
              )}

            </button>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">

              <div className="h-px flex-1 bg-[#e1e5df]" />

              <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#9aa39e]">
                Or sign up with email
              </span>

              <div className="h-px flex-1 bg-[#e1e5df]" />

            </div>

            {/* Form */}
            <form
              onSubmit={handleSignup}
              className="space-y-4"
            >

              {/* Name */}
              <div>

                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#53665e]">
                  Full Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="Enter your full name"
                  disabled={loading}
                  autoComplete="name"
                  className="w-full rounded-xl border border-[#d9dfd8] bg-white px-4 py-3.5 text-[13px] text-[#173d32] shadow-sm outline-none transition placeholder:text-[#a1aaa5] focus:border-[#315b4d] focus:ring-4 focus:ring-[#315b4d]/8 disabled:opacity-60"
                />

              </div>

              {/* Email */}
              <div>

                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#53665e]">
                  Email Address
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="you@example.com"
                  disabled={loading}
                  autoComplete="email"
                  className="w-full rounded-xl border border-[#d9dfd8] bg-white px-4 py-3.5 text-[13px] text-[#173d32] shadow-sm outline-none transition placeholder:text-[#a1aaa5] focus:border-[#315b4d] focus:ring-4 focus:ring-[#315b4d]/8 disabled:opacity-60"
                />

              </div>

              {/* Password */}
              <div>

                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#53665e]">
                  Password
                </label>

                <div className="relative">

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="Create a password"
                    disabled={loading}
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-[#d9dfd8] bg-white px-4 py-3.5 pr-16 text-[13px] text-[#173d32] shadow-sm outline-none transition placeholder:text-[#a1aaa5] focus:border-[#315b4d] focus:ring-4 focus:ring-[#315b4d]/8 disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-[#71847b] transition hover:text-[#173d32]"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>

                </div>

              </div>

              {/* Confirm Password */}
              <div>

                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#53665e]">
                  Confirm Password
                </label>

                <div className="relative">

                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(
                        e.target.value
                      )
                    }
                    placeholder="Confirm your password"
                    disabled={loading}
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-[#d9dfd8] bg-white px-4 py-3.5 pr-16 text-[13px] text-[#173d32] shadow-sm outline-none transition placeholder:text-[#a1aaa5] focus:border-[#315b4d] focus:ring-4 focus:ring-[#315b4d]/8 disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-[#71847b] transition hover:text-[#173d32]"
                  >
                    {showConfirmPassword
                      ? "Hide"
                      : "Show"}
                  </button>

                </div>

              </div>

              {/* Terms */}
              <p className="pt-1 text-[11px] leading-5 text-[#7d8983]">
                By creating an account, you agree to our{" "}
                <button
                  type="button"
                  className="font-medium text-[#315b4d] hover:underline"
                >
                  Terms of Service
                </button>{" "}
                and{" "}
                <button
                  type="button"
                  className="font-medium text-[#315b4d] hover:underline"
                >
                  Privacy Policy
                </button>
                .
              </p>

              {/* Create Account */}
              <button
                type="submit"
                disabled={loading || googleLoading}
                className="group mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-[#173d32] px-5 py-3.5 text-[13px] font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#0d3026] hover:shadow-lg hover:shadow-[#173d32]/15 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account

                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="transition-transform duration-200 group-hover:translate-x-0.5"
                    >
                      <path d="M5 12h14" />
                      <path d="m13 6 6 6-6 6" />
                    </svg>
                  </>
                )}
              </button>

            </form>

            {/* Login */}
            <div className="mt-6 rounded-xl border border-[#e0e4de] bg-[#fbfaf6] px-4 py-3.5 text-center">

              <p className="text-[12px] text-[#78847e]">
                Already have an account?{" "}

                <Link
                  to="/login"
                  className="font-semibold text-[#173d32] transition hover:text-[#0b5d46] hover:underline"
                >
                  Log in
                </Link>
              </p>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}