import { useEffect, useState } from "react";
import { adminApi } from "../../services/api";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await adminApi.users();

      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const changeRole = async (id, role) => {
    try {
      setUpdating(id);
      setError("");

      await adminApi.setRole(id, role);

      await loadUsers();
    } catch (err) {
      setError(err?.message || "Failed to update user role.");
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-28 px-6 pb-16">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <p className="text-cyan-400 text-sm font-bold uppercase tracking-wider">
              TEXVERSE ADMIN
            </p>

            <h1 className="text-4xl md:text-5xl font-black mt-1">
              Users & Roles
            </h1>

            <p className="text-slate-400 mt-3">
              Manage registered users and their marketplace roles.
            </p>
          </div>

          <button
            type="button"
            onClick={loadUsers}
            disabled={loading}
            className="px-5 py-3 rounded-xl border border-slate-700 bg-slate-900 hover:border-cyan-500/50 transition disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
            {error}
          </div>
        )}

        {/* Security */}
        <div className="mt-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-bold">
                🔐 Admin API Protected
              </h2>

              <p className="text-slate-400 text-sm mt-1">
                User management is performed through secured backend APIs.
              </p>
            </div>

            <span className="text-emerald-400 text-sm font-bold">
              SECURE
            </span>
          </div>
        </div>

        {/* Users */}
        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden">

          <div className="p-6 border-b border-slate-800">
            <h2 className="text-2xl font-black">
              Registered Users
            </h2>

            <p className="text-slate-500 mt-1">
              {users.length} user{users.length === 1 ? "" : "s"} found
            </p>
          </div>

          {loading ? (
            <div className="p-10 text-center text-slate-400">
              Loading users...
            </div>
          ) : users.length === 0 ? (
            <div className="p-10 text-center text-slate-400">
              No users found.
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {users.map((user) => {
                const role = String(user.role || "buyer").toLowerCase();

                return (
                  <div
                    key={user.id}
                    className="p-5 hover:bg-slate-800/30 transition"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                      {/* User info */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700 grid place-items-center font-black text-cyan-400">
                            {(user.full_name || "U")
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>
                            <h3 className="font-bold text-lg">
                              {user.full_name || "Unnamed User"}
                            </h3>

                            <p className="text-slate-400 text-sm break-all">
                              {user.email}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-4 text-xs">
                          <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300">
                            ID: {user.id}
                          </span>

                          {user.company_name && (
                            <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300">
                              {user.company_name}
                            </span>
                          )}

                          {user.city && (
                            <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300">
                              {user.city}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Role */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">

                        <span
                          className={`px-3 py-2 rounded-full text-xs font-bold border text-center ${
                            role === "admin"
                              ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                              : role === "supplier"
                              ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                              : role === "shipping"
                              ? "bg-orange-500/10 text-orange-400 border-orange-500/20"
                              : "bg-slate-800 text-slate-300 border-slate-700"
                          }`}
                        >
                          {role.toUpperCase()}
                        </span>

                        <select
                          value={role}
                          disabled={updating === user.id}
                          onChange={(e) =>
                            changeRole(user.id, e.target.value)
                          }
                          className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500 disabled:opacity-50"
                        >
                          <option value="buyer">Buyer</option>
                          <option value="supplier">Supplier</option>
                          <option value="shipping">Shipping</option>
                          <option value="admin">Admin</option>
                        </select>

                        {updating === user.id && (
                          <span className="text-xs text-slate-500">
                            Updating...
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Back */}
        <button
          type="button"
          onClick={() => window.history.back()}
          className="mt-6 text-cyan-400 hover:text-cyan-300 text-sm font-semibold"
        >
          ← Back to Admin Dashboard
        </button>
      </div>
    </div>
  );
}

