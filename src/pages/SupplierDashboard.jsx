import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Trash2,
  PackageCheck,
  Eye,
  ShieldCheck,
  Pencil,
  ImagePlus,
  X,
  RefreshCw,
  Save,
  Truck,
} from "lucide-react";
import WorkspaceWelcome from "../components/WorkspaceWelcome";
import { orderApi, productApi } from "../services/api";

const CATEGORY_SUBCATEGORIES = {
  cotton: [
    "Cotton Poplin",
    "Cotton Jersey",
    "Cotton Twill",
    "Cotton Canvas",
  ],
  denim: [
    "Stretch Denim",
    "Raw Denim",
    "Washed Denim",
    "Denim Twill",
  ],
  silk: [
    "Mulberry Silk",
    "Silk Satin",
    "Silk Crepe",
    "Silk Organza",
  ],
  linen: [
    "Pure Linen",
    "Linen Blend",
    "European Linen",
    "Linen Twill",
  ],
  polyester: [
    "Polyester Satin",
    "Polyester Crepe",
    "Performance Polyester",
    "Polyester Blend",
  ],
  "custom-fabric": [
    "Printed Custom Fabric",
    "Designer Fabric",
    "Private Label Fabric",
    "Made-to-Spec Fabric",
  ],
};

const CATEGORY_NAMES = {
  cotton: "Cotton",
  denim: "Denim",
  silk: "Silk",
  linen: "Linen",
  polyester: "Polyester",
  "custom-fabric": "Custom Fabric",
};

const emptyForm = {
  name: "",
  category: "cotton",
  subcategory: "Cotton Poplin",
  price: "",
  moq: "",
  stock: "",
  image: "",
  description: "",
  available: true,
};

function getImageUrl(image) {
  if (!image) return "";

  if (
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("data:")
  ) {
    return image;
  }

  const apiUrl = (
    import.meta.env.VITE_API_URL || "http://localhost:8000"
  ).replace(/\/$/, "");

  return `${apiUrl}${image.startsWith("/") ? image : `/${image}`}`;
}

