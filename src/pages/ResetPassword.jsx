import { useState } from "react";
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { authApi } from "../services/api";

export default function ResetPassword() {
  const [params] =
    useSearchParams();

  const navigate =
    useNavigate();

  const token =
    params.get("token") || "";

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function submit(event) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!token) {
      setError(
        "Password reset token is missing."
      );
      return;
    }

    if (password.length < 8) {
      setError(
        "Password must be at least 8 characters."
      );
      return;
    }

    if (
      password !==
      confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    try {
      setLoading(true);

      await authApi.resetPassword(
        token,
        password
      );

      setMessage(
        "Password reset successfully. Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      setError(
        err?.message ||
          "Unable to reset password."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6 py-24">
      <form
        onSubmit={submit}
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8"
      >
        <h1 className="text-3xl font-black">
          Set New Password
        </h1>

        <p className="text-slate-400 mt-3">
          Create a new secure password for your account.
        </p>

        {error && (
          <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-red-300">
            {error}
          </div>
        )}

        {message && (
          <div className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-emerald-300">
            {message}
          </div>
        )}

        <input
          required
          minLength={8}
          type="password"
          value={password}
          onChange={(event) =>
            setPassword(
              event.target.value
            )
          }
          placeholder="New password"
          className="mt-7 w-full bg-slate-800 border border-slate-700 p-4 rounded-xl outline-none focus:border-cyan-400"
        />

        <input
          required
          minLength={8}
          type="password"
          value={confirmPassword}
          onChange={(event) =>
            setConfirmPassword(
              event.target.value
            )
          }
          placeholder="Confirm password"
          className="mt-4 w-full bg-slate-800 border border-slate-700 p-4 rounded-xl outline-none focus:border-cyan-400"
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full bg-cyan-500 text-slate-950 py-4 rounded-xl font-bold disabled:opacity-50"
        >
          {loading
            ? "Updating..."
            : "Update Password"}
        </button>

        <p className="text-center mt-6">
          <Link
            to="/login"
            className="text-cyan-400"
          >
            Back to Login
          </Link>
        </p>
      </form>
    </div>
  );
}