import { useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      const response = await apiRequest(
        "/auth/forgot-password",
        {
          method: "POST",
          body: JSON.stringify({
            email: normalizedEmail,
          }),
        }
      );

      setMessage(
        response.message ||
          "If an account with that email exists, a password reset link has been sent."
      );

      setEmail("");
    } catch (err) {
      setError(
        err.message ||
          "Unable to send the reset link. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7f5] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-[430px]">

        {/* Logo / Brand */}
        <div className="text-center mb-7">
          <Link
            to="/"
            className="inline-block text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0b5d46]"
          >
            Dream House Planner
          </Link>

          <p className="mt-2 text-sm text-gray-500">
            Design your dream home with confidence
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-[24px] shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-gray-100 p-6 sm:p-8">

          {/* Icon */}
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e8f3ef]">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0b5d46"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect
                x="3"
                y="5"
                width="18"
                height="14"
                rx="2"
              />
              <path d="m3 7 9 6 9-6" />
            </svg>
          </div>

          {/* Heading */}
          <div className="text-center mb-7">
            <h1 className="text-2xl font-bold text-gray-900">
              Forgot your password?
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Enter your email address and we'll send you a
              secure link to reset your password.
            </p>
          </div>

          {/* Success */}
          {message && (
            <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm leading-5 text-green-700">
              {message}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-600">
              {error}
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div>
              <label
                htmlFor="forgot-email"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Email Address
              </label>

              <input
                id="forgot-email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="Enter your email"
                autoComplete="email"
                disabled={loading}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#0b5d46] focus:bg-white focus:ring-4 focus:ring-[#0b5d46]/10 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#0b5d46] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#0b5d46]/20 transition hover:bg-[#084b39] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Sending reset link...
                </span>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm font-semibold text-[#0b5d46] transition hover:underline"
            >
              ← Back to Login
            </Link>
          </div>
        </div>

        {/* Footer text */}
        <p className="mt-6 text-center text-xs text-gray-400">
          Your account security is important to us.
        </p>
      </div>
    </div>
  );
}