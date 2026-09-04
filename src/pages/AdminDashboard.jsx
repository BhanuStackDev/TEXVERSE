import WorkspaceWelcome from "../components/WorkspaceWelcome";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  Boxes,
  CheckCircle2,
  Clock3,
  LogOut,
  Package,
  RefreshCw,
  ShieldCheck,
  ShoppingCart,
  Truck,
  Users,
  UserCheck,
  UserCog,
  MessageSquare,
} from "lucide-react";
import {
  adminApi,
  getStoredUser,
  logout,
} from "../services/api";

const modules = [
  {
    title: "Users & Roles",
    description:
      "Manage users, accounts and marketplace roles.",
    path: "/admin/users",
    icon: Users,
  },
  {
    title: "Products & Verification",
    description:
      "Review, verify and manage supplier products.",
    path: "/admin/products",
    icon: Package,
  },
  {
    title: "Orders & Payments",
    description:
      "Monitor orders and payment transactions.",
    path: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    title: "Shipping",
    description:
      "Manage shipments, tracking and delivery.",
    path: "/admin/shipping",
    icon: Truck,
  },
  {
    title: "Vehicles & Delivery Staff",
    description:
      "Manage delivery vehicles and staff.",
    path: "/admin/vehicles",
    icon: Boxes,
  },
  {
    title: "Negotiations & Support",
    description:
      "Manage buyer negotiations and support tickets.",
    path: "/admin/support",
    icon: MessageSquare,
  },
];

const emptyOverview = {
  users: 0,
  buyers: 0,
  suppliers: 0,
  products: 0,
  pending_products: 0,
  orders: 0,
};

function getNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => getStoredUser());
  const [overview, setOverview] = useState(emptyOverview);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadOverview = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const [overviewData] = await Promise.all([
        adminApi.overview(),
      ]);

      setOverview({
        users: getNumber(overviewData?.users),
        buyers: getNumber(overviewData?.buyers),
        suppliers: getNumber(overviewData?.suppliers),
        products: getNumber(overviewData?.products),
        pending_products: getNumber(
          overviewData?.pending_products
        ),
        orders: getNumber(overviewData?.orders),
      });

      const storedUser = getStoredUser();

      if (storedUser) {
        setUser(storedUser);
      }
    } catch (err) {
      console.error("Admin overview error:", err);

      setError(
        err?.message ||
          "Unable to load the admin overview."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadOverview();
  }, []);

  const handleModuleClick = (module) => {
    navigate(module.path);
  };

  const handleLogout = () => {
    logout();

    navigate("/login", {
      replace: true,
    });
  };

  const stats = [
    {
      label: "Total Users",
      value: overview.users,
      description: "Registered marketplace users",
      icon: Users,
    },
    {
      label: "Buyers",
      value: overview.buyers,
      description: "Active buyer accounts",
      icon: UserCheck,
    },
    {
      label: "Suppliers",
      value: overview.suppliers,
      description: "Registered supplier accounts",
      icon: UserCog,
    },
    {
      label: "Products",
      value: overview.products,
      description: "Products in the catalog",
      icon: Package,
    },
    {
      label: "Pending Products",
      value: overview.pending_products,
      description: "Waiting for verification",
      icon: Clock3,
    },
    {
      label: "Orders",
      value: overview.orders,
      description: "Marketplace orders",
      icon: ShoppingCart,
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white pt-28 px-6 pb-16">
      <div className="max-w-7xl mx-auto">
        <WorkspaceWelcome role="Admin" />

        {/* HEADER */}
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

          <div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-black">
                TX
              </span>

              <div>
                <p className="text-cyan-400 text-sm font-semibold uppercase tracking-wider">
                  TEXVERSE
                </p>

                <h1 className="text-4xl md:text-5xl font-black">
                  Admin Control Center
                </h1>
              </div>
            </div>

            <p className="text-slate-400 mt-4 max-w-3xl">
              Monitor and manage the TEXVERSE textile
              marketplace through backend-protected
              administration modules.
            </p>
          </div>

          {/* ADMIN PROFILE */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 min-w-65">

            <p className="text-xs uppercase tracking-wider text-slate-500">
              Signed in as
            </p>

            <p className="font-bold text-lg mt-1">
              {user?.full_name || "TEXVERSE Admin"}
            </p>

            <p className="text-slate-400 text-sm break-all">
              {user?.email || "admin@texverse.in"}
            </p>

            <div className="flex items-center justify-between gap-4 mt-4">

              <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                ADMIN
              </span>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition"
              >
                <LogOut size={15} />
                Sign out
              </button>

            </div>
          </div>
        </div>

        {/* SECURITY STATUS */}
        <div className="mt-10 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div className="flex items-start gap-3">
              <ShieldCheck
                size={24}
                className="text-emerald-400 mt-0.5 shrink-0"
              />

              <div>
                <h2 className="font-bold text-lg">
                  Backend Authorization Active
                </h2>

                <p className="text-slate-400 text-sm mt-1">
                  Admin access is protected by JWT
                  authentication and backend role
                  authorization.
                </p>
              </div>
            </div>

            <span className="inline-flex items-center gap-2 text-emerald-400 text-sm font-bold">
              <CheckCircle2 size={17} />
              SECURE
            </span>

          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-5">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

              <div>
                <p className="font-bold text-red-300">
                  Unable to load admin overview
                </p>

                <p className="text-sm text-red-300/80 mt-1">
                  {error}
                </p>
              </div>

              <button
                type="button"
                onClick={() => loadOverview(true)}
                disabled={refreshing}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-400/30 px-4 py-2 text-sm font-bold text-red-300 hover:bg-red-500/10 disabled:opacity-50"
              >
                <RefreshCw
                  size={16}
                  className={
                    refreshing ? "animate-spin" : ""
                  }
                />
                Retry
              </button>

            </div>
          </div>
        )}

        {/* LIVE OVERVIEW */}
        <section className="mt-10">

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-5">

            <div>
              <div className="flex items-center gap-2">
                <Activity
                  size={21}
                  className="text-cyan-400"
                />

                <h2 className="text-2xl font-black">
                  Live Marketplace Overview
                </h2>
              </div>

              <p className="text-slate-500 mt-1">
                Current data returned by the TEXVERSE
                admin API.
              </p>
            </div>

            <button
              type="button"
              onClick={() => loadOverview(true)}
              disabled={loading || refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-2 text-sm font-bold text-slate-300 hover:border-cyan-400 hover:text-cyan-400 disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={
                  refreshing ? "animate-spin" : ""
                }
              />
              Refresh
            </button>

          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">

              {Array.from({ length: 6 }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="h-36 rounded-2xl border border-slate-800 bg-slate-900 animate-pulse"
                  />
                )
              )}

            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">

              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
                  >
                    <div className="flex items-start justify-between gap-4">

                      <div>
                        <p className="text-slate-500 text-sm">
                          {stat.label}
                        </p>

                        <p className="text-4xl font-black mt-2">
                          {stat.value.toLocaleString(
                            "en-IN"
                          )}
                        </p>

                        <p className="text-slate-500 text-xs mt-2">
                          {stat.description}
                        </p>
                      </div>

                      <div className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700 grid place-items-center">
                        <Icon
                          size={21}
                          className="text-cyan-400"
                        />
                      </div>

                    </div>
                  </div>
                );
              })}

            </div>
          )}
        </section>

        {/* ATTENTION PANEL */}
        {!loading && overview.pending_products > 0 && (
          <div className="mt-8 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

              <div className="flex items-start gap-3">
                <Clock3
                  size={23}
                  className="text-amber-400 mt-0.5 shrink-0"
                />

                <div>
                  <h3 className="font-bold text-lg">
                    Products need attention
                  </h3>

                  <p className="text-slate-400 text-sm mt-1">
                    {overview.pending_products.toLocaleString(
                      "en-IN"
                    )}{" "}
                    product
                    {overview.pending_products === 1
                      ? ""
                      : "s"} currently waiting for
                    verification.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  navigate("/admin/products")
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-4 py-2 text-sm font-black text-slate-950 hover:bg-amber-300"
              >
                Review Products
                <ArrowRight size={16} />
              </button>

            </div>
          </div>
        )}

        {/* MODULES */}
        <section className="mt-10">

          <div className="flex items-end justify-between gap-4 mb-5">

            <div>
              <h2 className="text-2xl font-black">
                Administration Modules
              </h2>

              <p className="text-slate-500 mt-1">
                Select a module to continue.
              </p>
            </div>

            <span className="text-sm text-slate-500">
              {modules.length} modules
            </span>

          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

            {modules.map((module) => {
              const Icon = module.icon;

              return (
                <button
                  key={module.title}
                  type="button"
                  onClick={() =>
                    handleModuleClick(module)
                  }
                  className="group text-left rounded-2xl border border-slate-800 bg-slate-900 p-6 hover:border-cyan-500/50 hover:bg-slate-900/80 transition-all duration-200 cursor-pointer"
                >

                  <div className="flex items-start justify-between gap-4">

                    <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 grid place-items-center group-hover:bg-cyan-500/10 group-hover:border-cyan-500/30 transition">
                      <Icon
                        size={23}
                        className="text-cyan-400"
                      />
                    </div>

                    <span className="text-slate-600 group-hover:text-cyan-400 text-xl transition">
                      →
                    </span>

                  </div>

                  <h3 className="font-bold text-xl mt-5 group-hover:text-cyan-400 transition">
                    {module.title}
                  </h3>

                  <p className="text-slate-500 mt-2 leading-relaxed">
                    {module.description}
                  </p>

                  <div className="mt-5 text-sm text-cyan-500/80 group-hover:text-cyan-400">
                    Open module →
                  </div>

                </button>
              );
            })}

          </div>
        </section>

        {/* SYSTEM INFORMATION */}
        <section className="mt-10 grid md:grid-cols-3 gap-5">

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex items-center gap-3">
              <ShieldCheck
                size={20}
                className="text-emerald-400"
              />

              <p className="text-slate-500 text-sm">
                Authentication
              </p>
            </div>

            <p className="font-bold text-lg mt-3">
              JWT Protected
            </p>

            <p className="text-slate-500 text-sm mt-1">
              Secure admin session
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex items-center gap-3">
              <ShieldCheck
                size={20}
                className="text-cyan-400"
              />

              <p className="text-slate-500 text-sm">
                Authorization
              </p>
            </div>

            <p className="font-bold text-lg mt-3">
              Admin Role
            </p>

            <p className="text-slate-500 text-sm mt-1">
              Backend enforced
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex items-center gap-3">
              <Activity
                size={20}
                className="text-cyan-400"
              />

              <p className="text-slate-500 text-sm">
                Marketplace Status
              </p>
            </div>

            <p className="font-bold text-lg mt-3">
              API Connected
            </p>

            <p className="text-slate-500 text-sm mt-1">
              Overview data loaded from backend
            </p>
          </div>

        </section>

      </div>
    </main>
  );
}