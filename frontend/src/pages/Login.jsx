
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginUser } from "../services/authApi";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import loginFloorplan from "../assets/login-floorplan.jpg";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // EMAIL LOGIN
  // =========================
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await loginUser({
        email: email.trim(),
        password,
      });

      if (response?.token) {
        localStorage.setItem("dreamhouse_token", response.token);
      }

      const user = response?.user;

      if (user) {
        localStorage.setItem("dreamhouse_name", user.name || "");
        localStorage.setItem(
          "dreamhouse_email",
          user.email || email
        );
        localStorage.setItem(
          "dreamhouse_role",
          user.role || "User"
        );
      } else {
        localStorage.setItem("dreamhouse_email", email);
        localStorage.setItem("dreamhouse_role", "User");
      }

      localStorage.setItem("dreamhouse_logged_in", "true");

      if (remember) {
        localStorage.setItem("dreamhouse_remember", "true");
      } else {
        localStorage.removeItem("dreamhouse_remember");
      }

      const role =
        user?.role ||
        localStorage.getItem("dreamhouse_role") ||
        "User";

      if (role.toLowerCase() === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Login failed. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // GOOGLE LOGIN
  // =========================
  const handleGoogleLogin = async () => {
    try {
      setError("");
      setGoogleLoading(true);

      const provider = new GoogleAuthProvider();

      provider.setCustomParameters({
        prompt: "select_account",
      });

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const users = JSON.parse(
        localStorage.getItem("dreamhouse_users") || "[]"
      );

      const existingUserIndex = users.findIndex(
        (item) =>
          item.email?.toLowerCase() ===
          user.email?.toLowerCase()
      );

      const googleUser = {
        id: user.uid,
        name: user.displayName || "Google User",
        email: user.email || "",
        role: "User",
        status: "Active",
        authProvider: "Google",
        photo: user.photoURL || "",
        lastLogin: new Date().toISOString(),
        joined: new Date().toISOString(),
        projects: 0,
      };

      if (existingUserIndex >= 0) {
        users[existingUserIndex] = {
          ...users[existingUserIndex],
          ...googleUser,
        };
      } else {
        users.push(googleUser);
      }

      localStorage.setItem(
        "dreamhouse_users",
        JSON.stringify(users)
      );

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
      localStorage.setItem(
        "dreamhouse_auth_provider",
        "Google"
      );

      if (user.photoURL) {
        localStorage.setItem(
          "dreamhouse_photo",
          user.photoURL
        );
      }

      const token = await user.getIdToken();

      localStorage.setItem(
        "dreamhouse_token",
        token
      );

      navigate("/dashboard");
    } catch (err) {
      console.error("Google login error:", err);

      if (err?.code === "auth/popup-closed-by-user") {
        setError("Google login popup was closed.");
      } else if (err?.code === "auth/popup-blocked") {
        setError(
          "Google popup was blocked. Please allow popups for this site."
        );
      } else if (err?.code === "auth/unauthorized-domain") {
        setError(
          "This domain is not authorized in Firebase."
        );
      } else if (err?.code === "auth/operation-not-allowed") {
        setError(
          "Google Sign-In is not enabled in Firebase."
        );
      } else {
        setError(
          err?.message ||
            "Google login failed. Please try again."
        );
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f5ef] text-[#173d32]">

      <div className="grid min-h-screen lg:grid-cols-[1.08fr_0.92fr]">

        {/* =====================================================
            LEFT IMAGE SECTION
        ====================================================== */}
        <section className="relative hidden min-h-screen overflow-hidden bg-[#173d32] lg:flex">

          {/* Your Image */}
          <img
            src={loginFloorplan}
            alt="Dream House Floor Plan"
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* Elegant Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#173d32]/80 via-[#173d32]/35 to-black/35" />

          {/* Soft Glow */}
          <div className="absolute -left-20 top-1/3 h-72 w-72 rounded-full bg-white/10 blur-3xl" />


          {/* Logo */}
          <div className="absolute left-10 top-9 z-20 flex items-center gap-3 text-white">

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 bg-white/15 shadow-lg backdrop-blur-md">

              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 11.5 12 4l9 7.5" />
                <path d="M5.5 10.5V20h13v-9.5" />
                <path d="M9.5 20v-5h5v5" />
              </svg>

            </div>

            <div>
              <p className="font-serif text-lg font-semibold">
                DreamHouse
              </p>

              <p className="text-[9px] uppercase tracking-[0.28em] text-white/65">
                Planner
              </p>
            </div>

          </div>


          {/* Main Content */}
          <div className="relative z-10 flex min-h-screen w-full items-center px-12 xl:px-16">

            <div className="max-w-[520px] text-white">

              {/* Badge */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-lg">

                <span className="h-1.5 w-1.5 rounded-full bg-[#dce9dc]" />

                <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-white/90">
                  Dream Home Planner
                </span>

              </div>


              {/* Heading */}
              <h1 className="font-serif text-[44px] leading-[1.06] sm:text-[50px] xl:text-[60px]">

                Build the plan
                <br />

                <span className="text-[#dce9dc]">
                  behind your dream.
                </span>

              </h1>


              {/* Description */}
              <p className="mt-6 max-w-[440px] text-[13px] leading-7 text-white/75">
                Create your floor plan, organize every room,
                explore your home in 3D, and turn your ideas
                into a beautiful living space.
              </p>


              {/* Feature Cards */}
              <div className="mt-8 grid max-w-[450px] grid-cols-3 gap-2.5">

                <div className="rounded-2xl border border-white/15 bg-white/10 px-3 py-3.5 backdrop-blur-md">

                  <div className="mb-2 text-lg">
                    ⌂
                  </div>

                  <p className="text-[10px] font-semibold">
                    2D Plans
                  </p>

                  <p className="mt-1 text-[8px] text-white/55">
                    Create layouts
                  </p>

                </div>


                <div className="rounded-2xl border border-white/15 bg-white/10 px-3 py-3.5 backdrop-blur-md">

                  <div className="mb-2 text-lg">
                    ◇
                  </div>

                  <p className="text-[10px] font-semibold">
                    3D View
                  </p>

                  <p className="mt-1 text-[8px] text-white/55">
                    See your space
                  </p>

                </div>


                <div className="rounded-2xl border border-white/15 bg-white/10 px-3 py-3.5 backdrop-blur-md">

                  <div className="mb-2 text-lg">
                    ✦
                  </div>

                  <p className="text-[10px] font-semibold">
                    AI Planner
                  </p>

                  <p className="mt-1 text-[8px] text-white/55">
                    Smart ideas
                  </p>

                </div>

              </div>

            </div>

          </div>


          {/* Bottom */}
          <div className="absolute bottom-8 left-10 z-20">

            <p className="text-[9px] uppercase tracking-[0.3em] text-white/45">
              Imagine • Plan • Create
            </p>

          </div>

        </section>


        {/* =====================================================
            RIGHT LOGIN
        ====================================================== */}
        <section className="flex min-h-screen items-center justify-center px-5 py-8 sm:px-10 lg:px-12 xl:px-16">

          <div className="w-full max-w-[430px]">

            {/* Mobile Logo */}
            <Link
              to="/"
              className="mb-7 flex items-center gap-3 lg:hidden"
            >

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#173d32] text-white">

                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
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

                <div className="text-[9px] uppercase tracking-[0.2em] text-[#6b7d74]">
                  Planner
                </div>

              </div>

            </Link>


            {/* Card */}
            <div className="rounded-[28px] border border-[#e0e4dc] bg-white p-6 shadow-[0_25px_70px_rgba(23,61,50,0.09)] sm:p-8">

              {/* Header */}
              <div className="mb-6">

                <div className="mb-3 flex items-center gap-2">

                  <span className="h-1.5 w-1.5 rounded-full bg-[#173d32]" />

                  <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#77847d]">
                    Welcome back
                  </span>

                </div>

                <h2 className="font-serif text-[31px] leading-tight text-[#173d32]">
                  Sign in to continue
                </h2>

                <p className="mt-2 text-[13px] leading-6 text-[#78847f]">
                  Continue designing your dream home.
                </p>

              </div>


              {/* Error */}
              {error && (
                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs leading-5 text-red-700">
                  {error}
                </div>
              )}


              {/* Google */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={googleLoading || loading}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#d9ded8] bg-white px-5 py-3.5 text-[13px] font-semibold text-[#173d32] transition-all duration-200 hover:border-[#173d32] hover:bg-[#fafbf8] hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
              >

                {googleLoading ? (
                  <>
                    <svg
                      className="h-5 w-5 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="9"
                        stroke="currentColor"
                        strokeWidth="2"
                        opacity="0.25"
                      />

                      <path
                        d="M21 12a9 9 0 0 1-9 9"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>

                    Connecting to Google...
                  </>
                ) : (
                  <>
                    <span className="flex h-5 w-5 items-center justify-center text-[17px] font-bold">
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

                <div className="h-px flex-1 bg-[#e1e4df]" />

                <span className="text-[9px] uppercase tracking-[0.16em] text-[#929c96]">
                  or continue with email
                </span>

                <div className="h-px flex-1 bg-[#e1e4df]" />

              </div>


              {/* Form */}
              <form
                onSubmit={handleLogin}
                className="space-y-4"
              >

                {/* Email */}
                <div>

                  <label
                    htmlFor="email"
                    className="mb-2 block text-[9px] font-bold uppercase tracking-[0.14em] text-[#53645d]"
                  >
                    Email address
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full rounded-xl border border-[#d8ddd7] bg-[#fcfcfa] px-4 py-3.5 text-[13px] text-[#173d32] outline-none transition-all placeholder:text-[#a4ada8] focus:border-[#173d32] focus:bg-white focus:ring-4 focus:ring-[#173d32]/5"
                  />

                </div>


                {/* Password */}
                <div>

                  <div className="mb-2 flex items-center justify-between">

                    <label
                      htmlFor="password"
                      className="block text-[9px] font-bold uppercase tracking-[0.14em] text-[#53645d]"
                    >
                      Password
                    </label>

                    <button
                      type="button"
                      onClick={() =>
                        alert(
                          "Password reset will be connected later."
                        )
                      }
                      className="text-[10px] font-semibold text-[#0b5d46] hover:underline"
                    >
                      Forgot password?
                    </button>

                  </div>

                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-[#d8ddd7] bg-[#fcfcfa] px-4 py-3.5 text-[13px] text-[#173d32] outline-none transition-all placeholder:text-[#a4ada8] focus:border-[#173d32] focus:bg-white focus:ring-4 focus:ring-[#173d32]/5"
                  />

                </div>


                {/* Remember */}
                <label className="flex cursor-pointer items-center gap-2 text-[11px] text-[#697771]">

                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) =>
                      setRemember(e.target.checked)
                    }
                    className="h-4 w-4 rounded border-[#cbd3cd] accent-[#173d32]"
                  />

                  Remember me

                </label>


                {/* Login */}
                <button
                  type="submit"
                  disabled={loading || googleLoading}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#173d32] px-5 py-3.5 text-[13px] font-semibold text-white shadow-[0_8px_20px_rgba(23,61,50,0.16)] transition-all duration-200 hover:bg-[#0d5946] hover:shadow-[0_12px_25px_rgba(23,61,50,0.2)] disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {loading ? (
                    <>
                      <svg
                        className="h-4 w-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="8"
                          stroke="currentColor"
                          strokeWidth="2"
                          opacity="0.3"
                        />

                        <path
                          d="M20 12a8 8 0 0 1-8 8"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      </svg>

                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in

                      <span className="transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </>
                  )}

                </button>

              </form>


              {/* Signup */}
              <div className="mt-6 rounded-2xl border border-[#e0e4dd] bg-[#f8f9f5] px-4 py-3.5 text-center">

                <p className="text-[11px] text-[#718079]">

                  Don't have an account?{" "}

                  <Link
                    to="/signup"
                    className="font-bold text-[#0b5d46] hover:underline"
                  >
                    Create account
                  </Link>

                </p>

              </div>

            </div>


            {/* Footer */}
            <p className="mt-5 text-center text-[9px] leading-5 text-[#929b96]">

              By continuing, you agree to our{" "}

              <button
                type="button"
                className="underline hover:text-[#173d32]"
              >
                Terms
              </button>

              {" "}and{" "}

              <button
                type="button"
                className="underline hover:text-[#173d32]"
              >
                Privacy Policy
              </button>

              .

            </p>

          </div>

        </section>

      </div>

    </div>
  );
}
