
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { apiRequest } from "../services/api";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: form.email.trim().toLowerCase(),
          password: form.password,
        }),
      });

      const token =
        response?.token ||
        response?.data?.token ||
        response?.accessToken ||
        response?.data?.accessToken;

      const user =
        response?.user ||
        response?.data?.user ||
        null;

      if (!token) {
        throw new Error(
          "Login successful, but the server did not return an authentication token."
        );
      }

      const role = String(
        user?.role ||
          response?.role ||
          response?.data?.role ||
          ""
      ).toLowerCase();

      if (role !== "admin") {
        throw new Error(
          "This account does not have administrator access."
        );
      }

      // Save real backend authentication token
      localStorage.setItem("dreamhouse_token", token);

      // Save admin user
      localStorage.setItem(
        "dreamhouse_user",
        JSON.stringify({
          name: user?.name || "Admin",
          email:
            user?.email ||
            form.email.trim().toLowerCase(),
          role: "admin",
          ...(user || {}),
        })
      );

      localStorage.setItem("dreamhouse_logged_in", "true");
      localStorage.setItem("dreamhouse_role", "admin");
      localStorage.setItem(
        "dreamhouse_name",
        user?.name || "Admin"
      );

      if (remember) {
        localStorage.setItem(
          "dreamhouse_remember_admin",
          "true"
        );
      } else {
        localStorage.removeItem("dreamhouse_remember_admin");
      }

      // Open admin dashboard
      navigate("/admin", { replace: true });
    } catch (err) {
      console.error("Admin login error:", err);

      // Remove invalid token after failed login
      localStorage.removeItem("dreamhouse_token");

      const message =
        err?.message ||
        "Unable to sign in. Please check your admin credentials.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f4ea] text-[#173d32]">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">

        {/* LEFT SIDE */}
        <section className="relative hidden overflow-hidden bg-[#123d31] lg:flex">

          <div className="absolute -right-32 -top-32 h-[430px] w-[430px] rounded-full border border-white/[0.08]" />
          <div className="absolute -right-16 -top-16 h-[300px] w-[300px] rounded-full border border-white/[0.06]" />
          <div className="absolute -bottom-40 -left-32 h-[500px] w-[500px] rounded-full border border-white/[0.06]" />

          <div className="absolute left-20 top-1/3 h-72 w-72 rounded-full bg-[#28745e]/20 blur-3xl" />

          <div className="relative z-10 flex w-full flex-col justify-between px-12 py-10 xl:px-20">

            {/* Logo */}
            <Link to="/" className="flex w-fit items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#08724f] shadow-lg">
                <Sparkles size={19} />
              </div>

              <div>
                <p className="font-serif text-[21px] font-semibold text-white">
                  DreamHouse
                </p>

                <p className="text-[8px] font-bold uppercase tracking-[0.22em] text-[#a8cfc0]">
                  Planner
                </p>
              </div>
            </Link>

            {/* Main Content */}
            <div className="max-w-[560px]">

              <div className="mb-5 flex items-center gap-3">
                <span className="h-[2px] w-9 bg-[#9ed0bc]" />

                <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#a8d2c1]">
                  Administration Portal
                </span>
              </div>

              <h1 className="font-serif text-[50px] leading-[1.04] tracking-[-0.045em] text-white xl:text-[62px]">
                Manage your
                <span className="block text-[#9fd0bc]">
                  planning platform.
                </span>
              </h1>

              <p className="mt-6 max-w-[500px] text-[14px] leading-7 text-[#c6d9d2]">
                Access the DreamHouse administration workspace to manage
                users, projects, AI usage, reports and platform settings
                from one secure place.
              </p>

              <div className="mt-8 flex w-fit items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 backdrop-blur-sm">

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                  <ShieldCheck
                    size={17}
                    className="text-[#a9d3c0]"
                  />
                </div>

                <div>
                  <p className="text-[11px] font-bold text-white">
                    Secure Admin Access
                  </p>

                  <p className="mt-0.5 text-[9px] text-[#9db8ae]">
                    Authorized personnel only
                  </p>
                </div>

              </div>
            </div>

            {/* Bottom */}
            <div className="flex items-center justify-between border-t border-white/10 pt-5">

              <p className="text-[9px] uppercase tracking-[0.15em] text-[#91aea4]">
                DreamHouse Planner
              </p>

              <p className="text-[9px] text-[#91aea4]">
                Admin Portal
              </p>

            </div>

          </div>
        </section>

        {/* RIGHT SIDE */}
        <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:px-12">

          <div className="w-full max-w-[470px]">

            {/* Mobile Logo */}
            <div className="mb-10 flex items-center justify-between lg:hidden">

              <Link
                to="/"
                className="flex items-center gap-2.5"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#08724f] text-white">
                  <Sparkles size={17} />
                </div>

                <div>
                  <p className="font-serif text-[19px] font-semibold text-[#173d32]">
                    DreamHouse
                  </p>

                  <p className="text-[7px] font-bold uppercase tracking-[0.2em] text-[#75877f]">
                    Planner
                  </p>
                </div>
              </Link>

            </div>

            {/* Login Header */}
            <div className="mb-8">

              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-[15px] bg-[#e5eee9] text-[#08724f]">
                <LockKeyhole size={20} />
              </div>

              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#08724f]">
                Admin Login
              </p>

              <h2 className="mt-2 font-serif text-[38px] leading-tight tracking-[-0.035em] text-[#173d32] sm:text-[43px]">
                Welcome back.
              </h2>

              <p className="mt-2 text-[13px] leading-6 text-[#77827d]">
                Sign in to access your administration dashboard.
              </p>

            </div>

            {/* FORM CARD */}
            <div className="rounded-[25px] border border-[#dfe5df] bg-white p-6 shadow-[0_20px_60px_rgba(23,61,50,0.07)] sm:p-8">

              <form onSubmit={handleSubmit}>

                {/* Email */}
                <div>

                  <label className="mb-2 block text-[11px] font-bold text-[#38574d]">
                    Admin Email
                  </label>

                  <div className="relative">

                    <Mail
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b9892]"
                    />

                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="admin@dreamhouse.com"
                      required
                      className="h-[49px] w-full rounded-xl border border-[#dce4df] bg-[#fafbf9] pl-11 pr-4 text-[13px] text-[#24483c] outline-none transition placeholder:text-[#a5aea9] focus:border-[#08724f] focus:bg-white focus:ring-4 focus:ring-[#08724f]/[0.07]"
                    />

                  </div>

                </div>

                {/* Password */}
                <div className="mt-5">

                  <div className="mb-2 flex items-center justify-between">

                    <label className="text-[11px] font-bold text-[#38574d]">
                      Password
                    </label>

                    <button
                      type="button"
                      onClick={() =>
                        setError(
                          "Please contact the system administrator to reset your password."
                        )
                      }
                      className="text-[10px] font-semibold text-[#08724f] hover:underline"
                    >
                      Forgot password?
                    </button>

                  </div>

                  <div className="relative">

                    <LockKeyhole
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b9892]"
                    />

                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                      className="h-[49px] w-full rounded-xl border border-[#dce4df] bg-[#fafbf9] pl-11 pr-12 text-[13px] text-[#24483c] outline-none transition placeholder:text-[#a5aea9] focus:border-[#08724f] focus:bg-white focus:ring-4 focus:ring-[#08724f]/[0.07]"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      className="absolute right-3 top-1/2 flex -translate-y-1/2 p-2 text-[#89958f] transition hover:text-[#08724f]"
                    >
                      {showPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>

                  </div>

                </div>

                {/* Error */}
                {error && (
                  <div className="mt-4 rounded-xl border border-[#f1cfca] bg-[#fff4f2] px-4 py-3">
                    <p className="text-[11px] font-semibold text-[#a33d32]">
                      {error}
                    </p>
                  </div>
                )}

                {/* Remember */}
                <label className="mt-5 flex cursor-pointer items-center gap-2.5">

                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) =>
                      setRemember(e.target.checked)
                    }
                    className="h-4 w-4 accent-[#08724f]"
                  />

                  <span className="text-[11px] font-medium text-[#6d7b74]">
                    Remember me
                  </span>

                </label>

                {/* Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-6 flex h-[51px] w-full items-center justify-center gap-2 rounded-xl bg-[#08724f] text-[12px] font-bold text-white shadow-[0_10px_25px_rgba(8,114,79,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#075d42] disabled:cursor-not-allowed disabled:opacity-70"
                >

                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Signing In...
                    </>
                  ) : (
                    <>
                      Sign In to Admin Panel
                      <ArrowRight size={15} />
                    </>
                  )}

                </button>

              </form>

              {/* Divider */}
              <div className="my-6 flex items-center gap-3">

                <span className="h-px flex-1 bg-[#e7ebe8]" />

                <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#a0aaa5]">
                  Secure Access
                </span>

                <span className="h-px flex-1 bg-[#e7ebe8]" />

              </div>

              {/* Security Info */}
              <div className="flex items-start gap-3 rounded-xl bg-[#f5f8f5] p-3.5">

                <ShieldCheck
                  size={16}
                  className="mt-0.5 shrink-0 text-[#08724f]"
                />

                <p className="text-[10px] leading-5 text-[#718079]">
                  This area is restricted to authorized administrators.
                  Keep your login credentials private.
                </p>

              </div>

            </div>

            {/* Back */}
            <Link
              to="/"
              className="mx-auto mt-7 flex w-fit items-center gap-2 text-[11px] font-semibold text-[#718079] transition hover:text-[#08724f]"
            >
              <ArrowLeft size={14} />
              Back to DreamHouse
            </Link>

          </div>

        </section>

      </div>
    </div>
  );
}
