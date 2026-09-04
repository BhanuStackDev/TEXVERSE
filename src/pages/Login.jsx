import { useMemo, useState } from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  LogIn,
  ShieldCheck,
} from "lucide-react";

import { authApi } from "../services/api";

import { useI18n } from "../i18n/i18n";

import WelcomeGreeting from "../components/WelcomeGreeting";

import {
  getLoginGreeting,
} from "../i18n/greetings";

export default function Login() {
  const navigate =
    useNavigate();

  const location =
    useLocation();

  const {
    language,
    setLanguage,
  } = useI18n();

  const [
    form,
    setForm,
  ] = useState({
    email: "",
    password: "",
  });

  const [
    error,
    setError,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const greeting =
    useMemo(
      () =>
        getLoginGreeting({
          language,
          returningUser:
            true,
        }),
      [language]
    );

  function getDashboardPath(
    role
  ) {
    switch (
      String(
        role || ""
      ).toLowerCase()
    ) {
      case "buyer":
        return "/buyer";

      case "supplier":
        return "/supplier";

      case "admin":
        return "/admin";

      case "shipping":
        return "/shipping";

      default:
        return null;
    }
  }

  function change(event) {
    const {
      name,
      value,
    } = event.target;

    setForm(
      (
        previous
      ) => ({
        ...previous,
        [name]: value,
      })
    );
  }

  async function submit(
    event
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data =
        await authApi.login(
          form
        );

      if (
        !data?.access_token ||
        !data?.user
      ) {
        throw new Error(
          "Invalid login response from server."
        );
      }

      const role =
        String(
          data.user.role ||
            ""
        ).toLowerCase();

      const dashboardPath =
        getDashboardPath(
          role
        );

      if (!dashboardPath) {
        throw new Error(
          "Your account does not have a valid TEXVERSE role."
        );
      }

      /*
       * Save JWT and current user.
       */
      localStorage.setItem(
        "texverse_token",
        data.access_token
      );

      localStorage.setItem(
        "texverse_user",
        JSON.stringify(
          data.user
        )
      );

      /*
       * Sync account language into
       * the global i18n system when
       * backend provides one.
       */
      if (data.user?.language) {
        setLanguage(data.user.language);
      }

      window.dispatchEvent(
        new Event(
          "texverse-auth-change"
        )
      );

      window.dispatchEvent(
        new CustomEvent(
          "texverse-auth-greeting",
          {
            detail: {
              type: "login",
              user: data.user,
            },
          }
        )
      );

      const requestedPath =
        location.state?.from;

      const roleAllowedPath =
        role === "buyer"
          ? requestedPath ===
              "/cart" ||
            requestedPath ===
              "/checkout" ||
            requestedPath ===
              "/payment" ||
            requestedPath ===
              "/success" ||
            requestedPath ===
              "/buyer" ||
            requestedPath ===
              "/buyer-dashboard"
          : role ===
            "supplier"
          ? requestedPath ===
              "/supplier" ||
            requestedPath ===
              "/supplier-dashboard"
          : role ===
            "shipping"
          ? requestedPath ===
              "/shipping" ||
            requestedPath ===
              "/shipping-dashboard"
          : role === "admin"
          ? requestedPath?.startsWith(
              "/admin"
            )
          : false;

      navigate(
        roleAllowedPath
          ? requestedPath
          : dashboardPath,
        {
          replace: true,
        }
      );
    } catch (err) {
      setError(
        err?.message ||
          "Login failed."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-24 text-white sm:px-6">
      <div className="w-full max-w-md">
        <WelcomeGreeting
          greeting={greeting}
        />

        <form
          onSubmit={submit}
          className="w-full rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl sm:p-8"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400">
            <LogIn size={26} />
          </div>

          <h1 className="mt-5 text-center text-3xl font-bold sm:text-4xl">
            Welcome Back
          </h1>

          <p className="mt-3 text-center text-slate-400">
            Sign in to your
            TEXVERSE account
          </p>

          {error && (
            <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <input
            required
            type="email"
            name="email"
            value={form.email}
            onChange={change}
            autoComplete="email"
            placeholder="Business email"
            className="mt-7 w-full rounded-xl border border-slate-700 bg-slate-800 p-4 text-white outline-none placeholder:text-slate-500 focus:border-cyan-400"
          />

          <input
            required
            minLength={8}
            type="password"
            name="password"
            value={form.password}
            onChange={change}
            autoComplete="current-password"
            placeholder="Password"
            className="mt-4 w-full rounded-xl border border-slate-700 bg-slate-800 p-4 text-white outline-none placeholder:text-slate-500 focus:border-cyan-400"
          />

          <div className="mt-3 text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-cyan-400 hover:text-cyan-300"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-cyan-500 py-4 font-bold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Signing in..."
              : "Sign In"}
          </button>

          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-500">
            <ShieldCheck
              size={14}
            />
            Secure JWT authentication
          </div>

          <p className="mt-6 text-center text-slate-400">
            New to TEXVERSE?

            <Link
              to="/register"
              className="ml-1 text-cyan-400 hover:text-cyan-300"
            >
              Create account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}