import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { apiRequest } from "../services/api";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSuccess("");
    setError("");

    if (!token) {
      setError(
        "This password reset link is invalid or incomplete."
      );
      return;
    }

    if (!password || !confirmPassword) {
      setError("Please enter your new password.");
      return;
    }

    if (password.length < 8) {
      setError(
        "Password must be at least 8 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await apiRequest(
        "/auth/reset-password",
        {
          method: "POST",
          body: JSON.stringify({
            token,
            password,
          }),
        }
      );

      setSuccess(
        response.message ||
          "Your password has been reset successfully."
      );

      setPassword("");
      setConfirmPassword("");

      // Give the user a moment to see the success message.
      setTimeout(() => {
        navigate("/login", {
          replace: true,
          state: {
            message:
              "Password reset successfully. Please log in with your new password.",
          },
        });
      }, 1800);
    } catch (err) {
      setError(
        err.message ||
          "Unable to reset your password. The link may have expired."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7f5] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-[430px]">

        {/* Brand */}
        <div className="text-center mb-7">
          <Link
            to="/"
            className="inline-block text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0b5d46]"
          >
            Dream House Planner
          </Link>

          <p className="mt-2 text-sm text-gray-500">
            Create a secure new password
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-[24px] shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-gray-100 p-6 sm:p-8">

          {/* Lock Icon */}
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
                x="4"
                y="10"
                width="16"
                height="11"
                rx="2"
              />

              <path d="M8 10V7a4 4 0 0 1 8 0v3" />

              <circle
                cx="12"
                cy="15.5"
                r="1"
              />
            </svg>
          </div>

          {/* Heading */}
          <div className="text-center mb-7">
            <h1 className="text-2xl font-bold text-gray-900">
              Create new password
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Choose a strong password for your
              Dream House Planner account.
            </p>
          </div>

          {/* Success */}
          {success && (
            <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm leading-5 text-green-700">
              {success}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-600">
              {error}
            </div>
          )}

          {!token ? (
            <div className="text-center">
              <p className="mb-5 text-sm leading-6 text-gray-500">
                This reset link is missing or invalid.
                Please request a new password reset link.
              </p>

              <Link
                to="/forgot-password"
                className="inline-flex w-full items-center justify-center rounded-xl bg-[#0b5d46] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#084b39]"
              >
                Request New Reset Link
              </Link>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* New Password */}
              <div>
                <label
                  htmlFor="new-password"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  New Password
                </label>

                <input
                  id="new-password"
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Enter new password"
                  autoComplete="new-password"
                  disabled={loading}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#0b5d46] focus:bg-white focus:ring-4 focus:ring-[#0b5d46]/10 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <p className="mt-2 text-xs text-gray-400">
                  Minimum 8 characters
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirm-password"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Confirm New Password
                </label>

                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                  disabled={loading}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#0b5d46] focus:bg-white focus:ring-4 focus:ring-[#0b5d46]/10 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#0b5d46] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#0b5d46]/20 transition hover:bg-[#084b39] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Updating password...
                  </span>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          )}

          {/* Login */}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm font-semibold text-[#0b5d46] transition hover:underline"
            >
              ← Back to Login
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          Keep your password private and secure.
        </p>
      </div>
    </div>
  );
}