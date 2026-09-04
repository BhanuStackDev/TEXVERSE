import { useEffect, useMemo, useState } from "react";
import { adminApi, getImageUrl } from "../../services/api";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  /* =========================================================
     LOAD PRODUCTS
  ========================================================= */

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await adminApi.products();

      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.message || "Failed to load admin products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  /* =========================================================
     VERIFY / UNVERIFY
  ========================================================= */

  const handleVerify = async (product) => {
    try {
      setActionId(product.id);
      setError("");

      await adminApi.verify(
        product.id,
        !Boolean(product.verified)
      );

      await loadProducts();
    } catch (err) {
      setError(
        err?.message || "Failed to update product verification."
      );
    } finally {
      setActionId(null);
    }
  };

  /* =========================================================
     AVAILABILITY
  ========================================================= */

  const handleAvailability = async (product) => {
    try {
      setActionId(product.id);
      setError("");

      if (!adminApi.setAvailability) {
        throw new Error(
          "Admin availability API is not configured in api.js."
        );
      }

      await adminApi.setAvailability(
        product.id,
        !Boolean(product.available)
      );

      await loadProducts();
    } catch (err) {
      setError(
        err?.message || "Failed to update product availability."
      );
    } finally {
      setActionId(null);
    }
  };

  /* =========================================================
     DELETE
  ========================================================= */

  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `Delete "${product.name || "this product"}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionId(product.id);
      setError("");

      await adminApi.deleteProduct(product.id);

      setProducts((current) =>
        current.filter((item) => item.id !== product.id)
      );
    } catch (err) {
      setError(err?.message || "Failed to delete product.");
    } finally {
      setActionId(null);
    }
  };

  /* =========================================================
     FILTER + SEARCH
  ========================================================= */

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !term ||
        String(product.name || "")
          .toLowerCase()
          .includes(term) ||
        String(product.category || "")
          .toLowerCase()
          .includes(term) ||
        String(product.subcategory || "")
          .toLowerCase()
          .includes(term) ||
        String(product.supplier || "")
          .toLowerCase()
          .includes(term) ||
        String(product.id || "")
          .toLowerCase()
          .includes(term);

      const matchesFilter =
        filter === "all"
          ? true
          : filter === "pending"
          ? !product.verified
          : filter === "verified"
          ? Boolean(product.verified)
          : filter === "available"
          ? Boolean(product.available)
          : filter === "unavailable"
          ? !product.available
          : true;

      return matchesSearch && matchesFilter;
    });
  }, [products, search, filter]);

  /* =========================================================
     COUNTS
  ========================================================= */

  const totalProducts = products.length;

  const verifiedProducts = products.filter(
    (product) => product.verified
  ).length;

  const pendingProducts = products.filter(
    (product) => !product.verified
  ).length;

  const availableProducts = products.filter(
    (product) => product.available
  ).length;

  /* =========================================================
     HELPERS
  ========================================================= */

  const formatPrice = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "—";
    }

    const number = Number(value);

    if (!Number.isFinite(number)) {
      return String(value);
    }

    return `₹${number.toLocaleString("en-IN")}`;
  };

  const getStock = (product) => {
    const candidates = [
      product?.stock,
      product?.quantity,
      product?.available_stock,
      product?.availableStock,
      product?.inventory,
    ];

    for (const value of candidates) {
      if (value === null || value === undefined || value === "") {
        continue;
      }

      const number = Number(value);

      if (Number.isFinite(number)) {
        return number.toLocaleString("en-IN");
      }
    }

    return "—";
  };

  /*
   * Supports the different MOQ field names that may come
   * from the backend/API/catalog normalization.
   *
   * Never returns NaN.
   */
  const getMoq = (product) => {
    const candidates = [
      product?.moq,
      product?.MOQ,
      product?.min_order_quantity,
      product?.minimum_order_quantity,
      product?.minimumOrderQuantity,
      product?.minOrderQuantity,
      product?.minimum_order_qty,
      product?.min_order_qty,
      product?.order_minimum,
    ];

    for (const value of candidates) {
      if (value === null || value === undefined || value === "") {
        continue;
      }

      const number = Number(value);

      if (Number.isFinite(number) && number >= 0) {
        return number.toLocaleString("en-IN");
      }
    }

    return "—";
  };

  /* =========================================================
     UI
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
              Products & Verification
            </h1>

            <p className="text-slate-400 mt-3 max-w-2xl">
              Review supplier products, verify listings,
              manage availability and remove marketplace
              products.
            </p>
          </div>

          <button
            type="button"
            onClick={loadProducts}
            disabled={loading || actionId !== null}
            className="px-5 py-3 rounded-xl border border-slate-700 bg-slate-900 hover:border-cyan-500/50 transition disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "↻ Refresh"}
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
                Product verification and management are
                performed through authenticated admin APIs.
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-slate-500 text-sm">
              Total Products
            </p>

            <p className="text-3xl font-black mt-2">
              {totalProducts}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
            <p className="text-slate-500 text-sm">
              Verified
            </p>

            <p className="text-3xl font-black text-emerald-400 mt-2">
              {verifiedProducts}
            </p>
          </div>

          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
            <p className="text-slate-500 text-sm">
              Pending Verification
            </p>

            <p className="text-3xl font-black text-amber-400 mt-2">
              {pendingProducts}
            </p>
          </div>

          <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">
            <p className="text-slate-500 text-sm">
              Available
            </p>

            <p className="text-3xl font-black text-cyan-400 mt-2">
              {availableProducts}
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
                Search Products
              </label>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by product, supplier, category or ID..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 outline-none focus:border-cyan-500"
              />
            </div>

            <div className="lg:w-64">
              <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2">
                Filter
              </label>

              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500"
              >
                <option value="all">
                  All Products
                </option>

                <option value="pending">
                  Pending Verification
                </option>

                <option value="verified">
                  Verified
                </option>

                <option value="available">
                  Available
                </option>

                <option value="unavailable">
                  Unavailable
                </option>
              </select>
            </div>
          </div>

          <div className="mt-4 text-sm text-slate-500">
            Showing{" "}
            <span className="text-slate-300 font-semibold">
              {filteredProducts.length}
            </span>{" "}
            of{" "}
            <span className="text-slate-300 font-semibold">
              {products.length}
            </span>{" "}
            products
          </div>
        </div>

        {/* =================================================
            PRODUCT LIST
        ================================================= */}

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden">

          <div className="p-6 border-b border-slate-800">
            <h2 className="text-2xl font-black">
              Supplier Products
            </h2>

            <p className="text-slate-500 mt-1">
              Admin review and marketplace control
            </p>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="text-cyan-400 font-bold">
                Loading products...
              </div>

              <p className="text-slate-500 text-sm mt-2">
                Fetching products from the TEXVERSE backend.
              </p>
            </div>
          ) : products.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-5xl">
                📦
              </div>

              <h3 className="font-bold text-xl mt-4">
                No products found
              </h3>

              <p className="text-slate-500 mt-2">
                There are currently no products in the
                marketplace database.
              </p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-5xl">
                🔎
              </div>

              <h3 className="font-bold text-xl mt-4">
                No matching products
              </h3>

              <p className="text-slate-500 mt-2">
                Try changing the search or filter.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-800">

              {filteredProducts.map((product) => {
                const verified = Boolean(product.verified);
                const available = Boolean(product.available);
                const busy = actionId === product.id;

                const imageUrl = getImageUrl(
                  product.image ||
                    product.image_url ||
                    product.imageUrl ||
                    product.thumbnail ||
                    ""
                );

                return (
                  <div
                    key={product.id}
                    className="p-5 hover:bg-slate-800/20 transition"
                  >
                    <div className="flex flex-col xl:flex-row gap-6">

                      {/* =================================================
                          IMAGE
                      ================================================= */}

                      <div className="shrink-0">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={product.name || "Product"}
                            className="w-32 h-32 rounded-2xl object-cover border border-slate-700 bg-slate-950"
                            onError={(event) => {
                              event.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="w-32 h-32 rounded-2xl border border-slate-700 bg-slate-950 grid place-items-center text-4xl">
                            📦
                          </div>
                        )}
                      </div>

                      {/* =================================================
                          MAIN INFORMATION
                      ================================================= */}

                      <div className="flex-1 min-w-0">

                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">

                              <h3 className="text-2xl font-black wrap-break-word">
                                {product.name || "Unnamed Product"}
                              </h3>

                              <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-400">
                                ID #{product.id}
                              </span>
                            </div>

                            <p className="text-slate-400 mt-2">
                              Supplier:{" "}
                              <span className="text-slate-200 font-semibold">
                                {product.supplier || "Unknown Supplier"}
                              </span>
                            </p>
                          </div>

                          {/* STATUS */}

                          <div className="flex flex-wrap gap-2">

                            <span
                              className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
                                verified
                                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                  : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                              }`}
                            >
                              {verified
                                ? "✓ VERIFIED"
                                : "⏳ PENDING"}
                            </span>

                            <span
                              className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
                                available
                                  ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                                  : "bg-slate-800 text-slate-400 border-slate-700"
                              }`}
                            >
                              {available
                                ? "AVAILABLE"
                                : "UNAVAILABLE"}
                            </span>

                          </div>
                        </div>

                        {/* =================================================
                            CATEGORY
                        ================================================= */}

                        <div className="flex flex-wrap gap-2 mt-4">

                          {product.category && (
                            <span className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-sm">
                              Category: {product.category}
                            </span>
                          )}

                          {product.subcategory && (
                            <span className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-sm">
                              Subcategory: {product.subcategory}
                            </span>
                          )}

                        </div>

                        {/* =================================================
                            PRODUCT DATA
                        ================================================= */}

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-5">

                          <div className="rounded-xl bg-slate-950 border border-slate-800 p-4">
                            <p className="text-xs text-slate-500">
                              Price
                            </p>

                            <p className="font-bold mt-1">
                              {formatPrice(product.price)}
                            </p>
                          </div>

                          <div className="rounded-xl bg-slate-950 border border-slate-800 p-4">
                            <p className="text-xs text-slate-500">
                              MOQ
                            </p>

                            <p className="font-bold mt-1">
                              {getMoq(product)}
                            </p>
                          </div>

                          <div className="rounded-xl bg-slate-950 border border-slate-800 p-4">
                            <p className="text-xs text-slate-500">
                              Stock
                            </p>

                            <p className="font-bold mt-1">
                              {getStock(product)}
                            </p>
                          </div>

                          <div className="rounded-xl bg-slate-950 border border-slate-800 p-4">
                            <p className="text-xs text-slate-500">
                              Product ID
                            </p>

                            <p className="font-bold mt-1">
                              #{product.id}
                            </p>
                          </div>

                        </div>

                        {/* =================================================
                            ACTIONS
                        ================================================= */}

                        <div className="flex flex-col sm:flex-row flex-wrap gap-3 mt-5">

                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => handleVerify(product)}
                            className={`px-4 py-3 rounded-xl font-bold text-sm transition disabled:opacity-50 ${
                              verified
                                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20"
                                : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                            }`}
                          >
                            {busy
                              ? "Updating..."
                              : verified
                              ? "Unverify Product"
                              : "✓ Verify Product"}
                          </button>

                          <button
                            type="button"
                            disabled={busy}
                            onClick={() =>
                              handleAvailability(product)
                            }
                            className="px-4 py-3 rounded-xl font-bold text-sm bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 transition disabled:opacity-50"
                          >
                            {busy
                              ? "Updating..."
                              : available
                              ? "Set Unavailable"
                              : "Set Available"}
                          </button>

                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => handleDelete(product)}
                            className="px-4 py-3 rounded-xl font-bold text-sm bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition disabled:opacity-50"
                          >
                            🗑 Delete Product
                          </button>

                        </div>

                      </div>
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
          onClick={() => window.history.back()}
          className="mt-6 text-cyan-400 hover:text-cyan-300 text-sm font-semibold"
        >
          ← Back to Admin Dashboard
        </button>

      </div>
    </div>
  );
}