export default function SupplierDashboard() {
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [uploadingId, setUploadingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fileInputs = useRef({});

  const subcategories = useMemo(
    () => CATEGORY_SUBCATEGORIES[form.category] || [],
    [form.category]
  );

  const loadProducts = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await productApi.mine();

      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Supplier products error:", err);
      setError(
        err?.message || "Unable to load supplier products."
      );
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    setOrdersLoading(true);

    try {
      const data = await orderApi.supplier();

      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Supplier orders error:", err);

      // Orders should not make the whole supplier dashboard fail.
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  const loadDashboard = async () => {
    await Promise.all([
      loadProducts(),
      loadOrders(),
    ]);
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const resetForm = () => {
    setForm({
      ...emptyForm,
      category: "cotton",
      subcategory: CATEGORY_SUBCATEGORIES.cotton[0],
    });

    setEditingId(null);
  };

  const change = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    if (name === "category") {
      setForm((current) => ({
        ...current,
        category: value,
        subcategory:
          CATEGORY_SUBCATEGORIES[value]?.[0] || "",
      }));

      return;
    }

    setForm((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const startEdit = (product) => {
    setError("");
    setSuccess("");

    setEditingId(product.id);

    const category =
      CATEGORY_SUBCATEGORIES[product.category]
        ? product.category
        : "cotton";

    const validSubcategories =
      CATEGORY_SUBCATEGORIES[category] || [];

    const selectedSubcategory =
      product.subcategory &&
      validSubcategories.some(
        (item) =>
          item.toLowerCase() ===
          String(product.subcategory).toLowerCase()
      )
        ? validSubcategories.find(
            (item) =>
              item.toLowerCase() ===
              String(product.subcategory).toLowerCase()
          )
        : validSubcategories[0];

    setForm({
      name: product.name || "",
      category,
      subcategory: selectedSubcategory || "",
      price: product.price ?? "",
      moq: product.moq ?? "",
      stock: product.stock ?? "",
      image: product.image || "",
      description: product.description || "",
      available: product.available !== false,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const saveProduct = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.name.trim()) {
      setError("Product name is required.");
      return;
    }

    if (!form.category) {
      setError("Category is required.");
      return;
    }

    if (!form.subcategory) {
      setError("Subcategory is required.");
      return;
    }

    if (!form.price || Number(form.price) <= 0) {
      setError("Enter a valid product price.");
      return;
    }

    if (!String(form.moq).trim()) {
      setError("MOQ is required.");
      return;
    }

    if (Number(form.stock || 0) < 0) {
      setError("Stock cannot be negative.");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        name: form.name.trim(),
        category: form.category,
        subcategory: form.subcategory,
        description: form.description.trim(),
        price: Number(form.price),
        moq: String(form.moq).trim(),
        stock: Number(form.stock || 0),
        image: form.image || "",
        available: Boolean(form.available),
      };

      if (editingId) {
        await productApi.update(
          editingId,
          payload
        );

        setSuccess(
          "Product updated successfully. It will require verification again."
        );
      } else {
        await productApi.create(payload);

        setSuccess(
          "Product created successfully. It is now pending admin verification."
        );
      }

      resetForm();
      await loadProducts();
    } catch (err) {
      console.error("Save product error:", err);

      setError(
        err?.message || "Unable to save product."
      );
    } finally {
      setSaving(false);
    }
  };

  const removeProduct = async (id) => {
    const confirmed = window.confirm(
      "Delete this product permanently? This action cannot be undone."
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");
    setDeletingId(id);

    try {
      await productApi.remove(id);

      if (editingId === id) {
        resetForm();
      }

      setSuccess(
        "Product deleted successfully."
      );

      await loadProducts();
    } catch (err) {
      console.error("Delete product error:", err);

      setError(
        err?.message || "Unable to delete product."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const chooseImage = (id) => {
    fileInputs.current[id]?.click();
  };

  const uploadImage = async (id, event) => {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file) return;

    if (
      ![
        "image/jpeg",
        "image/png",
        "image/webp",
      ].includes(file.type)
    ) {
      setError(
        "Only JPG, PNG or WebP images are allowed."
      );

      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(
        "Image must be 5MB or smaller."
      );

      return;
    }

    setError("");
    setSuccess("");
    setUploadingId(id);

    try {
      await productApi.uploadImage(
        id,
        file
      );

      setSuccess(
        "Product image updated successfully."
      );

      await loadProducts();
    } catch (err) {
      console.error("Upload image error:", err);

      setError(
        err?.message ||
          "Unable to upload product image."
      );
    } finally {
      setUploadingId(null);
    }
  };

  const deleteImage = async (product) => {
    const confirmed = window.confirm(
      "Remove the current product image?"
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");
    setUploadingId(product.id);

    try {
      await productApi.removeImage(
        product.id
      );

      setSuccess(
        "Product image deleted successfully."
      );

      await loadProducts();
    } catch (err) {
      console.error("Delete image error:", err);

      setError(
        err?.message ||
          "Unable to delete product image."
      );
    } finally {
      setUploadingId(null);
    }
  };

  const verifiedCount = items.filter(
    (item) => item.verified
  ).length;

  const pendingCount = items.filter(
    (item) => !item.verified
  ).length;

  const activeOrders = orders.filter(
    (order) =>
      !["delivered", "cancelled", "completed"].includes(
        String(order?.status || "").toLowerCase()
      )
  ).length;

  return (
    <main className="min-h-screen bg-slate-950 text-white pt-32 pb-20 px-6">
      <div className="mx-auto max-w-7xl px-6 pt-32">
        <WorkspaceWelcome role="Supplier" />
      </div>
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <section className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">

          <div>
            <p className="text-cyan-400 text-xs uppercase tracking-widest font-bold">
              Supplier Workspace
            </p>

            <h1 className="text-4xl md:text-5xl font-black mt-2">
              Manage your textile catalog.
            </h1>

            <p className="text-slate-400 mt-3 max-w-3xl">
              Add, update and manage your products through
              the TEXVERSE backend. Every product belongs to
              a category and mandatory subcategory.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">

            <button
              type="button"
              onClick={loadDashboard}
              disabled={
                loading || ordersLoading
              }
              className="inline-flex items-center gap-2 text-slate-300 hover:text-cyan-400 font-bold disabled:opacity-50"
            >
              <RefreshCw
                size={17}
                className={
                  loading || ordersLoading
                    ? "animate-spin"
                    : ""
                }
              />

              Refresh
            </button>

            <Link
              to="/help/supplier"
              className="text-cyan-400 font-bold"
            >
              Supplier Help →
            </Link>

          </div>
        </section>

        {/* STATUS */}
        {error && (
          <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 text-red-300 p-4">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 p-4">
            {success}
          </div>
        )}

        {/* STATS */}
        <section className="grid md:grid-cols-4 gap-5 mt-10">

          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
            <p className="text-slate-500">
              Your Products
            </p>

            <b className="text-3xl block mt-2">
              {items.length}
            </b>
          </div>

          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
            <p className="text-slate-500">
              Verified Products
            </p>

            <b className="text-3xl block mt-2">
              {verifiedCount}
            </b>
          </div>

          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
            <p className="text-slate-500">
              Pending Verification
            </p>

            <b className="text-3xl block mt-2">
              {pendingCount}
            </b>
          </div>

          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
            <p className="text-slate-500">
              Active Orders
            </p>

            <b className="text-3xl block mt-2">
              {activeOrders}
            </b>
          </div>

        </section>

        {/* ADD / EDIT */}
        <section className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-7">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div className="flex items-center gap-3">

              {editingId ? (
                <Pencil className="text-cyan-400" />
              ) : (
                <Plus className="text-cyan-400" />
              )}

              <div>
                <h2 className="text-2xl font-black">
                  {editingId
                    ? "Edit Product"
                    : "Add New Fabric"}
                </h2>

                <p className="text-slate-500 text-sm mt-1">
                  Category and subcategory are mandatory.
                </p>
              </div>

            </div>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center gap-2 text-slate-400 hover:text-white"
              >
                <X size={17} />
                Cancel Edit
              </button>
            )}

          </div>

          <form onSubmit={saveProduct}>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-7">

              <input
                required
                name="name"
                value={form.name}
                onChange={change}
                placeholder="Product name"
                className="rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 outline-none focus:border-cyan-400"
              />

              <select
                required
                name="category"
                value={form.category}
                onChange={change}
                className="rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 outline-none focus:border-cyan-400"
              >
                {Object.entries(
                  CATEGORY_NAMES
                ).map(([value, label]) => (
                  <option
                    key={value}
                    value={value}
                  >
                    {label}
                  </option>
                ))}
              </select>

              <select
                required
                name="subcategory"
                value={form.subcategory}
                onChange={change}
                className="rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 outline-none focus:border-cyan-400"
              >
                {subcategories.map(
                  (subcategory) => (
                    <option
                      key={subcategory}
                      value={subcategory}
                    >
                      {subcategory}
                    </option>
                  )
                )}
              </select>

              <input
                required
                name="price"
                value={form.price}
                onChange={change}
                type="number"
                min="0.01"
                step="0.01"
                placeholder="Price per meter"
                className="rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 outline-none focus:border-cyan-400"
              />

              <input
                required
                name="moq"
                value={form.moq}
                onChange={change}
                placeholder="MOQ in meters"
                className="rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 outline-none focus:border-cyan-400"
              />

              <input
                name="stock"
                value={form.stock}
                onChange={change}
                type="number"
                min="0"
                placeholder="Stock in meters"
                className="rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 outline-none focus:border-cyan-400"
              />

              <input
                name="image"
                value={form.image}
                onChange={change}
                placeholder="Optional image URL"
                className="rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 outline-none focus:border-cyan-400 lg:col-span-2"
              />

              <label className="rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="available"
                  checked={form.available}
                  onChange={change}
                  className="w-4 h-4"
                />

                <span className="text-sm">
                  Product available for sale
                </span>
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={change}
                placeholder="Product description"
                rows={4}
                className="rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 outline-none focus:border-cyan-400 md:col-span-2 lg:col-span-3"
              />

            </div>

            <button
              type="submit"
              disabled={saving}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 text-slate-950 font-black disabled:opacity-50"
            >
              {saving ? (
                <RefreshCw
                  size={18}
                  className="animate-spin"
                />
              ) : editingId ? (
                <Save size={18} />
              ) : (
                <Plus size={18} />
              )}

              {saving
                ? "Saving..."
                : editingId
                ? "Update Product"
                : "Add Product"}
            </button>

          </form>
        </section>

        {/* PRODUCTS */}
        <section className="mt-10">

          <div>
            <h2 className="text-3xl font-black">
              My Products
            </h2>

            <p className="text-slate-500 mt-1">
              Products loaded from your authenticated supplier account.
            </p>
          </div>

          {loading ? (
            <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900 p-10 text-center text-slate-400">
              Loading your products...
            </div>
          ) : items.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900 p-10 text-center">

              <PackageCheck
                size={42}
                className="mx-auto text-slate-600"
              />

              <p className="text-slate-400 mt-4">
                No supplier products found.
              </p>

              <p className="text-slate-600 text-sm mt-2">
                Add your first product using the form above.
              </p>

            </div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">

              {items.map((product) => {
                const imageUrl =
                  getImageUrl(product.image);

                return (
                  <article
                    key={product.id}
                    className="rounded-3xl overflow-hidden border border-slate-800 bg-slate-900"
                  >

                    {/* IMAGE */}
                    <div className="relative bg-slate-800">

                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={product.name}
                          className="w-full h-52 object-cover"
                          onError={(event) => {
                            event.currentTarget.style.display =
                              "none";
                          }}
                        />
                      ) : (
                        <div className="w-full h-52 grid place-items-center text-slate-600">
                          <ImagePlus size={42} />
                        </div>
                      )}

                      <div className="absolute top-3 right-3 flex gap-2">

                        <input
                          ref={(element) => {
                            fileInputs.current[
                              product.id
                            ] = element;
                          }}
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="hidden"
                          onChange={(event) =>
                            uploadImage(
                              product.id,
                              event
                            )
                          }
                        />

                        <button
                          type="button"
                          onClick={() =>
                            chooseImage(product.id)
                          }
                          disabled={
                            uploadingId ===
                            product.id
                          }
                          className="rounded-xl bg-slate-950/90 border border-slate-700 px-3 py-2 text-cyan-300 inline-flex items-center gap-2 disabled:opacity-50"
                        >
                          {uploadingId ===
                          product.id ? (
                            <RefreshCw
                              size={15}
                              className="animate-spin"
                            />
                          ) : (
                            <ImagePlus size={15} />
                          )}

                          {product.image
                            ? "Change"
                            : "Upload"}
                        </button>

                        {product.image && (
                          <button
                            type="button"
                            onClick={() =>
                              deleteImage(product)
                            }
                            disabled={
                              uploadingId ===
                              product.id
                            }
                            className="rounded-xl bg-red-950/90 border border-red-500/30 px-3 py-2 text-red-300 disabled:opacity-50"
                            title="Delete image"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}

                      </div>
                    </div>

                    {/* CONTENT */}
                    <div className="p-5">

                      <div className="flex justify-between gap-3 items-start">

                        <div className="flex flex-wrap gap-2">

                          <span className="text-cyan-400 text-xs uppercase font-bold bg-cyan-400/10 px-2 py-1 rounded-lg">
                            {CATEGORY_NAMES[
                              product.category
                            ] ||
                              product.category}
                          </span>

                          <span className="text-xs text-slate-300 bg-slate-800 px-2 py-1 rounded-lg">
                            {product.subcategory ||
                              "General"}
                          </span>

                        </div>

                        {product.verified ? (
                          <ShieldCheck
                            size={18}
                            className="text-emerald-400 shrink-0"
                          />
                        ) : (
                          <span className="text-xs text-amber-400">
                            Pending
                          </span>
                        )}

                      </div>

                      <h3 className="text-xl font-black mt-4">
                        {product.name}
                      </h3>

                      <p className="text-slate-400 text-sm mt-2 line-clamp-2">
                        {product.description ||
                          "No description added."}
                      </p>

                      <p className="text-cyan-400 font-bold mt-4">
                        ₹{product.price}/meter
                        {" · "}
                        MOQ {product.moq}
                      </p>

                      <p className="text-slate-500 text-sm mt-1">
                        Stock:{" "}
                        {product.stock ?? 0}
                      </p>

                      <div className="mt-5 grid grid-cols-3 gap-2">

                        <Link
                          to={`/product/${product.id}`}
                          className="rounded-xl border border-slate-700 py-2 text-center inline-flex justify-center items-center gap-1 hover:border-cyan-400"
                        >
                          <Eye size={15} />
                          View
                        </Link>

                        <button
                          type="button"
                          onClick={() =>
                            startEdit(product)
                          }
                          className="rounded-xl border border-slate-700 py-2 inline-flex justify-center items-center gap-1 hover:border-cyan-400"
                        >
                          <Pencil size={15} />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            removeProduct(
                              product.id
                            )
                          }
                          disabled={
                            deletingId ===
                            product.id
                          }
                          className="rounded-xl border border-red-500/20 text-red-300 py-2 inline-flex justify-center items-center gap-1 disabled:opacity-50"
                        >
                          {deletingId ===
                          product.id ? (
                            <RefreshCw
                              size={15}
                              className="animate-spin"
                            />
                          ) : (
                            <Trash2 size={15} />
                          )}

                          Delete
                        </button>

                      </div>
                    </div>
                  </article>
                );
              })}

            </div>
          )}
        </section>

        {/* SUPPLIER ORDERS */}
        <section className="mt-12 rounded-3xl border border-slate-800 bg-slate-900 p-7">

          <div className="flex items-center gap-3">
            <Truck className="text-cyan-400" />

            <div>
              <h2 className="text-3xl font-black">
                Supplier Orders
              </h2>

              <p className="text-slate-500 mt-1">
                Orders containing products from your supplier account.
              </p>
            </div>
          </div>

          {ordersLoading ? (
            <div className="mt-6 rounded-2xl bg-slate-800 p-8 text-center text-slate-400">
              Loading supplier orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="mt-6 rounded-2xl bg-slate-800 p-8 text-center">

              <p className="text-slate-300 font-semibold">
                No Supplier Orders Yet
              </p>

              <p className="text-sm text-slate-500 mt-2">
                Buyer orders containing your products will appear here.
              </p>

            </div>
          ) : (
            <div className="mt-6 space-y-4">

              {orders.slice(0, 10).map(
                (order, index) => (
                  <article
                    key={
                      order?.id ||
                      index
                    }
                    className="rounded-2xl bg-slate-800 border border-slate-700 p-5"
                  >

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                      <div>
                        <h3 className="font-black text-lg">
                          Order #
                          {order?.id ||
                            "—"}
                        </h3>

                        <p className="text-sm text-slate-500 mt-1">
                          Status:{" "}
                          {order?.status ||
                            "Pending"}
                        </p>
                      </div>

                      <span className="w-fit rounded-full bg-cyan-400/10 border border-cyan-400/20 px-4 py-2 text-sm font-bold text-cyan-400">
                        {order?.status ||
                          "Pending"}
                      </span>

                    </div>

                    {Array.isArray(
                      order?.items
                    ) &&
                      order.items.length >
                        0 && (
                        <div className="mt-5 space-y-2">

                          {order.items.map(
                            (item, itemIndex) => (
                              <div
                                key={
                                  item?.id ||
                                  item?.product_id ||
                                  itemIndex
                                }
                                className="rounded-xl bg-slate-900/70 border border-slate-700 p-4"
                              >

                                <p className="font-semibold">
                                  {item?.name ||
                                    item?.product_name ||
                                    `Product #${
                                      item?.product_id ||
                                      "—"
                                    }`}
                                </p>

                                <p className="text-sm text-slate-500 mt-1">
                                  Quantity:{" "}
                                  {item?.quantity ??
                                    "—"}
                                </p>

                              </div>
                            )
                          )}

                        </div>
                      )}

                  </article>
                )
              )}

            </div>
          )}

        </section>

        {/* INFO */}
        <div className="mt-10 rounded-2xl border border-cyan-400/10 bg-cyan-400/5 p-5 text-sm text-slate-400 flex gap-3 items-center">

          <PackageCheck className="text-cyan-400 shrink-0" />

          <span>
            Product changes are saved to the TEXVERSE backend.
            Updating an approved product sends it back for
            verification. Uploaded product images are stored
            through the backend upload system.
          </span>

        </div>

      </div>
    </main>
  );
}