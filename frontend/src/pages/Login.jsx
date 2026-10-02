import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginUser } from "../services/authApi";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      alert("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      // Remove any old/invalid session before logging in again
      localStorage.removeItem("dreamhouse_token");
      localStorage.removeItem("dreamhouse_user");
      localStorage.removeItem("dreamhouse_logged_in");
      localStorage.removeItem("dreamhouse_name");

      const user = await loginUser({
        email: email.trim(),
        password,
      });

      // Make sure login actually produced a token
      const token = localStorage.getItem("dreamhouse_token");

      console.log("[Login] User:", user);
      console.log(
        "[Login] Token saved:",
        token ? "YES" : "NO"
      );

      if (!token) {
        throw new Error(
          "Login succeeded but no authentication token was received. Please check the backend login response."
        );
      }

      // Navigate after successful authenticated login
      if (user?.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (error) {
      console.error("[Login] Error:", error);

      alert(
        error?.message ||
          "Unable to sign in. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f5ed] text-[#173d32]">
      <div className="mx-auto flex min-h-screen max-w-[1280px] p-4 sm:p-5 lg:p-6">

        <div className="grid w-full overflow-hidden rounded-[28px] border border-[#dfe3da] bg-white shadow-[0_15px_50px_rgba(30,55,45,0.08)] lg:grid-cols-[0.95fr_1.05fr]">

          {/* LEFT IMAGE */}
          <div className="relative hidden min-h-[700px] overflow-hidden lg:block">

            <img
              src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=90"
              alt="Modern house"
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#102f27]/85 via-[#173d32]/10 to-transparent" />

            {/* Logo */}
            <div className="absolute left-7 top-7 flex items-center gap-3 text-white">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#0b5d46]">
                <span className="text-xl">⌂</span>
              </div>

              <div>
                <p className="font-serif text-[18px] font-semibold leading-none">
                  DreamHouse
                </p>

                <p className="mt-1 text-[8px] uppercase tracking-[0.2em] text-white/80">
                  Planner
                </p>
              </div>
            </div>

            {/* Bottom Text */}
            <div className="absolute bottom-8 left-8 right-8 text-white">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">
                Dream • Plan • Build
              </p>

              <h1 className="mt-2 max-w-[430px] font-serif text-4xl font-semibold leading-[1.05] tracking-[-0.03em]">
                Design the home you've always imagined.
              </h1>

              <p className="mt-4 max-w-[390px] text-[13px] leading-6 text-white/80">
                Plan your rooms, visualize your ideas and create your dream
                home before you build it.
              </p>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center justify-center px-6 py-8 sm:px-10 lg:px-14">
            <div className="w-full max-w-[390px]">

              {/* Mobile Logo */}
              <div className="mb-8 flex items-center gap-3 lg:hidden">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0b5d46] text-white">
                  <span className="text-xl">⌂</span>
                </div>

                <div>
                  <p className="font-serif text-[18px] font-semibold leading-none">
                    DreamHouse
                  </p>

                  <p className="mt-1 text-[8px] uppercase tracking-[0.2em] text-[#718078]">
                    Planner
                  </p>
                </div>
              </div>

              {/* Heading */}
              <div className="mb-7">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#718078]">
                  Welcome back
                </p>

                <h2 className="mt-2 font-serif text-4xl font-semibold tracking-[-0.035em]">
                  Welcome Back!
                </h2>

                <p className="mt-2 text-[13px] leading-6 text-[#718078]">
                  Sign in to continue designing your dream home.
                </p>
              </div>

              {/* Google */}
              <button
                type="button"
                onClick={() =>
                  alert("Google login will be connected later.")
                }
                className="flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-[#dce2da] bg-white text-[12px] font-semibold text-[#40534b] transition hover:border-[#b9c8bf] hover:bg-[#fafbf8]"
              >
                <span className="text-[14px] font-bold">G</span>
                Continue with Google
              </button>

              {/* Divider */}
              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-[#e5e8e2]" />

                <span className="text-[10px] text-[#9aa49f]">
                  or
                </span>

                <div className="h-px flex-1 bg-[#e5e8e2]" />
              </div>

              {/* Form */}
              <form onSubmit={handleLogin} className="space-y-4">

                {/* Email */}
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold text-[#40534b]">
                    Email address
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@gmail.com"
                    autoComplete="email"
                    disabled={loading}
                    className="h-11 w-full rounded-xl border border-[#dce2da] bg-[#fcfcf9] px-3.5 text-[12px] outline-none transition placeholder:text-[#a2aaa5] focus:border-[#0b5d46] focus:ring-2 focus:ring-[#0b5d46]/10 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold text-[#40534b]">
                    Password
                  </label>

                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    disabled={loading}
                    className="h-11 w-full rounded-xl border border-[#dce2da] bg-[#fcfcf9] px-3.5 text-[12px] outline-none transition placeholder:text-[#a2aaa5] focus:border-[#0b5d46] focus:ring-2 focus:ring-[#0b5d46]/10 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                {/* Remember / Forgot */}
                <div className="flex items-center justify-between pt-1">

                  <label className="flex cursor-pointer items-center gap-2 text-[10px] text-[#60716a]">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="h-3.5 w-3.5 accent-[#0b5d46]"
                    />

                    Remember me
                  </label>

                  <button
                    type="button"
                    disabled={loading}
                    onClick={() =>
                      alert("Password reset will be connected later.")
                    }
                    className="text-[10px] font-semibold text-[#0b5d46] hover:underline disabled:opacity-50"
                  >
                    Forgot password?
                  </button>

                </div>

                {/* LOGIN */}
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 h-11 w-full rounded-xl bg-[#0b5d46] text-[12px] font-semibold text-white shadow-[0_8px_20px_rgba(11,93,70,0.18)] transition hover:-translate-y-0.5 hover:bg-[#084c3a] hover:shadow-[0_10px_25px_rgba(11,93,70,0.25)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {loading ? "Signing in..." : "Login"}
                </button>
              </form>

              {/* SIGN UP */}
              <div className="mt-7 rounded-2xl border border-[#e0e5de] bg-[#f8faf6] p-4 text-center">

                <p className="text-[11px] text-[#718078]">
                  Don't have an account yet?
                </p>

                <Link
                  to="/signup"
                  className="mt-3 flex h-10 w-full items-center justify-center rounded-xl border border-[#0b5d46] bg-white text-[11px] font-semibold text-[#0b5d46] transition hover:bg-[#0b5d46] hover:text-white"
                >
                  Create a DreamHouse Account
                  <span className="ml-2 text-sm">→</span>
                </Link>

              </div>

              {/* Footer */}
              <p className="mt-7 text-center text-[9px] leading-5 text-[#9aa49f]">
                By continuing, you agree to our Terms of Service and Privacy
                Policy.
              </p>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}