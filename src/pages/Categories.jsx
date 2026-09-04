import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ChevronRight,
  Package,
  ArrowLeft,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { productApi, getImageUrl } from "../services/api";
import localCategories from "../data/categories";

const CATEGORY_INFO = {
  cotton: {
    name: "Cotton",
    description:
      "Breathable, versatile cotton constructions for everyday and premium apparel.",
  },
  denim: {
    name: "Denim",
    description:
      "Structured and stretch denim for jeans, jackets, workwear and lifestyle products.",
  },
  silk: {
    name: "Silk",
    description:
      "Premium silk constructions for luxury apparel, bridalwear and accessories.",
  },
  linen: {
    name: "Linen",
    description:
      "Natural and blended linen fabrics for breathable fashion and home textiles.",
  },
  polyester: {
    name: "Polyester",
    description:
      "Reliable performance fabrics for fashion, uniforms and technical applications.",
  },
  "custom-fabric": {
    name: "Custom Fabric",
    description:
      "Made-to-spec textile development for private-label and bulk buyers.",
  },
};

function normalizeCategory(value = "") {
  return value
    .trim()
    .toLowerCase()
    .replace(/_/g, "-")
    .replace(/\s+/g, "-");
}

export default function Categories() {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedCategory = normalizeCategory(
    searchParams.get("category") || ""
  );

  const selectedSubcategory =
    searchParams.get("subcategory") || "";

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const [error, setError] = useState("");

  /* =====================================================
     LOAD CATEGORIES
  ===================================================== */

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      setLoadingCategories(true);
      setError("");

      const data = await productApi.categories();

      const apiCategories = Array.isArray(data) ? data : [];

      /*
       * Merge backend category data with local category images.
       * Backend remains authoritative for category/subcategory names.
       */
      const merged = apiCategories.map((category) => {
        const local = localCategories.find(
          (item) =>
            normalizeCategory(item.id || item.name) ===
            normalizeCategory(category.id || category.name)
        );

        return {
          ...category,
          image:
            category.image ||
            local?.image ||
            "",
        };
      });

      setCategories(merged);
    } catch (err) {
      setError(
        err.message || "Unable to load textile categories."
      );
    } finally {
      setLoadingCategories(false);
    }
  }

  /* =====================================================
     LOAD PRODUCTS WHEN CATEGORY / SUBCATEGORY CHANGES
  ===================================================== */

  useEffect(() => {
    if (!selectedCategory) {
      setProducts([]);
      return;
    }

    loadProducts(
      selectedCategory,
      selectedSubcategory
    );
  }, [selectedCategory, selectedSubcategory]);

  async function loadProducts(
    category,
    subcategory = ""
  ) {
    try {
      setLoadingProducts(true);
      setError("");

      const params = new URLSearchParams();

      params.set("category", category);

      if (subcategory) {
        params.set("subcategory", subcategory);
      }

      const data = await productApi.list(
        params.toString()
      );

      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setProducts([]);

      setError(
        err.message || "Unable to load products."
      );
    } finally {
      setLoadingProducts(false);
    }
  }

  /* =====================================================
     CATEGORY DATA
  ===================================================== */

  const selectedCategoryData = useMemo(() => {
    return categories.find(
      (item) =>
        normalizeCategory(item.id || item.name) ===
        selectedCategory
    );
  }, [categories, selectedCategory]);

  const categoryName =
    CATEGORY_INFO[selectedCategory]?.name ||
    selectedCategoryData?.name ||
    selectedCategory
      .replace(/-/g, " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );

  const categoryDescription =
    CATEGORY_INFO[selectedCategory]?.description ||
    "Explore verified textile products and suppliers.";

  /* =====================================================
     CATEGORY PRODUCT COUNT
  ===================================================== */

  const [categoryCounts, setCategoryCounts] = useState({});

  useEffect(() => {
    if (!categories.length) return;

    let cancelled = false;

    async function loadCounts() {
      const counts = {};

      await Promise.all(
        categories.map(async (category) => {
          try {
            const data = await productApi.list(
              `category=${encodeURIComponent(
                category.id
              )}`
            );

            counts[category.id] = Array.isArray(data)
              ? data.length
              : 0;
          } catch {
            counts[category.id] = 0;
          }
        })
      );

      if (!cancelled) {
        setCategoryCounts(counts);
      }
    }

    loadCounts();

    return () => {
      cancelled = true;
    };
  }, [categories]);

  /* =====================================================
     NAVIGATION
  ===================================================== */

  function openCategory(category) {
    setProducts([]);

    setSearchParams({
      category: normalizeCategory(category),
    });
  }

  function openSubcategory(subcategory) {
    setSearchParams({
      category: selectedCategory,
      subcategory,
    });
  }

  function goBack() {
    if (selectedSubcategory) {
      setSearchParams({
        category: selectedCategory,
      });

      return;
    }

    if (selectedCategory) {
      setSearchParams({});
    }
  }

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <main className="min-h-screen bg-slate-950 text-white pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">

          <div>
            <p className="text-cyan-400 text-xs uppercase tracking-[0.25em] font-bold">
              TEXVERSE Catalog
            </p>

            <h1 className="text-4xl md:text-5xl font-black mt-2">
              {!selectedCategory
                ? "Browse Textile Categories"
                : selectedSubcategory
                ? selectedSubcategory
                : categoryName}
            </h1>

            <p className="text-slate-400 max-w-3xl mt-4 leading-7">
              {!selectedCategory
                ? "Choose a main textile category, then select a subcategory to discover verified products."
                : selectedSubcategory
                ? `Verified products available under ${selectedSubcategory}.`
                : categoryDescription}
            </p>
          </div>

          {(selectedCategory ||
            selectedSubcategory) && (
            <button
              onClick={goBack}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 font-bold text-slate-200 hover:border-cyan-400 hover:text-cyan-400 transition"
            >
              <ArrowLeft size={17} />
              Back
            </button>
          )}
        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="mt-8 rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-red-300">
            {error}
          </div>
        )}

        {/* =================================================
            LEVEL 1
            MAIN CATEGORIES
        ================================================= */}

        {!selectedCategory && (
          <section className="mt-10">

            {loadingCategories ? (
              <div className="min-h-75 grid place-items-center">
                <Loader2
                  className="animate-spin text-cyan-400"
                  size={34}
                />
              </div>
            ) : categories.length === 0 ? (
              <div className="rounded-3xl border border-slate-800 bg-slate-900 p-10 text-center">
                <Package
                  size={45}
                  className="mx-auto text-slate-600"
                />

                <h2 className="text-2xl font-black mt-5">
                  No categories available
                </h2>

                <p className="text-slate-500 mt-2">
                  The textile catalog is currently unavailable.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

                {categories.map((category) => {
                  const info =
                    CATEGORY_INFO[
                      normalizeCategory(category.id)
                    ];

                  const count =
                    categoryCounts[category.id] ?? 0;

                  return (
                    <button
                      key={category.id}
                      onClick={() =>
                        openCategory(category.id)
                      }
                      className="text-left rounded-3xl border border-slate-800 bg-slate-900 overflow-hidden hover:border-cyan-400/50 hover:-translate-y-1 transition-all group"
                    >

                      {/* IMAGE */}

                      <div className="h-48 bg-slate-800 overflow-hidden">

                        {category.image ? (
                          <img
                            src={getImageUrl(
                              category.image
                            )}
                            alt={
                              info?.name ||
                              category.name
                            }
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(event) => {
                              event.currentTarget.style.display =
                                "none";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full grid place-items-center">
                            <Package
                              size={48}
                              className="text-slate-600"
                            />
                          </div>
                        )}

                      </div>

                      {/* CONTENT */}

                      <div className="p-6">

                        <div className="flex items-center justify-between gap-3">

                          <h2 className="text-2xl font-black">
                            {info?.name ||
                              category.name}
                          </h2>

                          <ChevronRight
                            className="text-cyan-400 group-hover:translate-x-1 transition-transform"
                            size={22}
                          />

                        </div>

                        <p className="text-slate-500 text-sm mt-2">
                          {count} product
                          {count !== 1 ? "s" : ""} in catalog
                        </p>

                        <p className="text-slate-400 mt-4 leading-6">
                          {info?.description ||
                            "Explore verified textile products."}
                        </p>

                        <div className="mt-5 text-cyan-400 font-bold">
                          Explore →
                        </div>

                      </div>
                    </button>
                  );
                })}

              </div>
            )}
          </section>
        )}

        {/* =================================================
            LEVEL 2
            SUBCATEGORIES
        ================================================= */}

        {selectedCategory &&
          !selectedSubcategory && (
            <section className="mt-10">

              {selectedCategoryData ? (
                <>
                  <div className="flex items-center gap-3 mb-6">

                    <span className="w-10 h-10 rounded-xl bg-cyan-400/10 text-cyan-400 grid place-items-center">
                      <Package size={20} />
                    </span>

                    <div>
                      <h2 className="text-2xl font-black">
                        {categoryName} Subcategories
                      </h2>

                      <p className="text-slate-500 text-sm">
                        Select a subcategory to view
                        products.
                      </p>
                    </div>

                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">

                    {(
                      selectedCategoryData.subcategories ||
                      []
                    ).map((subcategory) => (
                      <button
                        key={subcategory}
                        onClick={() =>
                          openSubcategory(
                            subcategory
                          )
                        }
                        className="group text-left rounded-2xl border border-slate-800 bg-slate-900 p-6 hover:border-cyan-400/50 hover:bg-slate-900/80 transition-all"
                      >

                        <div className="flex items-center justify-between gap-3">

                          <h3 className="font-black text-lg">
                            {subcategory}
                          </h3>

                          <ChevronRight
                            size={18}
                            className="text-cyan-400 group-hover:translate-x-1 transition-transform"
                          />

                        </div>

                        <p className="text-slate-500 text-sm mt-3">
                          View available{" "}
                          {subcategory.toLowerCase()}{" "}
                          products.
                        </p>

                        <div className="mt-5 text-cyan-400 text-sm font-bold">
                          View Products →
                        </div>

                      </button>
                    ))}

                  </div>
                </>
              ) : (
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-slate-400">
                  Category not found.
                </div>
              )}

            </section>
          )}

        {/* =================================================
            LEVEL 3
            PRODUCTS
        ================================================= */}

        {selectedCategory &&
          selectedSubcategory && (
            <section className="mt-10">

              {loadingProducts ? (
                <div className="min-h-75 grid place-items-center">
                  <Loader2
                    className="animate-spin text-cyan-400"
                    size={34}
                  />
                </div>
              ) : products.length === 0 ? (
                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-10 text-center">

                  <Package
                    size={42}
                    className="mx-auto text-slate-600"
                  />

                  <h2 className="text-2xl font-black mt-5">
                    No products found
                  </h2>

                  <p className="text-slate-500 mt-2">
                    No verified products are currently
                    available in this subcategory.
                  </p>

                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between gap-4 mb-6">

                    <div>
                      <h2 className="text-2xl font-black">
                        {selectedSubcategory}
                      </h2>

                      <p className="text-slate-500 mt-1">
                        {products.length} verified product
                        {products.length !== 1
                          ? "s"
                          : ""}{" "}
                        available
                      </p>
                    </div>

                  </div>

                  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

                    {products.map((product) => {

                      const imageUrl = getImageUrl(
                        product.image
                      );

                      return (
                        <article
                          key={product.id}
                          className="rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 hover:border-cyan-400/40 transition-all"
                        >

                          {/* PRODUCT IMAGE */}

                          <div className="h-56 bg-slate-800">

                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full grid place-items-center">
                                <Package
                                  size={48}
                                  className="text-slate-600"
                                />
                              </div>
                            )}

                          </div>

                          {/* PRODUCT DATA */}

                          <div className="p-6">

                            <div className="flex items-center justify-between gap-3">

                              <span className="text-cyan-400 text-xs uppercase tracking-wider font-bold">
                                {product.subcategory ||
                                  product.category}
                              </span>

                              {product.verified && (
                                <span className="text-emerald-400 text-xs font-bold inline-flex items-center gap-1">
                                  <ShieldCheck
                                    size={14}
                                  />
                                  Verified
                                </span>
                              )}

                            </div>

                            <h3 className="text-xl font-black mt-3">
                              {product.name}
                            </h3>

                            <p className="text-slate-500 text-sm mt-1">
                              {product.supplier ||
                                "Verified Supplier"}
                            </p>

                            <div className="grid grid-cols-2 gap-3 mt-5">

                              <div className="rounded-xl bg-slate-800 p-3">
                                <p className="text-xs text-slate-500">
                                  Price
                                </p>

                                <p className="text-cyan-400 font-black mt-1">
                                  ₹{product.price}/m
                                </p>
                              </div>

                              <div className="rounded-xl bg-slate-800 p-3">
                                <p className="text-xs text-slate-500">
                                  MOQ
                                </p>

                                <p className="font-black mt-1">
                                  {product.moq}
                                </p>
                              </div>

                            </div>

                            <Link
                              to={`/product/${product.id}`}
                              className="mt-5 block w-full rounded-xl bg-cyan-400 text-slate-950 text-center py-3 font-black hover:bg-cyan-300 transition"
                            >
                              View Product
                            </Link>

                          </div>

                        </article>
                      );
                    })}

                  </div>
                </>
              )}

            </section>
          )}

      </div>
    </main>
  );
}

