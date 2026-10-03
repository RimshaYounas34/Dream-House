
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import loginFloorplan from "../assets/login-floorplan.jpg";

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

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
      JSON.parse(
        localStorage.getItem("dreamhouse_users")
      ) || [];

    const cleanEmail = email.trim().toLowerCase();

    const emailExists = existingUsers.some(
      (user) =>
        user.email?.toLowerCase() === cleanEmail
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
      JSON.stringify([
        ...existingUsers,
        newUser,
      ])
    );

    localStorage.setItem(
      "dreamhouse_name",
      newUser.name
    );

    localStorage.setItem(
      "dreamhouse_email",
      newUser.email
    );

    localStorage.setItem(
      "dreamhouse_password",
      newUser.password
    );

    localStorage.setItem(
      "dreamhouse_role",
      "User"
    );

    localStorage.setItem(
      "dreamhouse_logged_in",
      "true"
    );

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

      const result = await signInWithPopup(
        auth,
        provider
      );

      const user = result.user;

      const existingUsers =
        JSON.parse(
          localStorage.getItem("dreamhouse_users")
        ) || [];

      const cleanEmail =
        user.email?.toLowerCase();

      const existingUser = existingUsers.find(
        (item) =>
          item.email?.toLowerCase() === cleanEmail
      );

      if (!existingUser) {
        const newUser = {
          id: Date.now(),
          name:
            user.displayName ||
            "Google User",
          email: user.email || "",
          role: "User",
          status: "Active",
          projects: 0,
          lastLogin:
            new Date().toLocaleDateString(),
          joined:
            new Date().toLocaleDateString(),
          authProvider: "Google",
          photoURL:
            user.photoURL || "",
        };

        localStorage.setItem(
          "dreamhouse_users",
          JSON.stringify([
            ...existingUsers,
            newUser,
          ])
        );
      } else {
        const updatedUsers =
          existingUsers.map((item) =>
            item.email?.toLowerCase() ===
            cleanEmail
              ? {
                  ...item,
                  lastLogin:
                    new Date().toLocaleDateString(),
                  status: "Active",
                  photoURL:
                    user.photoURL ||
                    item.photoURL ||
                    "",
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
        user.displayName ||
          "Google User"
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

      alert("Google sign-in successful!");

      navigate("/dashboard");
    } catch (error) {
      console.error(
        "Google Sign-In Error:",
        error
      );

      if (
        error.code ===
        "auth/popup-closed-by-user"
      ) {
        return;
      }

      if (
        error.code ===
        "auth/popup-blocked"
      ) {
        alert(
          "Google popup was blocked by your browser. Please allow popups and try again."
        );
        return;
      }

      if (
        error.code ===
        "auth/unauthorized-domain"
      ) {
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
    <div className="min-h-screen bg-[#f6f5ef] text-[#173d32]">

      <div className="grid min-h-screen lg:grid-cols-[1.08fr_0.92fr]">

        {/* =====================================================
            LEFT IMAGE PANEL
        ====================================================== */}
        <section className="relative hidden min-h-screen overflow-hidden bg-[#173d32] lg:flex">

          {/* Your Image */}
          <img
            src={loginFloorplan}
            alt="Dream House Floor Plan"
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* Elegant Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#102e27]/85 via-[#173d32]/45 to-black/30" />

          {/* Decorative glow */}
          <div className="absolute -left-28 top-24 h-80 w-80 rounded-full bg-[#dce9dc]/10 blur-3xl" />

          <div className="absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-[#dce9dc]/10 blur-3xl" />


          {/* Logo */}
          <div className="relative z-10 flex min-h-screen w-full flex-col justify-between p-10 xl:p-14">

            <Link
              to="/"
              className="flex w-fit items-center gap-3 text-white"
            >

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md">

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

                <p className="text-[9px] uppercase tracking-[0.28em] text-white/60">
                  Planner
                </p>

              </div>

            </Link>


            {/* Center content */}
            <div className="max-w-[520px]">

              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-lg">

                <span className="h-1.5 w-1.5 rounded-full bg-[#dce9dc]" />

                <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-white/90">
                  Start Your Journey
                </span>

              </div>


              <h1 className="font-serif text-[45px] leading-[1.06] text-white sm:text-[50px] xl:text-[60px]">

                Your dream home
                <br />

                <span className="text-[#dce9dc]">
                  starts with a plan.
                </span>

              </h1>


              <p className="mt-6 max-w-[440px] text-[13px] leading-7 text-white/75">
                Create personalized floor plans, organize
                your spaces, and explore your future home
                with smart 2D, 3D and AI-powered tools.
              </p>


              {/* Feature cards */}
              <div className="mt-9 grid max-w-[450px] grid-cols-3 gap-2.5">

                <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">

                  <div className="mb-2 font-serif text-2xl text-white">
                    2D
                  </div>

                  <p className="text-[9px] uppercase tracking-wider text-white/55">
                    Floor Plans
                  </p>

                </div>


                <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">

                  <div className="mb-2 font-serif text-2xl text-white">
                    3D
                  </div>

                  <p className="text-[9px] uppercase tracking-wider text-white/55">
                    Visualization
                  </p>

                </div>


                <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">

                  <div className="mb-2 font-serif text-2xl text-white">
                    AI
                  </div>

                  <p className="text-[9px] uppercase tracking-wider text-white/55">
                    Smart Planning
                  </p>

                </div>

              </div>


              {/* Bottom architectural card */}
              <div className="mt-8 flex w-fit items-center gap-3 rounded-2xl border border-white/15 bg-black/15 px-4 py-3 backdrop-blur-md">

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">

                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 19V7l8-4 8 4v12" />
                    <path d="M8 19v-5h8v5" />
                    <path d="M8 10h8" />
                  </svg>

                </div>

                <div>

                  <p className="text-xs font-medium text-white">
                    Design around your lifestyle.
                  </p>

                  <p className="mt-0.5 text-[10px] text-white/50">
                    Every room starts with your idea.
                  </p>

                </div>

              </div>

            </div>


            {/* Bottom */}
            <div className="flex items-center justify-between">

              <p className="text-[9px] uppercase tracking-[0.25em] text-white/45">
                Imagine • Plan • Create
              </p>

              <div className="h-px w-20 bg-white/20" />

            </div>

          </div>

        </section>


        {/* =====================================================
            RIGHT SIGNUP PANEL
        ====================================================== */}
        <section className="flex min-h-screen items-center justify-center px-5 py-7 sm:px-8 lg:px-12 xl:px-16">

          <div className="w-full max-w-[430px]">

            {/* Mobile Logo */}
            <Link
              to="/"
              className="mb-6 flex items-center gap-3 lg:hidden"
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

                <p className="font-serif text-lg font-semibold">
                  DreamHouse
                </p>

                <p className="text-[9px] uppercase tracking-[0.2em] text-[#71837b]">
                  Planner
                </p>

              </div>

            </Link>


            {/* Heading */}
            <div className="mb-6">

              <div className="mb-3 flex items-center gap-2">

                <span className="h-1.5 w-1.5 rounded-full bg-[#173d32]" />

                <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#71827b]">
                  Get Started
                </span>

              </div>

              <h2 className="font-serif text-[32px] leading-tight text-[#173d32] sm:text-[36px]">
                Create your account
              </h2>

              <p className="mt-2 text-[12px] leading-6 text-[#78847e]">
                Start planning your dream home with
                powerful design tools.
              </p>

            </div>


            {/* Signup Card */}
            <div className="rounded-[26px] border border-[#dfe4dd] bg-white p-6 shadow-[0_22px_65px_rgba(23,61,50,0.08)] sm:p-7">

              {/* Google */}
              <button
                type="button"
                onClick={handleGoogleSignup}
                disabled={googleLoading || loading}
                className="group flex w-full items-center justify-center gap-3 rounded-xl border border-[#d8ddd7] bg-white px-5 py-3.5 text-[12px] font-semibold text-[#29463c] transition-all duration-200 hover:border-[#173d32] hover:bg-[#fafbf8] hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
              >

                {googleLoading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#173d32]/30 border-t-[#173d32]" />

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
              <div className="my-5 flex items-center gap-3">

                <div className="h-px flex-1 bg-[#e1e4df]" />

                <span className="text-[8px] font-medium uppercase tracking-[0.16em] text-[#929b96]">
                  or email
                </span>

                <div className="h-px flex-1 bg-[#e1e4df]" />

              </div>


              {/* Form */}
              <form
                onSubmit={handleSignup}
                className="space-y-3.5"
              >

                {/* Name */}
                <div>

                  <label className="mb-1.5 block text-[9px] font-bold uppercase tracking-[0.13em] text-[#53645d]">
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
                    className="w-full rounded-xl border border-[#d8ddd7] bg-[#fcfcfa] px-4 py-3 text-[12px] text-[#173d32] outline-none transition placeholder:text-[#a3aca7] focus:border-[#173d32] focus:bg-white focus:ring-4 focus:ring-[#173d32]/5 disabled:opacity-60"
                  />

                </div>


                {/* Email */}
                <div>

                  <label className="mb-1.5 block text-[9px] font-bold uppercase tracking-[0.13em] text-[#53645d]">
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
                    className="w-full rounded-xl border border-[#d8ddd7] bg-[#fcfcfa] px-4 py-3 text-[12px] text-[#173d32] outline-none transition placeholder:text-[#a3aca7] focus:border-[#173d32] focus:bg-white focus:ring-4 focus:ring-[#173d32]/5 disabled:opacity-60"
                  />

                </div>


                {/* Password */}
                <div>

                  <label className="mb-1.5 block text-[9px] font-bold uppercase tracking-[0.13em] text-[#53645d]">
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
                        setPassword(
                          e.target.value
                        )
                      }
                      placeholder="Create a password"
                      disabled={loading}
                      autoComplete="new-password"
                      className="w-full rounded-xl border border-[#d8ddd7] bg-[#fcfcfa] px-4 py-3 pr-16 text-[12px] text-[#173d32] outline-none transition placeholder:text-[#a3aca7] focus:border-[#173d32] focus:bg-white focus:ring-4 focus:ring-[#173d32]/5 disabled:opacity-60"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          !showPassword
                        )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-bold text-[#71827b] hover:text-[#173d32]"
                    >
                      {showPassword
                        ? "Hide"
                        : "Show"}
                    </button>

                  </div>

                </div>


                {/* Confirm Password */}
                <div>

                  <label className="mb-1.5 block text-[9px] font-bold uppercase tracking-[0.13em] text-[#53645d]">
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
                      className="w-full rounded-xl border border-[#d8ddd7] bg-[#fcfcfa] px-4 py-3 pr-16 text-[12px] text-[#173d32] outline-none transition placeholder:text-[#a3aca7] focus:border-[#173d32] focus:bg-white focus:ring-4 focus:ring-[#173d32]/5 disabled:opacity-60"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          !showConfirmPassword
                        )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-bold text-[#71827b] hover:text-[#173d32]"
                    >
                      {showConfirmPassword
                        ? "Hide"
                        : "Show"}
                    </button>

                  </div>

                </div>


                {/* Terms */}
                <p className="pt-1 text-[9px] leading-5 text-[#7d8983]">

                  By creating an account, you agree to our{" "}

                  <button
                    type="button"
                    className="font-semibold text-[#315b4d] hover:underline"
                  >
                    Terms
                  </button>

                  {" "}and{" "}

                  <button
                    type="button"
                    className="font-semibold text-[#315b4d] hover:underline"
                  >
                    Privacy Policy
                  </button>

                  .

                </p>


                {/* Create Account */}
                <button
                  type="submit"
                  disabled={
                    loading ||
                    googleLoading
                  }
                  className="group mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-[#173d32] px-5 py-3.5 text-[12px] font-semibold text-white shadow-[0_8px_20px_rgba(23,61,50,0.14)] transition-all duration-200 hover:bg-[#0d5946] hover:shadow-[0_12px_25px_rgba(23,61,50,0.18)] disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                      Creating account...
                    </>
                  ) : (
                    <>
                      Create Account

                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="transition-transform group-hover:translate-x-1"
                      >
                        <path d="M5 12h14" />
                        <path d="m13 6 6 6-6 6" />
                      </svg>
                    </>
                  )}

                </button>

              </form>


              {/* Login */}
              <div className="mt-5 rounded-xl border border-[#e0e4de] bg-[#f8f9f5] px-4 py-3.5 text-center">

                <p className="text-[10px] text-[#78847e]">

                  Already have an account?{" "}

                  <Link
                    to="/login"
                    className="font-bold text-[#0b5d46] hover:underline"
                  >
                    Log in
                  </Link>

                </p>

              </div>

            </div>


            {/* Footer */}
            <p className="mt-4 text-center text-[9px] leading-5 text-[#929b96]">
              Secure account creation · DreamHouse Planner
            </p>

          </div>

        </section>

      </div>

    </div>
  );
}
