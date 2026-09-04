import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Star,
  CheckCircle,
  Heart,
  Eye,
  Package,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  productApi,
  getImageUrl,
} from "../services/api";
import { useI18n } from "../i18n/i18n";

/* =========================================================
   HINDI PRODUCT PRESENTATION
========================================================= */

const hindiProductTranslations = {
  "Soft Touch Navy Velvet Fabric Mill Select": {
    name: "सॉफ्ट टच नेवी वेलवेट फैब्रिक मिल सिलेक्ट",
    category: "फैशन फैब्रिक",
    subcategory: "वेलवेट फैब्रिक",
    description:
      "Sunrise Fabrics द्वारा उपलब्ध कराया गया सॉफ्ट टच नेवी वेलवेट फैब्रिक। प्रीमियम B2B थोक सोर्सिंग के लिए नेवी फिनिश वाला वेलवेट टेक्सटाइल। कीमत ₹751 प्रति मीटर, न्यूनतम ऑर्डर मात्रा 1000 मीटर और 6000 मीटर स्टॉक उपलब्ध।",
  },

  "High Density Black Quick Dry Mill Select": {
    name: "हाई डेंसिटी ब्लैक क्विक ड्राय मिल सिलेक्ट",
    category: "फंक्शनल फैब्रिक",
    subcategory: "क्विक ड्राय",
    description:
      "Tex Custom House द्वारा उपलब्ध कराया गया हाई डेंसिटी ब्लैक क्विक ड्राय फैब्रिक। ब्लैक फिनिश वाला परफॉर्मेंस टेक्सटाइल, B2B थोक सोर्सिंग के लिए ₹592 प्रति मीटर। न्यूनतम ऑर्डर मात्रा 750 मीटर और 3500 मीटर स्टॉक उपलब्ध।",
  },

  "Export Quality White Recycled Cotton Mill Select": {
    name: "एक्सपोर्ट क्वालिटी व्हाइट रीसाइकल्ड कॉटन मिल सिलेक्ट",
    category: "सस्टेनेबल टेक्सटाइल",
    subcategory: "रीसाइकल्ड कॉटन",
    description:
      "Modern Fiber Industries द्वारा उपलब्ध कराया गया एक्सपोर्ट क्वालिटी व्हाइट रीसाइकल्ड कॉटन फैब्रिक। व्हाइट फिनिश वाला टिकाऊ टेक्सटाइल, ₹493 प्रति मीटर की B2B थोक कीमत के साथ। न्यूनतम ऑर्डर मात्रा 500 मीटर और 2200 मीटर स्टॉक उपलब्ध।",
  },

  "Classic Natural Towel Fabric Mill Select": {
    name: "क्लासिक नेचुरल टॉवल फैब्रिक मिल सिलेक्ट",
    category: "होम टेक्सटाइल",
    subcategory: "टॉवल फैब्रिक",
    description:
      "Natural Linen Mills द्वारा उपलब्ध कराया गया क्लासिक नेचुरल टॉवल फैब्रिक। नेचुरल फिनिश वाला टेक्सटाइल, B2B थोक सोर्सिंग के लिए ₹434 प्रति मीटर। न्यूनतम ऑर्डर मात्रा 300 मीटर और 1500 मीटर स्टॉक उपलब्ध।",
  },

  "Premium Brown Antimicrobial Fabric Commercial Grade": {
    name: "प्रीमियम ब्राउन एंटीमाइक्रोबियल फैब्रिक कमर्शियल ग्रेड",
    category: "टेक्निकल टेक्सटाइल",
    subcategory: "एंटीमाइक्रोबियल फैब्रिक",
    description:
      "Royal Silk House द्वारा उपलब्ध कराया गया प्रीमियम ब्राउन एंटीमाइक्रोबियल फैब्रिक। ब्राउन फिनिश वाला तकनीकी टेक्सटाइल, ₹825 प्रति मीटर की B2B थोक कीमत के साथ। न्यूनतम ऑर्डर मात्रा 200 मीटर और 1000 मीटर स्टॉक उपलब्ध।",
  },

  "Commercial Teal Linen Cotton Commercial Grade": {
    name: "कमर्शियल टील लिनन कॉटन कमर्शियल ग्रेड",
    category: "ब्लेंडेड फैब्रिक",
    subcategory: "लिनन कॉटन",
    description:
      "Global Denim Mills द्वारा उपलब्ध कराया गया कमर्शियल टील लिनन कॉटन फैब्रिक। टील फिनिश वाला मिश्रित टेक्सटाइल, ₹496 प्रति मीटर की B2B थोक कीमत के साथ। न्यूनतम ऑर्डर मात्रा 1000 मीटर और 6000 मीटर स्टॉक उपलब्ध।",
  },
};

