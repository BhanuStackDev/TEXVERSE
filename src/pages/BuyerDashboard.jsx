import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import WorkspaceWelcome from "../components/WorkspaceWelcome";
import { orderApi, negotiationApi } from "../services/api";

export default function BuyerDashboard() {
  const [orders, setOrders] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [ordersData, quotesData] = await Promise.all([
        orderApi.mine(),
        negotiationApi.mine(),
      ]);

      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setQuotes(Array.isArray(quotesData) ? quotesData : []);
    } catch (err) {
      console.error("Buyer dashboard error:", err);
      setError(err?.message || "Failed to load buyer dashboard.");
    } finally {
      setLoading(false);
    }
  };

  const totalItems = orders.reduce((total, order) => {
    if (!Array.isArray(order?.items)) return total;

    return (
      total +
      order.items.reduce(
        (itemTotal, item) =>
          itemTotal + Number(item?.quantity || 0),
        0
      )
    );
  }, 0);

  const formatDate = (date) => {
    if (!date) return "—";

    try {
      return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "—";
    }
  };

  const formatPrice = (price) => {
    const value = Number(price);

    if (!Number.isFinite(value)) return "0";

    return value.toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    });
  };

  const getOrderTotal = (order) =>
    order?.total_amount ??
    order?.total ??
    order?.amount ??
    0;

  const getQuoteName = (quote, index) =>
    quote?.product_name ||
    quote?.product?.name ||
    `Quote Request #${quote?.id || index + 1}`;

  return (
    <main className="min-h-screen bg-slate-950 text-white pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <WorkspaceWelcome role="Buyer" />

        {/* HEADER */}
        <section>
          <p className="text-cyan-400 text-xs uppercase tracking-widest font-bold">
            Buyer Workspace
          </p>

          <h1 className="text-4xl md:text-5xl font-black mt-2">
            Buyer Dashboard
          </h1>

          <p className="text-slate-400 mt-4 text-lg max-w-3xl">
            Manage your textile purchases, orders and supplier
            negotiations directly from TEXVERSE.
          </p>
        </section>

        {/* ERROR */}
        {error && (
          <div className="mt-8 rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-red-300">
            <p className="font-bold">
              Unable to load buyer dashboard
            </p>

            <p className="text-sm mt-1">
              {error}
            </p>

            <button
              type="button"
              onClick={loadDashboard}
              className="mt-4 rounded-xl bg-red-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-red-600"
            >
              Retry
            </button>
          </div>
        )}

        {/* LOADING */}
        {loading ? (
          <div className="grid md:grid-cols-4 gap-5 mt-10">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-32 rounded-2xl border border-slate-800 bg-slate-900 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <>
            {/* STATS */}
            <section className="grid md:grid-cols-4 gap-5 mt-10">
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
                <p className="text-slate-500 text-sm">
                  Orders
                </p>

                <p className="text-4xl font-black mt-3">
                  {orders.length}
                </p>

                <p className="text-xs text-slate-600 mt-2">
                  {totalItems} items ordered
                </p>
              </div>

              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
                <p className="text-slate-500 text-sm">
                  Quote Requests
                </p>

                <p className="text-4xl font-black mt-3">
                  {quotes.length}
                </p>

                <p className="text-xs text-slate-600 mt-2">
                  Live negotiation requests
                </p>
              </div>

              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
                <p className="text-slate-500 text-sm">
                  Saved Fabrics
                </p>

                <p className="text-4xl font-black mt-3">
                  0
                </p>

                <p className="text-xs text-slate-600 mt-2">
                  No saved-fabric API is connected yet
                </p>
              </div>

              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
                <p className="text-slate-500 text-sm">
                  Suppliers
                </p>

                <p className="text-4xl font-black mt-3">
                  —
                </p>

                <p className="text-xs text-slate-600 mt-2">
                  Supplier directory available from Marketplace
                </p>
              </div>
            </section>

            {/* RECENT ORDERS */}
            <section className="mt-10 rounded-3xl border border-slate-800 bg-slate-900 p-7">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-black">
                    Recent Orders
                  </h2>

                  <p className="text-slate-500 mt-1">
                    Your latest textile purchases from TEXVERSE.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={loadDashboard}
                  className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-bold text-slate-300 hover:border-cyan-400 hover:text-cyan-400"
                >
                  Refresh
                </button>
              </div>

              <div className="mt-6 space-y-4">
                {orders.length === 0 ? (
                  <div className="rounded-2xl bg-slate-800 p-10 text-center">
                    <p className="text-slate-300 font-semibold">
                      No Orders Yet
                    </p>

                    <p className="text-slate-500 text-sm mt-2">
                      Your confirmed textile purchases will appear here.
                    </p>
                  </div>
                ) : (
                  orders.slice(0, 5).map((order) => (
                    <Link
                      key={order.id}
                      to={`/success?order=${encodeURIComponent(order.id)}`}
                      className="block rounded-2xl bg-slate-800 border border-slate-700 p-5 transition hover:border-cyan-400/50 hover:bg-slate-800/80 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <p className="text-lg font-black">
                            Order #{order.id}
                          </p>

                          <p className="text-sm text-slate-500 mt-1">
                            {formatDate(order.created_at)}
                          </p>
                        </div>

                        <span className="w-fit rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 text-sm font-bold text-emerald-400">
                          {order.status || "Pending"}
                        </span>
                      </div>

                      {Array.isArray(order.items) &&
                        order.items.length > 0 && (
                          <div className="mt-5 space-y-3">
                            {order.items.map((item, index) => (
                              <div
                                key={
                                  item?.id ||
                                  item?.product_id ||
                                  index
                                }
                                className="rounded-xl bg-slate-900/70 border border-slate-700 p-4"
                              >
                                <div className="flex justify-between gap-4">
                                  <div>
                                    <p className="font-bold">
                                      {item?.name ||
                                        item?.product_name ||
                                        `Product #${
                                          item?.product_id || "—"
                                        }`}
                                    </p>

                                    <p className="text-sm text-slate-500 mt-1">
                                      Quantity:{" "}
                                      {item?.quantity ?? "—"}
                                    </p>
                                  </div>

                                  {item?.price != null && (
                                    <p className="text-slate-300 font-semibold">
                                      ₹{formatPrice(item.price)}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                      <div className="grid sm:grid-cols-2 gap-4 mt-5 pt-5 border-t border-slate-700">
                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-600">
                            Order Date
                          </p>

                          <p className="text-slate-300 mt-1">
                            {formatDate(order.created_at)}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-600">
                            Total Amount
                          </p>

                          <p className="text-cyan-400 font-bold mt-1">
                            ₹{formatPrice(getOrderTotal(order))}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </section>

            {/* QUOTES */}
            <section className="mt-10 rounded-3xl border border-slate-800 bg-slate-900 p-7">
              <h2 className="text-3xl font-black">
                Quote Requests
              </h2>

              <p className="text-slate-500 mt-1">
                Your latest supplier negotiations.
              </p>

              <div className="mt-6 space-y-4">
                {quotes.length === 0 ? (
                  <div className="rounded-2xl bg-slate-800 p-10 text-center">
                    <p className="text-slate-300 font-semibold">
                      No Quote Requests Yet
                    </p>

                    <p className="text-slate-500 text-sm mt-2">
                      Your negotiation requests will appear here.
                    </p>
                  </div>
                ) : (
                  quotes.slice(0, 5).map((quote, index) => (
                    <article
                      key={quote?.id || index}
                      className="rounded-2xl bg-slate-800 border border-slate-700 p-5"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <h3 className="font-bold">
                            {getQuoteName(quote, index)}
                          </h3>

                          <p className="text-sm text-slate-500 mt-2">
                            {quote?.message ||
                              quote?.notes ||
                              "Quote request submitted."}
                          </p>
                        </div>

                        <span className="w-fit rounded-full bg-amber-400/10 border border-amber-400/20 px-4 py-2 text-sm font-bold text-amber-400">
                          {quote?.status || "Pending"}
                        </span>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </section>

            {/* SAVED FABRICS */}
            <section className="mt-10 rounded-3xl border border-slate-800 bg-slate-900 p-7">
              <h2 className="text-3xl font-black">
                Saved Fabrics
              </h2>

              <p className="text-slate-500 mt-1">
                Your saved textile products.
              </p>

              <div className="mt-6 rounded-2xl bg-slate-800 p-10 text-center">
                <p className="text-slate-300 font-semibold">
                  No saved fabrics yet.
                </p>

                <p className="text-sm text-slate-500 mt-2">
                  Browse the Marketplace and save products when the
                  saved-fabric feature is enabled.
                </p>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}