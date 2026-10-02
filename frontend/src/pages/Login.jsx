import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginUser } from "../services/authApi";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // NORMAL EMAIL LOGIN
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
        localStorage.setItem("dreamhouse_email", user.email || email);
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

      console.log("Google user:", user);

      // --------------------------------
      // Save Google user locally
      // --------------------------------

      const users =
        JSON.parse(
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

      // --------------------------------
      // Save current logged-in user
      // --------------------------------

      localStorage.setItem(
        "dreamhouse_name",
        user.displayName || "Google User"
      );

      localStorage.setItem(
        "dreamhouse_email",
        user.email || ""
      );

      localStorage.setItem(
        "dreamhouse_role",
        "User"
      );

      localStorage.setItem(
        "dreamhouse_logged_in",
        "true"
      );

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

      // Firebase ID token
      const token = await user.getIdToken();

      localStorage.setItem(
        "dreamhouse_token",
        token
      );

      // Go to dashboard
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
    <div className="min-h-screen bg-[#f7f5ed] text-[#173d32]">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* =========================================
            LEFT IMAGE
        ========================================= */}
        <div className="relative hidden min-h-screen overflow-hidden lg:block">
          <img
            src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=90"
            alt="Modern house"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-[#173d32]/35" />

          <div className="absolute bottom-10 left-10 right-10 text-white">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em]">
              DreamHouse Planner
            </p>

            <h1 className="max-w-xl font-serif text-4xl leading-tight xl:text-5xl">
              Design the home
              <br />
              you dream about.
            </h1>

            <p className="mt-5 max-w-lg text-sm leading-6 text-white/85">
              Create your floor plan, customize every room,
              and visualize your dream home in 3D.
            </p>
          </div>
        </div>

        {/* =========================================
            RIGHT LOGIN
        ========================================= */}
        <div className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-[400px]">

            {/* Logo */}
            <Link
              to="/"
              className="mb-8 flex items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#173d32] text-white">
                <svg
                  width="21"
                  height="21"
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

                <div className="text-[10px] uppercase tracking-[0.2em] text-[#6b7d74]">
                  Planner
                </div>
              </div>
            </Link>

            {/* Heading */}
            <div className="mb-7">
              <h2 className="font-serif text-4xl leading-tight">
                Welcome back
              </h2>

              <p className="mt-2 text-sm text-[#718079]">
                Sign in to continue designing your dream home.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* =========================================
                GOOGLE BUTTON
            ========================================= */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoading || loading}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#d8ddd7] bg-white px-5 py-3.5 text-sm font-medium text-[#173d32] transition hover:border-[#173d32] hover:bg-[#fafbf8] disabled:cursor-not-allowed disabled:opacity-60"
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
                  {/* Google G */}
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
            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-[#dfe3dd]" />

              <span className="text-[11px] uppercase tracking-[0.15em] text-[#89958f]">
                or continue with email
              </span>

              <div className="h-px flex-1 bg-[#dfe3dd]" />
            </div>

            {/* =========================================
                EMAIL LOGIN
            ========================================= */}
            <form
              onSubmit={handleLogin}
              className="space-y-5"
            >
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#53645d]"
                >
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full rounded-xl border border-[#d8ddd7] bg-white px-4 py-3.5 text-sm text-[#173d32] outline-none transition placeholder:text-[#a0aaa5] focus:border-[#173d32] focus:ring-2 focus:ring-[#173d32]/10"
                />
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#53645d]"
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
                    className="text-xs font-medium text-[#0b5d46] hover:underline"
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
                  className="w-full rounded-xl border border-[#d8ddd7] bg-white px-4 py-3.5 text-sm text-[#173d32] outline-none transition placeholder:text-[#a0aaa5] focus:border-[#173d32] focus:ring-2 focus:ring-[#173d32]/10"
                />
              </div>

              {/* Remember */}
              <label className="flex cursor-pointer items-center gap-2.5 text-sm text-[#65746e]">
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
                className="w-full rounded-xl bg-[#173d32] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0b5d46] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Signing in..."
                  : "Sign in"}
              </button>
            </form>

            {/* Signup */}
            <div className="mt-7 rounded-2xl border border-[#dce1da] bg-white/70 px-5 py-4 text-center">
              <p className="text-sm text-[#718079]">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-semibold text-[#0b5d46] hover:underline"
                >
                  Create account
                </Link>
              </p>
            </div>

            {/* Footer */}
            <p className="mt-7 text-center text-[11px] leading-5 text-[#8a958f]">
              By continuing, you agree to our{" "}
              <button
                type="button"
                className="underline hover:text-[#173d32]"
              >
                Terms
              </button>{" "}
              and{" "}
              <button
                type="button"
                className="underline hover:text-[#173d32]"
              >
                Privacy Policy
              </button>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}