/* =========================================================
   HINDI CATEGORY / SUBCATEGORY
========================================================= */

const hindiCategoryMap = {
  "fashion-fabrics": "फैशन फैब्रिक",
  "functional-fabrics": "फंक्शनल फैब्रिक",
  "sustainable-textiles": "सस्टेनेबल टेक्सटाइल",
  "home-textiles": "होम टेक्सटाइल",
  "technical-textiles": "टेक्निकल टेक्सटाइल",
  blends: "ब्लेंडेड फैब्रिक",
};

const hindiSubcategoryMap = {
  "Velvet Fabric": "वेलवेट फैब्रिक",
  "Quick Dry": "क्विक ड्राय",
  "Recycled Cotton": "रीसाइकल्ड कॉटन",
  "Towel Fabric": "टॉवल फैब्रिक",
  "Antimicrobial Fabric": "एंटीमाइक्रोबियल फैब्रिक",
  "Linen Cotton": "लिनन कॉटन",
};

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
    normalized === "meter" ||
    normalized === "meters" ||
    normalized === "m" ||
    normalized === "metre" ||
    normalized === "metres"
  ) {
    return "meter";
  }

  return String(value).trim();
}

function cleanMoqValue(value) {
  if (value === null || value === undefined) {
    return null;
  }

  const raw = String(value).trim();

  if (!raw) {
    return null;
  }

  const match = raw.match(
    /^([\d,]+(?:\.\d+)?)\s*(?:meters?|metres?|m)?$/i
  );

  if (match) {
    return match[1];
  }

  const cleaned = raw
    .replace(
      /\s*(meters?|metres?|m)\s*$/i,
      ""
    )
    .trim();

  return cleaned || null;
}

