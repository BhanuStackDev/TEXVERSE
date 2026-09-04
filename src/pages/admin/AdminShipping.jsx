import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Package,
  RefreshCw,
  Search,
  ShieldCheck,
  Truck,
  UserCheck,
  XCircle,
} from "lucide-react";
import { shippingApi } from "../../services/api";

const EMPTY_FORM = {
  order_id: "",
  carrier: "",
  tracking_number: "",
  status: "Pending",
  current_location: "",
  eta: "",
  pickup_address: "",
  delivery_address: "",
  delivery_staff_id: "",
  vehicle_id: "",
  notes: "",
};

const STATUS_OPTIONS = [
  "Pending",
  "Processing",
  "In Transit",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
}

function formatEta(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (!Number.isNaN(date.getTime())) {
    return date.toLocaleString();
  }

  return value;
}

function toDateTimeLocal(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const pad = (number) => String(number).padStart(2, "0");

  return (
    [
      date.getFullYear(),
      pad(date.getMonth() + 1),
      pad(date.getDate()),
    ].join("-") +
    "T" +
    [pad(date.getHours()), pad(date.getMinutes())].join(":")
  );
}

function getStatusClasses(status) {
  const normalized = String(status || "")
    .toLowerCase()
    .trim();

  if (normalized === "delivered") {
    return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";
  }

  if (normalized === "in transit") {
    return "border-cyan-500/20 bg-cyan-500/10 text-cyan-400";
  }

  if (normalized === "out for delivery") {
    return "border-blue-500/20 bg-blue-500/10 text-blue-400";
  }

  if (normalized === "processing") {
    return "border-violet-500/20 bg-violet-500/10 text-violet-400";
  }

  if (normalized === "cancelled") {
    return "border-red-500/20 bg-red-500/10 text-red-400";
  }

  return "border-amber-500/20 bg-amber-500/10 text-amber-400";
}

