import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import { authApi } from "../services/api";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const data = await authApi.forgotPassword(
        email.trim()
      );

      if (!data?.reset_token) {
        throw new Error(
          "Password reset token was not generated."
        );
      }

      /*
       * DEMO RESET FLOW
       *
       * Backend generates the reset token.
       * For demo mode we directly redirect the
       * user to the password reset page.
       *
       * Later, when SMTP/email is enabled,
       * this will be replaced by an email-based flow.
       */
      navigate(
        `/reset-password?token=${encodeURIComponent(
          data.reset_token
        )}`,
        {
          replace: true,
        }
      );
    } catch (err) {
      setError(
        err?.message ||
          "Unable to create password reset request."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6 py-24">
      <form
        onSubmit={submit}
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl"
      >
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
            <span className="text-2xl">
              🔐
            </span>
          </div>

          <h1 className="text-3xl font-black mt-5">
            Forgot Password
          </h1>

          <p className="text-slate-400 mt-3">
            Enter the email registered with your
            TEXVERSE account.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Email */}
        <input
          required
          type="email"
          value={email}
          onChange={(event) =>
            setEmail(event.target.value)
          }
          autoComplete="email"
          placeholder="Business email"
          className="mt-7 w-full bg-slate-800 border border-slate-700 p-4 rounded-xl outline-none focus:border-cyan-400 transition"
        />

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full bg-cyan-500 text-slate-950 py-4 rounded-xl font-bold hover:bg-cyan-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? "Preparing Reset..."
            : "Reset Password"}
        </button>

        {/* Back */}
        <p className="text-center mt-6">
          <Link
            to="/login"
            className="text-cyan-400 hover:text-cyan-300 transition"
          >
            ← Back to Login
          </Link>
        </p>

        {/* Demo notice */}
        <div className="mt-6 pt-5 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-500">
            Demo password recovery is enabled.
          </p>
        </div>
      </form>
    </div>
  );
}