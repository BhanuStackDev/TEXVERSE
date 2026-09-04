import { useEffect, useMemo, useState } from "react";
import { adminApi } from "../../services/api";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  /* =========================================================
     LOAD ORDERS
  ========================================================= */

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await adminApi.orders();

      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err?.message || "Failed to load admin orders."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  /* =========================================================
     HELPERS
  ========================================================= */

  const getOrderId = (order) => {
    return (
      order?.id ??
      order?.order_id ??
      order?.orderId ??
      "—"
    );
  };

  const getStatus = (order) => {
    return String(
      order?.status ||
        order?.order_status ||
        "pending"
    ).toLowerCase();
  };

  const getPaymentStatus = (order) => {
    return String(
      order?.payment_status ||
        order?.paymentStatus ||
        order?.payment?.status ||
        "unknown"
    ).toLowerCase();
  };

  const getBuyerName = (order) => {
    return (
      order?.buyer_name ||
      order?.buyer?.full_name ||
      order?.user?.full_name ||
      order?.contact_person ||
      "Unknown Buyer"
    );
  };

  const getBuyerEmail = (order) => {
    return (
      order?.buyer_email ||
      order?.buyer?.email ||
      order?.user?.email ||
      order?.email ||
      "—"
    );
  };

  const getCompany = (order) => {
    return (
      order?.company_name ||
      order?.buyer?.company_name ||
      order?.user?.company_name ||
      "—"
    );
  };

  const getPhone = (order) => {
    return (
      order?.phone ||
      order?.buyer?.phone ||
      order?.user?.phone ||
      "—"
    );
  };

  const getAmount = (order) => {
    const value =
      order?.total_amount ??
      order?.total ??
      order?.amount ??
      order?.grand_total ??
      order?.price;

    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "—";
    }

    const number = Number(value);

    if (Number.isNaN(number)) {
      return String(value);
    }

    return `₹${number.toLocaleString("en-IN")}`;
  };

  const getItems = (order) => {
    if (Array.isArray(order?.items)) {
      return order.items;
    }

    if (Array.isArray(order?.order_items)) {
      return order.order_items;
    }

    return [];
  };

  const getItemCount = (order) => {
    const items = getItems(order);

    if (!items.length) {
      return order?.quantity ?? "—";
    }

    return items.reduce((total, item) => {
      const quantity = Number(
        item?.quantity ??
          item?.qty ??
          1
      );

      return (
        total +
        (Number.isNaN(quantity)
          ? 0
          : quantity)
      );
    }, 0);
  };

  const formatDate = (value) => {
    if (!value) {
      return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    return date.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  /* =========================================================
     STATUS HELPERS
  ========================================================= */

  const getStatusClasses = (status) => {
    switch (status) {
      case "completed":
      case "delivered":
      case "success":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";

      case "confirmed":
      case "processing":
      case "shipped":
      case "in_transit":
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";

      case "cancelled":
      case "canceled":
      case "failed":
        return "bg-red-500/10 text-red-400 border-red-500/20";

      case "pending":
      default:
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    }
  };

  const getPaymentClasses = (status) => {
    switch (status) {
      case "paid":
      case "success":
      case "completed":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";

      case "failed":
      case "cancelled":
      case "canceled":
        return "bg-red-500/10 text-red-400 border-red-500/20";

      case "pending":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";

      default:
        return "bg-slate-800 text-slate-400 border-slate-700";
    }
  };

  const formatStatus = (status) => {
    return String(status || "unknown")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );
  };

  /* =========================================================
     SEARCH + FILTER
  ========================================================= */

  const filteredOrders = useMemo(() => {
    const term = search.trim().toLowerCase();

    return orders.filter((order) => {
      const orderId = String(
        getOrderId(order)
      ).toLowerCase();

      const buyer = getBuyerName(order)
        .toLowerCase();

      const email = getBuyerEmail(order)
        .toLowerCase();

      const company = getCompany(order)
        .toLowerCase();

      const status = getStatus(order);

      const paymentStatus =
        getPaymentStatus(order);

      const matchesSearch =
        !term ||
        orderId.includes(term) ||
        buyer.includes(term) ||
        email.includes(term) ||
        company.includes(term) ||
        status.includes(term) ||
        paymentStatus.includes(term);

      const matchesFilter =
        filter === "all"
          ? true
          : filter === "pending"
          ? status === "pending"
          : filter === "processing"
          ? status === "processing"
          : filter === "shipped"
          ? status === "shipped" ||
            status === "in_transit"
          : filter === "delivered"
          ? status === "delivered" ||
            status === "completed"
          : filter === "cancelled"
          ? status === "cancelled" ||
            status === "canceled"
          : filter === "paid"
          ? paymentStatus === "paid" ||
            paymentStatus === "success" ||
            paymentStatus === "completed"
          : true;

      return (
        matchesSearch &&
        matchesFilter
      );
    });
  }, [orders, search, filter]);

  /* =========================================================
     STATISTICS
  ========================================================= */

  const pendingOrders = orders.filter(
    (order) =>
      getStatus(order) === "pending"
  ).length;

  const processingOrders = orders.filter(
    (order) =>
      getStatus(order) === "processing"
  ).length;

  const deliveredOrders = orders.filter(
    (order) =>
      getStatus(order) === "delivered" ||
      getStatus(order) === "completed"
  ).length;

  const paidOrders = orders.filter((order) => {
    const status = getPaymentStatus(order);

    return (
      status === "paid" ||
      status === "success" ||
      status === "completed"
    );
  }).length;

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-28 px-6 pb-16">
      <div className="max-w-7xl mx-auto">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">

          <div>
            <p className="text-cyan-400 text-sm font-bold uppercase tracking-wider">
              TEXVERSE ADMIN
            </p>

            <h1 className="text-4xl md:text-5xl font-black mt-1">
              Orders & Payments
            </h1>

            <p className="text-slate-400 mt-3 max-w-2xl">
              Monitor marketplace orders, buyer details,
              order status and payment information.
            </p>
          </div>

          <button
            type="button"
            onClick={loadOrders}
            disabled={loading}
            className="px-5 py-3 rounded-xl border border-slate-700 bg-slate-900 hover:border-cyan-500/50 transition disabled:opacity-50"
          >
            {loading
              ? "Refreshing..."
              : "↻ Refresh"}
          </button>

        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
            <div className="flex items-start justify-between gap-4">

              <div>
                <p className="font-bold text-red-300">
                  API Error
                </p>

                <p className="text-red-300/80 text-sm mt-1">
                  {error}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setError("")}
                className="text-red-300 hover:text-white"
              >
                ✕
              </button>

            </div>
          </div>
        )}

        {/* =================================================
            SECURITY
        ================================================= */}

        <div className="mt-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

            <div>
              <h2 className="font-bold">
                🔐 Admin API Protected
              </h2>

              <p className="text-slate-400 text-sm mt-1">
                Order information is loaded through the
                secured admin backend endpoint.
              </p>
            </div>

            <span className="text-emerald-400 text-sm font-bold">
              SECURE
            </span>

          </div>

        </div>

        {/* =================================================
            STATISTICS
        ================================================= */}

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-8">

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-slate-500 text-sm">
              Total Orders
            </p>

            <p className="text-3xl font-black mt-2">
              {orders.length}
            </p>
          </div>

          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
            <p className="text-slate-500 text-sm">
              Pending
            </p>

            <p className="text-3xl font-black text-amber-400 mt-2">
              {pendingOrders}
            </p>
          </div>

          <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">
            <p className="text-slate-500 text-sm">
              Processing
            </p>

            <p className="text-3xl font-black text-cyan-400 mt-2">
              {processingOrders}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
            <p className="text-slate-500 text-sm">
              Delivered
            </p>

            <p className="text-3xl font-black text-emerald-400 mt-2">
              {deliveredOrders}
            </p>
          </div>

          <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-5">
            <p className="text-slate-500 text-sm">
              Paid
            </p>

            <p className="text-3xl font-black text-purple-400 mt-2">
              {paidOrders}
            </p>
          </div>

        </div>

        {/* =================================================
            SEARCH / FILTER
        ================================================= */}

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-5">

          <div className="flex flex-col lg:flex-row gap-4">

            <div className="flex-1">

              <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2">
                Search Orders
              </label>

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search by order ID, buyer, email, company or status..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 outline-none focus:border-cyan-500"
              />

            </div>

            <div className="lg:w-64">

              <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2">
                Filter
              </label>

              <select
                value={filter}
                onChange={(e) =>
                  setFilter(e.target.value)
                }
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500"
              >
                <option value="all">
                  All Orders
                </option>

                <option value="pending">
                  Pending
                </option>

                <option value="processing">
                  Processing
                </option>

                <option value="shipped">
                  Shipped / In Transit
                </option>

                <option value="delivered">
                  Delivered / Completed
                </option>

                <option value="cancelled">
                  Cancelled
                </option>

                <option value="paid">
                  Paid
                </option>
              </select>

            </div>

          </div>

          <div className="mt-4 text-sm text-slate-500">
            Showing{" "}
            <span className="text-slate-300 font-semibold">
              {filteredOrders.length}
            </span>{" "}
            of{" "}
            <span className="text-slate-300 font-semibold">
              {orders.length}
            </span>{" "}
            orders
          </div>

        </div>

        {/* =================================================
            ORDERS
        ================================================= */}

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden">

          <div className="p-6 border-b border-slate-800">

            <h2 className="text-2xl font-black">
              Marketplace Orders
            </h2>

            <p className="text-slate-500 mt-1">
              Admin order monitoring
            </p>

          </div>

          {loading ? (
            <div className="p-12 text-center">

              <div className="text-cyan-400 font-bold">
                Loading orders...
              </div>

              <p className="text-slate-500 text-sm mt-2">
                Fetching order data from the TEXVERSE backend.
              </p>

            </div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center">

              <div className="text-5xl">
                🛒
              </div>

              <h3 className="font-bold text-xl mt-4">
                No orders found
              </h3>

              <p className="text-slate-500 mt-2">
                There are currently no orders in the marketplace.
              </p>

            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-12 text-center">

              <div className="text-5xl">
                🔎
              </div>

              <h3 className="font-bold text-xl mt-4">
                No matching orders
              </h3>

              <p className="text-slate-500 mt-2">
                Try changing your search or filter.
              </p>

            </div>
          ) : (
            <div className="divide-y divide-slate-800">

              {filteredOrders.map((order) => {
                const orderId = getOrderId(order);
                const status = getStatus(order);
                const paymentStatus =
                  getPaymentStatus(order);

                const items = getItems(order);

                return (
                  <div
                    key={orderId}
                    className="p-5 hover:bg-slate-800/20 transition"
                  >

                    {/* =================================================
                        TOP
                    ================================================= */}

                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">

                      <div>

                        <div className="flex flex-wrap items-center gap-3">

                          <h3 className="text-xl font-black">
                            Order #{orderId}
                          </h3>

                          <span
                            className={`px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusClasses(
                              status
                            )}`}
                          >
                            {formatStatus(status)}
                          </span>

                          <span
                            className={`px-3 py-1.5 rounded-full text-xs font-bold border ${getPaymentClasses(
                              paymentStatus
                            )}`}
                          >
                            Payment:{" "}
                            {formatStatus(
                              paymentStatus
                            )}
                          </span>

                        </div>

                        <p className="text-slate-500 text-sm mt-2">
                          Created:{" "}
                          {formatDate(
                            order.created_at ||
                              order.createdAt ||
                              order.created
                          )}
                        </p>

                      </div>

                      <div className="text-left lg:text-right">

                        <p className="text-xs uppercase tracking-wider text-slate-500">
                          Order Value
                        </p>

                        <p className="text-2xl font-black text-cyan-400 mt-1">
                          {getAmount(order)}
                        </p>

                      </div>

                    </div>

                    {/* =================================================
                        BUYER
                    ================================================= */}

                    <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">

                      <div className="rounded-xl bg-slate-950 border border-slate-800 p-4">

                        <p className="text-xs text-slate-500 uppercase tracking-wider">
                          Buyer
                        </p>

                        <p className="font-bold mt-2">
                          {getBuyerName(order)}
                        </p>

                      </div>

                      <div className="rounded-xl bg-slate-950 border border-slate-800 p-4">

                        <p className="text-xs text-slate-500 uppercase tracking-wider">
                          Email
                        </p>

                        <p className="font-semibold text-slate-300 mt-2 break-all">
                          {getBuyerEmail(order)}
                        </p>

                      </div>

                      <div className="rounded-xl bg-slate-950 border border-slate-800 p-4">

                        <p className="text-xs text-slate-500 uppercase tracking-wider">
                          Company
                        </p>

                        <p className="font-semibold text-slate-300 mt-2">
                          {getCompany(order)}
                        </p>

                      </div>

                      <div className="rounded-xl bg-slate-950 border border-slate-800 p-4">

                        <p className="text-xs text-slate-500 uppercase tracking-wider">
                          Phone
                        </p>

                        <p className="font-semibold text-slate-300 mt-2">
                          {getPhone(order)}
                        </p>

                      </div>

                    </div>

                    {/* =================================================
                        ITEMS
                    ================================================= */}

                    <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950 p-5">

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                        <div>
                          <p className="text-xs uppercase tracking-wider text-slate-500">
                            Order Items
                          </p>

                          <p className="font-bold mt-1">
                            {items.length
                              ? `${items.length} product${
                                  items.length === 1
                                    ? ""
                                    : "s"
                                }`
                              : "Item information"}
                          </p>
                        </div>

                        <div className="text-sm text-slate-400">
                          Total quantity:{" "}
                          <span className="text-white font-bold">
                            {getItemCount(order)}
                          </span>
                        </div>

                      </div>

                      {items.length > 0 && (
                        <div className="mt-4 space-y-3">

                          {items.map(
                            (item, index) => (
                              <div
                                key={
                                  item?.id ||
                                  item?.product_id ||
                                  index
                                }
                                className="rounded-xl border border-slate-800 bg-slate-900 p-4"
                              >

                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                                  <div>

                                    <p className="font-semibold">
                                      {item?.product_name ||
                                        item?.name ||
                                        item?.product?.name ||
                                        `Product #${
                                          item?.product_id ||
                                          "—"
                                        }`}
                                    </p>

                                    <p className="text-slate-500 text-sm mt-1">
                                      Product ID:{" "}
                                      {item?.product_id ||
                                        item?.product?.id ||
                                        "—"}
                                    </p>

                                  </div>

                                  <div className="text-left sm:text-right">

                                    <p className="text-sm text-slate-400">
                                      Quantity
                                    </p>

                                    <p className="font-bold">
                                      {item?.quantity ??
                                        item?.qty ??
                                        "—"}
                                    </p>

                                  </div>

                                </div>

                              </div>
                            )
                          )}

                        </div>
                      )}

                    </div>

                  </div>
                );
              })}

            </div>
          )}

        </div>

        {/* =================================================
            BACK
        ================================================= */}

        <button
          type="button"
          onClick={() =>
            window.history.back()
          }
          className="mt-6 text-cyan-400 hover:text-cyan-300 text-sm font-semibold"
        >
          ← Back to Admin Dashboard
        </button>

      </div>
    </div>
  );
}