export default function AdminShipping() {
  const navigate = useNavigate();

  const [shipments, setShipments] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [staff, setStaff] = useState([]);

  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");

  async function loadData(isRefresh = false) {
    if (isRefresh) {
      setLoading(true);
    }

    setError("");

    try {
      const [
        shipmentResponse,
        vehicleResponse,
        staffResponse,
      ] = await Promise.all([
        shippingApi.shipments(),
        shippingApi.vehicles(),
        shippingApi.staff(),
      ]);

      setShipments(
        Array.isArray(shipmentResponse)
          ? shipmentResponse
          : shipmentResponse?.shipments || []
      );

      setVehicles(
        Array.isArray(vehicleResponse)
          ? vehicleResponse
          : vehicleResponse?.vehicles || []
      );

      setStaff(
        Array.isArray(staffResponse)
          ? staffResponse
          : staffResponse?.staff ||
            staffResponse?.delivery_staff ||
            []
      );
    } catch (err) {
      setError(
        err?.message || "Unable to load shipping data."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function updateForm(field, value) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setError("");
  }

  function startEdit(shipment) {
    setSuccess("");
    setError("");

    setEditingId(shipment.id);

    setForm({
      order_id:
        shipment.order_id != null
          ? String(shipment.order_id)
          : "",

      carrier: shipment.carrier || "",

      tracking_number:
        shipment.tracking_number || "",

      status:
        shipment.status || "Pending",

      current_location:
        shipment.current_location || "",

      eta: toDateTimeLocal(shipment.eta),

      pickup_address:
        shipment.pickup_address || "",

      delivery_address:
        shipment.delivery_address || "",

      delivery_staff_id:
        shipment.delivery_staff_id != null
          ? String(shipment.delivery_staff_id)
          : "",

      vehicle_id:
        shipment.vehicle_id != null
          ? String(shipment.vehicle_id)
          : "",

      notes: shipment.notes || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.order_id) {
      setError("Order ID is required.");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        order_id: Number(form.order_id),

        carrier:
          form.carrier.trim() ||
          "TEXVERSE Logistics",

        status:
          form.status.trim() ||
          "Pending",

        current_location:
          form.current_location.trim(),

        eta: form.eta
          ? new Date(form.eta).toISOString()
          : null,

        pickup_address:
          form.pickup_address.trim(),

        delivery_address:
          form.delivery_address.trim(),

        delivery_staff_id:
          form.delivery_staff_id
            ? Number(form.delivery_staff_id)
            : null,

        vehicle_id:
          form.vehicle_id
            ? Number(form.vehicle_id)
            : null,

        notes: form.notes.trim(),
      };

      if (editingId) {
        await shippingApi.updateShipment(
          editingId,
          payload
        );

        setSuccess(
          "Shipment updated successfully."
        );
      } else {
        await shippingApi.createShipment(payload);

        setSuccess(
          "Shipment created successfully. Tracking number was generated automatically."
        );
      }

      resetForm();
      await loadData();
    } catch (err) {
      setError(
        err?.message || "Unable to save shipment."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(shipment) {
    const confirmed = window.confirm(
      `Delete shipment for Order #${shipment.order_id}?`
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      await shippingApi.deleteShipment(
        shipment.id
      );

      setSuccess(
        "Shipment deleted successfully."
      );

      if (editingId === shipment.id) {
        resetForm();
      }

      await loadData();
    } catch (err) {
      setError(
        err?.message || "Unable to delete shipment."
      );
    }
  }

  const filteredShipments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return shipments.filter((shipment) => {
      const matchesStatus =
        statusFilter === "All" ||
        String(shipment.status || "")
          .toLowerCase() ===
          statusFilter.toLowerCase();

      if (!matchesStatus) {
        return false;
      }

      if (!query) {
        return true;
      }

      const searchable = [
        shipment.order_id,
        shipment.tracking_number,
        shipment.carrier,
        shipment.status,
        shipment.current_location,
        shipment.pickup_address,
        shipment.delivery_address,
        shipment.delivery_staff?.name,
        shipment.vehicle?.registration_number,
      ]
        .filter(
          (value) =>
            value !== null &&
            value !== undefined
        )
        .join(" ")
        .toLowerCase();

      return searchable.includes(query);
    });
  }, [
    shipments,
    statusFilter,
    search,
  ]);

  const stats = useMemo(() => {
    const countStatus = (value) =>
      shipments.filter(
        (shipment) =>
          String(shipment.status || "")
            .toLowerCase() ===
          value.toLowerCase()
      ).length;

    return {
      total: shipments.length,
      pending: countStatus("Pending"),
      processing: countStatus("Processing"),
      transit: countStatus("In Transit"),
      delivered: countStatus("Delivered"),
    };
  }, [shipments]);

  const inputClass =
    "w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10";

  const labelClass =
    "mb-2 block text-sm font-semibold text-slate-300";

  return (
    <main className="min-h-screen bg-slate-950 text-white pt-28 px-6 pb-16">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">

          <div>
            <button
              type="button"
              onClick={() => navigate("/admin")}
              className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-cyan-400"
            >
              <ArrowLeft size={16} />
              Back to Admin Dashboard
            </button>

            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-400">
                <Truck size={24} />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-cyan-400">
                  TEXVERSE
                </p>

                <h1 className="text-3xl font-black md:text-4xl">
                  Shipping Management
                </h1>
              </div>
            </div>

            <p className="mt-3 max-w-3xl text-sm text-slate-400">
              Manage shipments, tracking, delivery staff
              and vehicles through the protected shipping
              system.
            </p>
          </div>

          <button
            type="button"
            onClick={() => loadData(true)}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-bold text-slate-300 transition hover:border-cyan-400 hover:text-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={
                loading ? "animate-spin" : ""
              }
            />
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* SECURITY */}
        <div className="mb-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div className="flex items-start gap-3">
              <ShieldCheck
                size={23}
                className="mt-0.5 shrink-0 text-emerald-400"
              />

              <div>
                <h2 className="font-bold">
                  Shipping Management Protected
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Shipment, vehicle and delivery staff
                  operations are protected by backend
                  authorization.
                </p>
              </div>
            </div>

            <span className="inline-flex items-center gap-2 text-sm font-bold text-emerald-400">
              <CheckCircle2 size={17} />
              SECURE
            </span>
          </div>
        </div>

        {/* ALERTS */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-5">
            <div className="flex items-start gap-3">
              <XCircle
                size={21}
                className="mt-0.5 shrink-0 text-red-400"
              />

              <div>
                <p className="font-bold text-red-300">
                  Shipping operation failed
                </p>

                <p className="mt-1 text-sm text-red-300/80">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5">
            <div className="flex items-center gap-3">
              <CheckCircle2
                size={21}
                className="text-emerald-400"
              />

              <p className="text-sm font-semibold text-emerald-300">
                {success}
              </p>
            </div>
          </div>
        )}

        {/* STATS */}
        <div className="mb-8 grid grid-cols-2 gap-5 md:grid-cols-5">

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Total
              </p>

              <Package
                size={20}
                className="text-cyan-400"
              />
            </div>

            <p className="mt-3 text-3xl font-black">
              {stats.total}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Pending
              </p>

              <Clock3
                size={20}
                className="text-amber-400"
              />
            </div>

            <p className="mt-3 text-3xl font-black">
              {stats.pending}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Processing
              </p>

              <Activity
                size={20}
                className="text-violet-400"
              />
            </div>

            <p className="mt-3 text-3xl font-black">
              {stats.processing}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">
                In Transit
              </p>

              <Truck
                size={20}
                className="text-cyan-400"
              />
            </div>

            <p className="mt-3 text-3xl font-black">
              {stats.transit}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Delivered
              </p>

              <CheckCircle2
                size={20}
                className="text-emerald-400"
              />
            </div>

            <p className="mt-3 text-3xl font-black">
              {stats.delivered}
            </p>
          </div>

        </div>

        {/* FORM */}
        <section className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">

          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <div className="flex items-center gap-2">
                <Truck
                  size={20}
                  className="text-cyan-400"
                />

                <h2 className="text-xl font-black">
                  {editingId
                    ? "Edit Shipment"
                    : "Create Shipment"}
                </h2>
              </div>

              <p className="mt-1 text-sm text-slate-500">
                Tracking number is generated automatically
                by TEXVERSE.
              </p>
            </div>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-bold text-slate-300 transition hover:border-slate-500 hover:bg-slate-800"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-5 md:grid-cols-2"
          >

            {/* ORDER */}
            <div>
              <label className={labelClass}>
                Order ID *
              </label>

              <input
                type="number"
                min="1"
                value={form.order_id}
                onChange={(event) =>
                  updateForm(
                    "order_id",
                    event.target.value
                  )
                }
                placeholder="Example: 12"
                className={inputClass}
                required
              />
            </div>

            {/* CARRIER */}
            <div>
              <label className={labelClass}>
                Carrier
              </label>

              <input
                type="text"
                value={form.carrier}
                onChange={(event) =>
                  updateForm(
                    "carrier",
                    event.target.value
                  )
                }
                placeholder="TEXVERSE Logistics"
                className={inputClass}
              />
            </div>

            {/* TRACKING */}
            {editingId && (
              <div>
                <label className={labelClass}>
                  Tracking Number
                </label>

                <input
                  type="text"
                  value={form.tracking_number}
                  readOnly
                  className="w-full cursor-not-allowed rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 font-mono text-sm font-bold text-cyan-400 outline-none"
                />

                <p className="mt-2 text-xs text-slate-600">
                  Generated by TEXVERSE. Cannot be manually
                  changed.
                </p>
              </div>
            )}

            {/* STATUS */}
            <div>
              <label className={labelClass}>
                Status
              </label>

              <select
                value={form.status}
                onChange={(event) =>
                  updateForm(
                    "status",
                    event.target.value
                  )
                }
                className={inputClass}
              >
                {STATUS_OPTIONS.map((status) => (
                  <option
                    key={status}
                    value={status}
                    className="bg-slate-900"
                  >
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* LOCATION */}
            <div>
              <label className={labelClass}>
                Current Location
              </label>

              <input
                type="text"
                value={form.current_location}
                onChange={(event) =>
                  updateForm(
                    "current_location",
                    event.target.value
                  )
                }
                placeholder="Example: Indore Hub"
                className={inputClass}
              />
            </div>

            {/* ETA */}
            <div>
              <label className={labelClass}>
                Estimated Delivery
              </label>

              <input
                type="datetime-local"
                value={form.eta}
                onChange={(event) =>
                  updateForm(
                    "eta",
                    event.target.value
                  )
                }
                className={inputClass}
              />
            </div>

            {/* PICKUP */}
            <div>
              <label className={labelClass}>
                Pickup Address
              </label>

              <textarea
                rows="3"
                value={form.pickup_address}
                onChange={(event) =>
                  updateForm(
                    "pickup_address",
                    event.target.value
                  )
                }
                placeholder="Pickup location"
                className={inputClass}
              />
            </div>

            {/* DELIVERY */}
            <div>
              <label className={labelClass}>
                Delivery Address
              </label>

              <textarea
                rows="3"
                value={form.delivery_address}
                onChange={(event) =>
                  updateForm(
                    "delivery_address",
                    event.target.value
                  )
                }
                placeholder="Customer delivery address"
                className={inputClass}
              />
            </div>

            {/* STAFF */}
            <div>
              <label className={labelClass}>
                Delivery Staff
              </label>

              <select
                value={form.delivery_staff_id}
                onChange={(event) =>
                  updateForm(
                    "delivery_staff_id",
                    event.target.value
                  )
                }
                className={inputClass}
              >
                <option
                  value=""
                  className="bg-slate-900"
                >
                  No staff assigned
                </option>

                {staff
                  .filter(
                    (member) =>
                      member.active ||
                      String(member.id) ===
                        String(
                          form.delivery_staff_id
                        )
                  )
                  .map((member) => (
                    <option
                      key={member.id}
                      value={member.id}
                      className="bg-slate-900"
                    >
                      {member.name}
                      {member.staff_code
                        ? ` — ${member.staff_code}`
                        : ""}
                    </option>
                  ))}
              </select>
            </div>

            {/* VEHICLE */}
            <div>
              <label className={labelClass}>
                Vehicle
              </label>

              <select
                value={form.vehicle_id}
                onChange={(event) =>
                  updateForm(
                    "vehicle_id",
                    event.target.value
                  )
                }
                className={inputClass}
              >
                <option
                  value=""
                  className="bg-slate-900"
                >
                  No vehicle assigned
                </option>

                {vehicles
                  .filter(
                    (vehicle) =>
                      vehicle.active ||
                      String(vehicle.id) ===
                        String(
                          form.vehicle_id
                        )
                  )
                  .map((vehicle) => (
                    <option
                      key={vehicle.id}
                      value={vehicle.id}
                      className="bg-slate-900"
                    >
                      {vehicle.registration_number}
                      {vehicle.vehicle_type
                        ? ` — ${vehicle.vehicle_type}`
                        : ""}
                    </option>
                  ))}
              </select>
            </div>

            {/* NOTES */}
            <div className="md:col-span-2">
              <label className={labelClass}>
                Notes
              </label>

              <textarea
                rows="3"
                value={form.notes}
                onChange={(event) =>
                  updateForm(
                    "notes",
                    event.target.value
                  )
                }
                placeholder="Internal shipping notes"
                className={inputClass}
              />
            </div>

            {/* BUTTONS */}
            <div className="flex flex-col gap-3 pt-2 sm:flex-row md:col-span-2">

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 font-black text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving && (
                  <RefreshCw
                    size={17}
                    className="animate-spin"
                  />
                )}

                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Shipment"
                  : "Create Shipment"}
              </button>

              <button
                type="button"
                onClick={resetForm}
                disabled={saving}
                className="rounded-xl border border-slate-700 bg-slate-950 px-6 py-3 font-bold text-slate-300 transition hover:border-slate-500 hover:bg-slate-800 disabled:opacity-50"
              >
                Clear
              </button>

            </div>
          </form>
        </section>

        {/* FILTERS */}
        <section className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-5">

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            <div>
              <label className={labelClass}>
                Search
              </label>

              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Order, tracking, carrier, location..."
                  className={`${inputClass} pl-11`}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>
                Status
              </label>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value
                  )
                }
                className={inputClass}
              >
                <option
                  value="All"
                  className="bg-slate-900"
                >
                  All Statuses
                </option>

                {STATUS_OPTIONS.map((status) => (
                  <option
                    key={status}
                    value={status}
                    className="bg-slate-900"
                  >
                    {status}
                  </option>
                ))}
              </select>
            </div>

          </div>
        </section>

        {/* SHIPMENTS */}
        <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">

          <div className="border-b border-slate-800 px-5 py-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <div className="flex items-center gap-2">
                  <Package
                    size={20}
                    className="text-cyan-400"
                  />

                  <h2 className="text-xl font-black">
                    Shipments
                  </h2>
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  {filteredShipments.length} shipment
                  {filteredShipments.length === 1
                    ? ""
                    : "s"}
                </p>
              </div>

              <div className="text-xs font-semibold text-slate-600">
                Live backend data
              </div>
            </div>
          </div>

          {loading ? (
            <div className="space-y-4 p-5">
              {Array.from({ length: 2 }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="h-64 animate-pulse rounded-2xl border border-slate-800 bg-slate-950"
                  />
                )
              )}
            </div>
          ) : filteredShipments.length === 0 ? (
            <div className="px-5 py-16 text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-slate-800 bg-slate-950">
                <Truck
                  size={24}
                  className="text-slate-600"
                />
              </div>

              <p className="mt-4 font-bold text-slate-300">
                No shipments found.
              </p>

              <p className="mt-1 text-sm text-slate-600">
                Create a shipment above or change your
                filters.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-800">

              {filteredShipments.map((shipment) => (
                <article
                  key={shipment.id}
                  className="p-5 transition hover:bg-slate-900/60"
                >

                  <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">

                    {/* LEFT */}
                    <div className="min-w-0 flex-1">

                      <div className="flex flex-wrap items-center gap-3">

                        <h3 className="text-xl font-black">
                          Order #{shipment.order_id}
                        </h3>

                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-bold ${getStatusClasses(
                            shipment.status
                          )}`}
                        >
                          {shipment.status ||
                            "Pending"}
                        </span>
                      </div>

                      {/* TRACKING */}
                      <div className="mt-4 rounded-2xl border border-cyan-500/10 bg-slate-950 p-4">

                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                          <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                              Tracking Number
                            </p>

                            <p className="mt-1 break-all font-mono text-sm font-black text-cyan-400">
                              {shipment.tracking_number ||
                                "Not generated"}
                            </p>
                          </div>

                          <span className="text-xs font-semibold text-slate-600">
                            TEXVERSE Tracking
                          </span>
                        </div>
                      </div>

                      {/* DETAILS */}
                      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                            Carrier
                          </p>

                          <p className="mt-1 text-sm font-semibold text-slate-300">
                            {shipment.carrier ||
                              "TEXVERSE Logistics"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                            Current Location
                          </p>

                          <p className="mt-1 text-sm font-semibold text-slate-300">
                            {shipment.current_location ||
                              "—"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                            ETA
                          </p>

                          <p className="mt-1 text-sm font-semibold text-slate-300">
                            {formatEta(
                              shipment.eta
                            )}
                          </p>
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <UserCheck
                              size={14}
                              className="text-cyan-400"
                            />

                            <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                              Delivery Staff
                            </p>
                          </div>

                          <p className="mt-1 text-sm font-semibold text-slate-300">
                            {shipment.delivery_staff
                              ?.name ||
                              "Not assigned"}
                          </p>

                          {shipment.delivery_staff
                            ?.phone && (
                            <p className="mt-1 text-xs text-slate-600">
                              {
                                shipment
                                  .delivery_staff
                                  .phone
                              }
                            </p>
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <Truck
                              size={14}
                              className="text-cyan-400"
                            />

                            <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                              Vehicle
                            </p>
                          </div>

                          <p className="mt-1 text-sm font-semibold text-slate-300">
                            {shipment.vehicle
                              ?.registration_number ||
                              "Not assigned"}
                          </p>

                          {shipment.vehicle
                            ?.vehicle_type && (
                            <p className="mt-1 text-xs text-slate-600">
                              {
                                shipment.vehicle
                                  .vehicle_type
                              }
                            </p>
                          )}
                        </div>

                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                            Created
                          </p>

                          <p className="mt-1 text-sm font-semibold text-slate-300">
                            {formatDate(
                              shipment.created_at
                            )}
                          </p>
                        </div>

                      </div>

                      {/* ADDRESSES */}
                      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">

                        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                          <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                            Pickup Address
                          </p>

                          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-400">
                            {shipment.pickup_address ||
                              "—"}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                          <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                            Delivery Address
                          </p>

                          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-400">
                            {shipment.delivery_address ||
                              "—"}
                          </p>
                        </div>

                      </div>

                      {/* NOTES */}
                      {shipment.notes && (
                        <div className="mt-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">

                          <p className="text-xs font-bold uppercase tracking-wider text-amber-400">
                            Internal Notes
                          </p>

                          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-amber-300/80">
                            {shipment.notes}
                          </p>

                        </div>
                      )}

                    </div>

                    {/* ACTIONS */}
                    <div className="flex shrink-0 flex-row gap-2 xl:flex-col">

                      <button
                        type="button"
                        onClick={() =>
                          startEdit(shipment)
                        }
                        className="rounded-xl border border-slate-700 bg-slate-950 px-5 py-2.5 text-sm font-bold text-slate-300 transition hover:border-cyan-400 hover:text-cyan-400"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(shipment)
                        }
                        className="rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-2.5 text-sm font-bold text-red-400 transition hover:border-red-400/40 hover:bg-red-500/10"
                      >
                        Delete
                      </button>

                    </div>

                  </div>
                </article>
              ))}

            </div>
          )}
        </section>

        {/* FOOTER INFO */}
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="flex items-center gap-3">
              <ShieldCheck
                size={20}
                className="text-emerald-400"
              />

              <p className="text-sm font-semibold text-slate-500">
                Authorization
              </p>
            </div>

            <p className="mt-3 font-bold">
              Admin Protected
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Backend role enforcement active.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="flex items-center gap-3">
              <Truck
                size={20}
                className="text-cyan-400"
              />

              <p className="text-sm font-semibold text-slate-500">
                Tracking
              </p>
            </div>

            <p className="mt-3 font-bold">
              Server Generated
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Tracking numbers cannot be manually changed.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="flex items-center gap-3">
              <Activity
                size={20}
                className="text-cyan-400"
              />

              <p className="text-sm font-semibold text-slate-500">
                API Status
              </p>
            </div>

            <p className="mt-3 font-bold">
              Connected
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Shipping data loaded from backend.
            </p>
          </div>

        </div>

      </div>
    </main>
  );
}