import { useEffect, useState } from "react";
import {
  Link,
  useSearchParams,
} from "react-router-dom";
import { authApi } from "../services/api";

export default function VerifyEmail() {
  const [params] =
    useSearchParams();

  const token =
    params.get("token") || "";

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  useEffect(() => {
    async function verify() {
      if (!token) {
        setError(
          "Verification token is missing."
        );

        setLoading(false);
        return;
      }

      try {
        const data =
          await authApi.verifyEmail(
            token
          );

        setMessage(
          data?.message ||
            "Email verified successfully."
        );
      } catch (err) {
        setError(
          err?.message ||
            "Email verification failed."
        );
      } finally {
        setLoading(false);
      }
    }

    verify();
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center">
        <h1 className="text-3xl font-black">
          Email Verification
        </h1>

        {loading && (
          <p className="text-slate-400 mt-5">
            Verifying your email...
          </p>
        )}

        {message && (
          <>
            <p className="text-emerald-300 mt-5">
              {message}
            </p>

            <Link
              to="/login"
              className="inline-block mt-6 text-cyan-400"
            >
              Continue to Login
            </Link>
          </>
        )}

        {error && (
          <>
            <p className="text-red-300 mt-5">
              {error}
            </p>

            <Link
              to="/register"
              className="inline-block mt-6 text-cyan-400"
            >
              Back to Register
            </Link>
          </>
        )}
      </div>
    </div>
  );
}