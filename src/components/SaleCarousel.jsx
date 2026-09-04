import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Package,
} from "lucide-react";
import { Link } from "react-router-dom";
import { productApi, getImageUrl } from "../services/api";
import { useI18n } from "../i18n/i18n";

/* =========================================================
   HELPERS
========================================================= */

function normalizeProducts(value) {
  if (Array.isArray(value)) {
    return value;
  }

  if (Array.isArray(value?.products)) {
    return value.products;
  }

  if (Array.isArray(value?.items)) {
    return value.items;
  }

  if (Array.isArray(value?.data)) {
    return value.data;
  }

  return [];
}

function cleanUnit(value) {
  if (value === null || value === undefined) {
    return "";
  }

  const normalized = String(value)
    .trim()
    .toLowerCase();

  if (
    normalized === "m" ||
    normalized === "meter" ||
    normalized === "meters" ||
    normalized === "metre" ||
    normalized === "metres"
  ) {
    return "meter";
  }

  return String(value).trim();
}

/*
 * IMPORTANT:
 * Do not return 0 when MOQ is missing.
 * 0 was causing the B2B Deals section to display:
 * "MOQ: 0"
 */
function getProductMoq(product) {
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
    if (
      value === null ||
      value === undefined ||
      String(value).trim() === ""
    ) {
      continue;
    }

    const raw = String(value).trim();

    const match = raw.match(
      /^([\d,]+(?:\.\d+)?)\s*(?:meters?|metres?|m)?$/i
    );

    if (match) {
      const numeric = Number(
        match[1].replace(/,/g, "")
      );

      if (
        Number.isFinite(numeric) &&
        numeric > 0
      ) {
        return numeric;
      }

      continue;
    }

    const numeric = Number(
      raw.replace(/,/g, "")
    );

    if (
      Number.isFinite(numeric) &&
      numeric > 0
    ) {
      return numeric;
    }
  }

  return null;
}

function formatNumber(value) {
  const numeric = Number(value);

  if (!Number.isFinite(numeric)) {
    return "0";
  }

  return numeric.toLocaleString("en-IN");
}

function formatPrice(value) {
  const numeric = Number(value);

  if (!Number.isFinite(numeric)) {
    return "0";
  }

  return numeric.toLocaleString("en-IN");
}

function getProductId(product) {
  return (
    product?.id ??
    product?.product_id
  );
}

function getProductImage(product) {
  return (
    product?.image ||
    product?.image_url ||
    product?.imageUrl ||
    product?.thumbnail ||
    ""
  );
}

/* =========================================================
   SALE CAROUSEL
========================================================= */