function getMoqValue(product) {
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
    const cleaned = cleanMoqValue(value);

    if (cleaned === null) {
      continue;
    }

    const numeric = Number(
      String(cleaned).replace(/,/g, "")
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

function formatPrice(price) {
  const value = Number(price);

  if (!Number.isFinite(value)) {
    return "0";
  }

  return value.toLocaleString("en-IN");
}

function formatNumber(value) {
  const numeric = Number(value);

  if (!Number.isFinite(numeric)) {
    return "0";
  }

  return numeric.toLocaleString("en-IN");
}

/* =========================================================
   PRODUCT GRID
========================================================= */

export default function ProductGrid() {
  const { t, language } = useI18n();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isHindi =
    String(language || "en").toLowerCase() === "hi";

  useEffect(() => {
    let mounted = true;

    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const data = await productApi.list();

        const list = normalizeProducts(data);

        const sorted = [...list].sort(
          (a, b) =>
            Number(Boolean(b?.verified)) -
              Number(Boolean(a?.verified)) ||
            Number(Boolean(b?.available)) -
              Number(Boolean(a?.available)) ||
            Number(b?.rating || 0) -
              Number(a?.rating || 0)
        );

        if (mounted) {
          setProducts(sorted.slice(0, 6));
        }
      } catch (err) {
        console.error(
          "Featured products error:",
          err
        );

        if (mounted) {
          setError(
            err?.message ||
              t(
                "home.featuredProductsError",
                {
                  defaultValue:
                    "Unable to load featured products.",
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

  function getProductId(product) {
    return (
      product?.id ??
      product?.product_id
    );
  }

  function getUnit(product) {
    if (isHindi) {
      return "मीटर";
    }

    return (
      cleanUnit(product?.unit) ||
      "meter"
    );
  }

  function getMoq(product) {
    const numericMoq =
      getMoqValue(product);

    if (
      numericMoq === null ||
      numericMoq <= 0
    ) {
      return t("home.notAvailable", {
        defaultValue: "Not specified",
      });
    }

    const formatted =
      formatNumber(numericMoq);

    if (isHindi) {
      return `${formatted} मीटर`;
    }

    const unit =
      cleanUnit(product?.unit) ||
      "meter";

    if (unit === "meter") {
      return `${formatted} meters`;
    }

    return `${formatted} ${unit}`;
  }

  function getCategory(product) {
    if (isHindi) {
      return (
        hindiCategoryMap[
          product?.category
        ] ||
        product?.category ||
        t("home.textile")
      );
    }

    return (
      product?.category ||
      t("home.textile")
    );
  }

  function getSubcategory(product) {
    if (isHindi) {
      return (
        hindiSubcategoryMap[
          product?.subcategory
        ] ||
        product?.subcategory ||
        t("home.general")
      );
    }

    return (
      product?.subcategory ||
      t("home.general")
    );
  }

  function getSupplier(product) {
    return (
      product?.supplier ||
      product?.supplier_name ||
      product?.supplierName ||
      t("home.verifiedSupplier")
    );
  }

  function getRating(product) {
    const rating = Number(
      product?.rating
    );

    if (
      Number.isFinite(rating) &&
      rating > 0
    ) {
      return rating.toFixed(1);
    }

    return null;
  }

  function getProductName(product) {
    if (
      isHindi &&
      hindiProductTranslations[
        product?.name
      ]?.name
    ) {
      return hindiProductTranslations[
        product.name
      ].name;
    }

    return (
      product?.name ||
      t("home.textile")
    );
  }

  function getDescription(product) {
    if (
      isHindi &&
      hindiProductTranslations[
        product?.name
      ]?.description
    ) {
      return hindiProductTranslations[
        product.name
      ].description;
    }

    return product?.description || "";
  }

  return (
    <section className="bg-[#081120] py-20">
      <div className="mx-auto max-w-7xl px-6">

        {/* =================================================
            SECTION HEADER
            Duplicate heading removed.
        ================================================== */}

        <div className="mb-14 text-center">
          <h2 className="text-4xl font-black text-white md:text-5xl">
            {t("home.featuredProducts")}
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            {t(
              "home.featuredProductsDescription",
              {
                defaultValue:
                  "Explore premium wholesale fabrics from verified textile suppliers across India.",
              }
            )}
          </p>
        </div>

        {/* =================================================
            LOADING
        ================================================== */}

        {loading && (
          <div className="grid min-h-80 place-items-center">
            <div className="flex flex-col items-center gap-4">
              <Loader2
                size={36}
                className="animate-spin text-cyan-400"
              />

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
          <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-8 text-center">
            <p className="font-semibold text-red-300">
              {error}
            </p>

            <button
              type="button"
              onClick={() => {
                window.location.reload();
              }}
              className="mt-5 rounded-xl bg-cyan-400 px-5 py-3 font-black text-slate-950 transition hover:bg-cyan-300"
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
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-12 text-center">
              <Package
                size={45}
                className="mx-auto text-slate-600"
              />

              <h3 className="mt-5 text-xl font-black text-white">
                {t(
                  "home.noProducts",
                  {
                    defaultValue:
                      "No products available",
                  }
                )}
              </h3>

              <p className="mt-2 text-slate-500">
                {t(
                  "home.noProductsDescription",
                  {
                    defaultValue:
                      "No featured products are available right now.",
                  }
                )}
              </p>
            </div>
          )}

        {/* =================================================
            PRODUCTS
        ================================================== */}

        {!loading &&
          !error &&
          products.length > 0 && (
            <>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => {
                  const productId =
                    getProductId(product);

                  const productName =
                    getProductName(product);

                  const category =
                    getCategory(product);

                  const subcategory =
                    getSubcategory(product);

                  const supplier =
                    getSupplier(product);

                  const description =
                    getDescription(product);

                  const rating =
                    getRating(product);

                  const moq =
                    getMoq(product);

                  const image =
                    getImageUrl(
                      product?.image ||
                        product?.image_url ||
                        product?.imageUrl ||
                        product?.thumbnail ||
                        ""
                    );

                  return (
                    <motion.article
                      key={
                        productId ??
                        `${productName}-${supplier}`
                      }
                      whileHover={{
                        y: -8,
                      }}
                      transition={{
                        duration: 0.3,
                      }}
                      className="group overflow-hidden rounded-3xl border border-slate-700 bg-[#111827] shadow-xl"
                    >
                      {/* IMAGE */}

                      <div className="relative overflow-hidden">
                        {image ? (
                          <img
                            src={image}
                            alt={productName}
                            loading="lazy"
                            className="h-64 w-full object-cover transition duration-500 group-hover:scale-110"
                            onError={(event) => {
                              event.currentTarget.style.display =
                                "none";
                            }}
                          />
                        ) : (
                          <div className="grid h-64 w-full place-items-center bg-slate-800">
                            <Package
                              size={55}
                              className="text-slate-600"
                            />
                          </div>
                        )}

                        {product?.verified && (
                          <span className="absolute left-4 top-4 flex items-center gap-1 rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-bold text-slate-950">
                            <CheckCircle
                              size={14}
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

                        <button
                          type="button"
                          aria-label={t(
                            "home.saveProduct",
                            {
                              defaultValue:
                                "Save product",
                            }
                          )}
                          className="absolute right-4 top-4 rounded-full bg-black/30 p-2 backdrop-blur transition hover:bg-red-500"
                        >
                          <Heart
                            size={18}
                            className="text-white"
                          />
                        </button>
                      </div>

                      {/* CONTENT */}

                      <div className="p-6">
                        <div className="flex items-center justify-between gap-3">
                          <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs uppercase text-cyan-300">
                            {category}
                          </span>

                          {rating ? (
                            <div className="flex items-center gap-1 text-yellow-400">
                              <Star
                                size={15}
                                fill="currentColor"
                              />

                              <span>
                                {rating}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs font-semibold text-slate-500">
                              {t(
                                "home.new",
                                {
                                  defaultValue:
                                    "New",
                                }
                              )}
                            </span>
                          )}
                        </div>

                        <h3 className="mt-4 text-2xl font-bold text-white">
                          {productName}
                        </h3>

                        <p className="mt-2 text-sm font-semibold text-cyan-400">
                          {subcategory}
                        </p>

                        <p className="mt-1 text-slate-400">
                          {supplier}
                        </p>

                        {description && (
                          <p className="mt-3 line-clamp-3 text-sm text-slate-500">
                            {description}
                          </p>
                        )}

                        {/* PRICE + MOQ */}

                        <div className="mt-6 grid grid-cols-2 gap-5">
                          <div>
                            <p className="text-sm text-slate-500">
                              {t(
                                "home.price",
                                {
                                  defaultValue:
                                    "Price",
                                }
                              )}
                            </p>

                            <h2 className="text-3xl font-bold text-cyan-400">
                              ₹
                              {formatPrice(
                                product?.price
                              )}

                              <span className="text-sm font-normal text-slate-500">
                                /
                                {getUnit(
                                  product
                                )}
                              </span>
                            </h2>
                          </div>

                          <div className="text-right">
                            <p className="text-sm text-slate-500">
                              {t(
                                "home.moq",
                                {
                                  defaultValue:
                                    "MOQ",
                                }
                              )}
                            </p>

                            <h3 className="font-semibold text-white">
                              {moq}
                            </h3>
                          </div>
                        </div>

                        {/* ACTIONS */}

                        <div className="mt-8 grid grid-cols-2 gap-3">
                          <Link
                            to={`/product/${encodeURIComponent(
                              productId
                            )}`}
                            className="flex items-center justify-center gap-2 rounded-xl border border-slate-600 py-3 text-white transition hover:bg-slate-700"
                          >
                            <Eye size={18} />

                            {t(
                              "home.details",
                              {
                                defaultValue:
                                  "Details",
                              }
                            )}
                          </Link>

                          <Link
                            to={`/product/${encodeURIComponent(
                              productId
                            )}`}
                            className="rounded-xl bg-linear-to-r from-blue-600 to-cyan-500 py-3 text-center font-semibold text-white transition hover:opacity-90"
                          >
                            {t(
                              "home.requestQuote",
                              {
                                defaultValue:
                                  "Request Quote",
                              }
                            )}
                          </Link>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </div>

              {/* EXPLORE ALL */}

              <div className="mt-12 text-center">
                <Link
                  to="/marketplace"
                  className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/40 bg-cyan-400/10 px-6 py-3 font-bold text-cyan-300 transition hover:bg-cyan-400 hover:text-slate-950"
                >
                  {t(
                    "home.exploreAllProducts",
                    {
                      defaultValue:
                        "Explore All Products",
                    }
                  )}

                  <Eye size={18} />
                </Link>
              </div>
            </>
          )}
      </div>
    </section>
  );
}