export default function SaleCarousel() {
  const { t, language } = useI18n();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  const isHindi =
    String(language || "en").toLowerCase() === "hi";

  /* =======================================================
     LOAD LIVE PRODUCTS
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const data = await productApi.list();

        const list = normalizeProducts(data);

        /*
         * Keep products having a valid price.
         * Do NOT manufacture MOQ or price values.
         */
        const validProducts = list
          .filter((product) => {
            const price = Number(product?.price);

            return (
              Number.isFinite(price) &&
              price > 0
            );
          })
          .sort(
            (a, b) =>
              Number(a?.price || 0) -
              Number(b?.price || 0)
          )
          .slice(0, 12);

        if (mounted) {
          setProducts(validProducts);
          setCurrentIndex(0);
        }
      } catch (err) {
        console.error(
          "B2B Deals products error:",
          err
        );

        if (mounted) {
          setError(
            err?.message ||
              t(
                "home.featuredProductsError",
                {
                  defaultValue:
                    "Unable to load products.",
                }
              )
          );

          setProducts([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      mounted = false;
    };
  }, [t]);

  /* =======================================================
     RESPONSIVE VISIBLE COUNT
  ======================================================= */

  const visibleCount = 4;

  const visibleProducts = useMemo(() => {
    if (!products.length) {
      return [];
    }

    const result = [];

    for (
      let i = 0;
      i < Math.min(
        visibleCount,
        products.length
      );
      i++
    ) {
      result.push(
        products[
          (currentIndex + i) %
            products.length
        ]
      );
    }

    return result;
  }, [products, currentIndex]);

  /* =======================================================
     AUTO ROTATION
  ======================================================= */

  useEffect(() => {
    if (products.length <= visibleCount) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setCurrentIndex((previous) => {
        return (
          (previous + 1) %
          products.length
        );
      });
    }, 4200);

    return () => {
      window.clearInterval(timer);
    };
  }, [products.length]);

  /* =======================================================
     NAVIGATION
  ======================================================= */

  function goNext() {
    if (!products.length) {
      return;
    }

    setCurrentIndex(
      (previous) =>
        (previous + 1) %
        products.length
    );
  }

  function goPrevious() {
    if (!products.length) {
      return;
    }

    setCurrentIndex(
      (previous) =>
        (previous - 1 + products.length) %
        products.length
    );
  }

  /* =======================================================
     PRODUCT LABELS
  ======================================================= */

  function getProductName(product) {
    return (
      product?.name ||
      t("home.textile", {
        defaultValue: "Textile",
      })
    );
  }

  function getCategory(product) {
    return (
      product?.category ||
      t("home.textile", {
        defaultValue: "Textile",
      })
    );
  }

  function getSupplier(product) {
    return (
      product?.supplier ||
      product?.supplier_name ||
      product?.supplierName ||
      t("home.verifiedSupplier", {
        defaultValue:
          "Verified Supplier",
      })
    );
  }

  function getUnit(product) {
    const unit = cleanUnit(
      product?.unit
    );

    if (unit) {
      return unit;
    }

    return "meter";
  }

  function getPriceUnit(product) {
    const unit = getUnit(product);

    /*
     * Current TEXVERSE catalog is primarily
     * meter-based. Keep singular presentation:
     * ₹261/meter
     */
    if (
      unit === "meter" ||
      unit === "m"
    ) {
      return "meter";
    }

    return unit;
  }

  function getMoqLabel(product) {
    const moq = getProductMoq(product);

    /*
     * Never show MOQ: 0.
     * If backend does not provide MOQ, show
     * a clean dash instead.
     */
    if (
      moq === null ||
      moq <= 0
    ) {
      return "—";
    }

    const formatted =
      formatNumber(moq);

    if (isHindi) {
      return `${formatted} मीटर`;
    }

    const unit = getUnit(product);

    if (
      unit === "meter" ||
      unit === "m"
    ) {
      return `${formatted} meters`;
    }

    return `${formatted} ${unit}`;
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <section className="bg-[#081120] py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* =================================================
            HEADER
        ================================================== */}

        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">
              {t("home.b2bDeals", {
                defaultValue:
                  "B2B Deals",
              })}
            </p>

            <h2 className="mt-3 text-4xl font-black text-white md:text-5xl">
              {t(
                "home.saleWholesaleDeals",
                {
                  defaultValue:
                    "Sale & Wholesale Deals",
                }
              )}
            </h2>

            <p className="mt-4 max-w-2xl text-slate-400">
              {t(
                "home.saleDescription",
                {
                  defaultValue:
                    "Fresh wholesale opportunities from the live TEXVERSE catalog — verified products, transparent MOQ and supplier pricing.",
                }
              )}
            </p>
          </div>

          <Link
            to="/marketplace"
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-5 py-3 font-bold text-cyan-300 transition hover:bg-cyan-400 hover:text-slate-950"
          >
            {t(
              "home.exploreAllProducts",
              {
                defaultValue:
                  "Explore All Products",
              }
            )}

            <ArrowRight size={17} />
          </Link>
        </div>

        {/* =================================================
            LOADING
        ================================================== */}

        {loading && (
          <div className="grid min-h-72 place-items-center rounded-3xl border border-slate-800 bg-slate-900/40">
            <div className="text-center">
              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-400" />

              <p className="text-slate-500">
                {t(
                  "home.loadingProducts",
                  {
                    defaultValue:
                      "Loading products...",
                  }
                )}
              </p>
            </div>
          </div>
        )}

        {/* =================================================
            ERROR
        ================================================== */}

        {!loading && error && (
          <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-10 text-center">
            <p className="text-red-300">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                window.location.reload()
              }
              className="mt-5 rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-950 transition hover:bg-cyan-300"
            >
              {t(
                "home.tryAgain",
                {
                  defaultValue:
                    "Try Again",
                }
              )}
            </button>
          </div>
        )}

        {/* =================================================
            EMPTY
        ================================================== */}

        {!loading &&
          !error &&
          products.length === 0 && (
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-10 text-center">
              <Package
                size={45}
                className="mx-auto text-slate-600"
              />

              <p className="mt-4 text-slate-400">
                {t(
                  "home.noProducts",
                  {
                    defaultValue:
                      "No products available.",
                  }
                )}
              </p>
            </div>
          )}

        {/* =================================================
            PRODUCT CARDS
        ================================================== */}

        {!loading &&
          !error &&
          visibleProducts.length > 0 && (
            <div className="relative">
              {/* LEFT ARROW */}

              {products.length >
                visibleCount && (
                <button
                  type="button"
                  onClick={
                    goPrevious
                  }
                  aria-label="Previous deals"
                  className="absolute -left-4 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-700 bg-[#111827] text-white shadow-xl transition hover:border-cyan-400 hover:text-cyan-300 lg:flex"
                >
                  <ChevronLeft
                    size={21}
                  />
                </button>
              )}

              {/* CARDS */}

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {visibleProducts.map(
                  (
                    product,
                    index
                  ) => {
                    const productId =
                      getProductId(
                        product
                      );

                    const image =
                      getImageUrl(
                        getProductImage(
                          product
                        )
                      );

                    const productName =
                      getProductName(
                        product
                      );

                    const category =
                      getCategory(
                        product
                      );

                    const supplier =
                      getSupplier(
                        product
                      );

                    const priceUnit =
                      getPriceUnit(
                        product
                      );

                    const moq =
                      getMoqLabel(
                        product
                      );

                    return (
                      <motion.article
                        key={
                          productId ??
                          `${productName}-${index}`
                        }
                        initial={{
                          opacity: 0,
                          y: 15,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          duration: 0.3,
                          delay:
                            index *
                            0.04,
                        }}
                        whileHover={{
                          y: -6,
                        }}
                        className="group overflow-hidden rounded-3xl border border-slate-800 bg-[#111827] shadow-xl transition hover:border-cyan-500/30"
                      >
                        {/* IMAGE */}

                        <Link
                          to={`/product/${encodeURIComponent(
                            productId
                          )}`}
                          className="block"
                        >
                          <div className="relative h-56 overflow-hidden bg-slate-800">
                            {image ? (
                              <img
                                src={image}
                                alt={
                                  productName
                                }
                                loading="lazy"
                                className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                                onError={(
                                  event
                                ) => {
                                  event.currentTarget.style.display =
                                    "none";
                                }}
                              />
                            ) : (
                              <div className="grid h-full place-items-center">
                                <Package
                                  size={
                                    48
                                  }
                                  className="text-slate-600"
                                />
                              </div>
                            )}

                            {/* DEAL BADGE */}

                            <span className="absolute left-4 top-4 rounded-full bg-cyan-400 px-3 py-1.5 text-xs font-black text-slate-950">
                              {t(
                                "home.deal",
                                {
                                  defaultValue:
                                    "Deal",
                                }
                              )}
                            </span>

                            {/* VERIFIED */}

                            {product?.verified && (
                              <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-bold text-slate-950">
                                <CheckCircle
                                  size={
                                    13
                                  }
                                />

                                {t(
                                  "home.verified",
                                  {
                                    defaultValue:
                                      "Verified",
                                  }
                                )}
                              </span>
                            )}
                          </div>
                        </Link>

                        {/* CONTENT */}

                        <div className="p-5">
                          <p className="text-xs font-semibold uppercase tracking-wide text-cyan-400">
                            {category}
                          </p>

                          <h3 className="mt-2 line-clamp-2 min-h-14 text-lg font-bold text-white">
                            {productName}
                          </h3>

                          <p className="mt-1 truncate text-sm text-slate-500">
                            {supplier}
                          </p>

                          {/* PRICE */}

                          <div className="mt-5">
                            <p className="text-xs text-slate-500">
                              {t(
                                "home.price",
                                {
                                  defaultValue:
                                    "Price",
                                }
                              )}
                            </p>

                            <p className="mt-1 text-2xl font-black text-cyan-400">
                              ₹
                              {formatPrice(
                                product?.price
                              )}

                              <span className="ml-1 text-sm font-medium text-slate-500">
                                /
                                {
                                  priceUnit
                                }
                              </span>
                            </p>
                          </div>

                          {/* MOQ */}

                          <div className="mt-4 border-t border-slate-800 pt-4">
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-sm text-slate-500">
                                {t(
                                  "home.moq",
                                  {
                                    defaultValue:
                                      "MOQ",
                                  }
                                )}
                              </span>

                              <span className="text-sm font-bold text-white">
                                {moq}
                              </span>
                            </div>
                          </div>

                          {/* VIEW */}

                          <Link
                            to={`/product/${encodeURIComponent(
                              productId
                            )}`}
                            className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-slate-700 py-3 text-sm font-bold text-white transition hover:border-cyan-400 hover:bg-cyan-400/10 hover:text-cyan-300"
                          >
                            {t(
                              "home.viewDetails",
                              {
                                defaultValue:
                                  "View Details",
                              }
                            )}

                            <ArrowRight
                              size={
                                16
                              }
                            />
                          </Link>
                        </div>
                      </motion.article>
                    );
                  }
                )}
              </div>

              {/* RIGHT ARROW */}

              {products.length >
                visibleCount && (
                <button
                  type="button"
                  onClick={goNext}
                  aria-label="Next deals"
                  className="absolute -right-4 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-700 bg-[#111827] text-white shadow-xl transition hover:border-cyan-400 hover:text-cyan-300 lg:flex"
                >
                  <ChevronRight
                    size={21}
                  />
                </button>
              )}
            </div>
          )}

        {/* =================================================
            MOBILE / SMALL SCREEN NAVIGATION
        ================================================== */}

        {!loading &&
          !error &&
          products.length >
            visibleCount && (
            <div className="mt-7 flex justify-center gap-3 lg:hidden">
              <button
                type="button"
                onClick={
                  goPrevious
                }
                aria-label="Previous deals"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-white transition hover:border-cyan-400 hover:text-cyan-300"
              >
                <ChevronLeft
                  size={19}
                />
              </button>

              <button
                type="button"
                onClick={goNext}
                aria-label="Next deals"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-white transition hover:border-cyan-400 hover:text-cyan-300"
              >
                <ChevronRight
                  size={19}
                />
              </button>
            </div>
          )}
      </div>
    </section>
  );
}