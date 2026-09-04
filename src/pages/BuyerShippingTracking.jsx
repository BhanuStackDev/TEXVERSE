import { useEffect, useState } from "react";
import {
  Link,
  useSearchParams,
} from "react-router-dom";

import {
  ArrowLeft,
  AlertCircle,
  Car,
  CheckCircle2,
  Clock3,
  MapPin,
  Package,
  Truck,
  User,
} from "lucide-react";

import { shippingApi } from "../services/api";

export default function BuyerShippingTracking() {
  const [searchParams] = useSearchParams();

  const orderId = searchParams.get("order");

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadTracking() {
      if (!orderId) {
        if (mounted) {
          setError("Order ID is missing.");
          setLoading(false);
        }

        return;
      }

      try {
        if (mounted) {
          setLoading(true);
          setError("");
        }

        const result = await shippingApi.tracking(orderId);

        if (mounted) {
          setData(result);
        }
      } catch (err) {
        if (mounted) {
          setError(
            err?.message ||
              "Unable to load shipping tracking."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadTracking();

    return () => {
      mounted = false;
    };
  }, [orderId]);

  const shipment = data?.shipment || null;

  const staff = shipment?.delivery_staff || null;

  const vehicle = shipment?.vehicle || null;

  const formatDateTime = (value) => {
    if (!value) return "Not available";

    try {
      const date = new Date(value);

      if (Number.isNaN(date.getTime())) {
        return value;
      }

      return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return value;
    }
  };

  return (
    <main
      className="min-h-screen bg-slate-950 px-4 pb-20 pt-28 text-white md:px-6"
      style={{
        direction: "ltr",
      }}
    >
      <div className="mx-auto max-w-6xl">

        {/* BACK */}
        <Link
          to="/buyer"
          className="mb-6 inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-cyan-400 hover:text-cyan-400"
        >
          <ArrowLeft size={17} />
          Back to Buyer Dashboard
        </Link>

        {/* HEADER */}
        <section className="mb-6 overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl">
          <div className="bg-linear-to-r from-slate-950 via-slate-900 to-slate-800 p-6 md:p-8">

            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

              <div>
                <div className="mb-3 flex items-center gap-2 text-sm font-bold text-cyan-400">
                  <Truck size={18} />
                  Shipping & Tracking
                </div>

                <h1 className="text-3xl font-black md:text-4xl">
                  Order #{orderId || "—"}
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                  View your shipment status, tracking
                  information and delivery details.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-700 bg-slate-800/70 px-7 py-5 text-center">
                <Package
                  className="mx-auto mb-2 text-cyan-400"
                  size={30}
                />

                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Order Status
                </div>

                <div className="mt-1 font-bold text-white">
                  {data?.order_status || "Loading..."}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* LOADING */}
        {loading && (
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-10 text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400" />

            <p className="font-semibold text-slate-300">
              Loading shipping information...
            </p>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-6 text-red-300">
            <div className="flex items-start gap-3">
              <AlertCircle
                className="mt-0.5 shrink-0"
                size={22}
              />

              <div>
                <h2 className="font-bold text-red-300">
                  Unable to load tracking
                </h2>

                <p className="mt-1 text-sm text-red-400">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* NO SHIPMENT */}
        {!loading &&
          !error &&
          !shipment && (
            <div className="rounded-3xl border border-amber-500/20 bg-amber-500/5 p-8 text-center">
              <Clock3
                className="mx-auto mb-4 text-amber-400"
                size={42}
              />

              <h2 className="text-xl font-black text-amber-300">
                Shipment Not Created Yet
              </h2>

              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-400">
                Your order has been placed successfully.
                Shipping information will appear here once
                the shipment is created.
              </p>
            </div>
          )}

        {/* TRACKING DATA */}
        {!loading &&
          !error &&
          shipment && (
            <div className="space-y-6">

              {/* SHIPMENT STATUS */}
              <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6 md:p-7">

                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-emerald-400">
                    <CheckCircle2 size={22} />
                  </div>

                  <div>
                    <h2 className="font-black text-white">
                      Shipment Status
                    </h2>

                    <p className="text-sm text-slate-500">
                      Current delivery progress
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">

                  <InfoCard
                    label="Status"
                    value={shipment.status || "Pending"}
                    valueClassName="text-emerald-400"
                  />

                  <InfoCard
                    label="Carrier"
                    value={shipment.carrier || "Not assigned"}
                  />

                  <InfoCard
                    label="Tracking Number"
                    value={
                      shipment.tracking_number ||
                      "Not assigned"
                    }
                    valueClassName="text-cyan-400"
                  />

                  <InfoCard
                    label="Current Location"
                    value={
                      shipment.current_location ||
                      "Not available"
                    }
                    icon={<MapPin size={17} />}
                  />

                  <InfoCard
                    label="Estimated Delivery"
                    value={formatDateTime(shipment.eta)}
                    icon={<Clock3 size={17} />}
                  />

                  <InfoCard
                    label="Order ID"
                    value={`#${shipment.order_id}`}
                    icon={<Package size={17} />}
                  />

                </div>
              </section>

              {/* ADDRESSES */}
              <section className="grid gap-6 md:grid-cols-2">

                <AddressCard
                  title="Pickup Address"
                  value={
                    shipment.pickup_address ||
                    "Not available"
                  }
                />

                <AddressCard
                  title="Delivery Address"
                  value={
                    shipment.delivery_address ||
                    "Not available"
                  }
                />

              </section>

              {/* DELIVERY STAFF */}
              <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6 md:p-7">

                <div className="mb-6 flex items-center gap-3">

                  <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-3 text-blue-400">
                    <User size={22} />
                  </div>

                  <div>
                    <h2 className="font-black text-white">
                      Delivery Staff
                    </h2>

                    <p className="text-sm text-slate-500">
                      Assigned delivery personnel
                    </p>
                  </div>

                </div>

                {staff ? (
                  <div className="grid gap-4 md:grid-cols-3">

                    <InfoCard
                      label="Name"
                      value={staff.name || "Not available"}
                    />

                    <InfoCard
                      label="Phone"
                      value={staff.phone || "Not available"}
                    />

                    <InfoCard
                      label="Staff Code"
                      value={
                        staff.staff_code ||
                        "Not available"
                      }
                    />

                    <InfoCard
                      label="City"
                      value={staff.city || "Not available"}
                    />

                    <InfoCard
                      label="License"
                      value={
                        staff.license_number ||
                        "Not available"
                      }
                    />

                    <InfoCard
                      label="Status"
                      value={
                        staff.active
                          ? "Active"
                          : "Inactive"
                      }
                      valueClassName={
                        staff.active
                          ? "text-emerald-400"
                          : "text-red-400"
                      }
                    />

                  </div>
                ) : (
                  <EmptyAssignment
                    text="Delivery staff has not been assigned yet."
                  />
                )}

              </section>

              {/* VEHICLE */}
              <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6 md:p-7">

                <div className="mb-6 flex items-center gap-3">

                  <div className="rounded-xl border border-violet-500/20 bg-violet-500/10 p-3 text-violet-400">
                    <Car size={22} />
                  </div>

                  <div>
                    <h2 className="font-black text-white">
                      Delivery Vehicle
                    </h2>

                    <p className="text-sm text-slate-500">
                      Vehicle assigned to your shipment
                    </p>
                  </div>

                </div>

                {vehicle ? (
                  <div className="grid gap-4 md:grid-cols-3">

                    <InfoCard
                      label="Registration"
                      value={
                        vehicle.registration_number ||
                        "Not available"
                      }
                    />

                    <InfoCard
                      label="Vehicle Type"
                      value={
                        vehicle.vehicle_type ||
                        "Not available"
                      }
                    />

                    <InfoCard
                      label="Model"
                      value={
                        vehicle.model ||
                        "Not available"
                      }
                    />

                    <InfoCard
                      label="Color"
                      value={
                        vehicle.color ||
                        "Not available"
                      }
                    />

                    <InfoCard
                      label="Capacity"
                      value={
                        vehicle.capacity ||
                        "Not available"
                      }
                    />

                    <InfoCard
                      label="Status"
                      value={
                        vehicle.active
                          ? "Active"
                          : "Inactive"
                      }
                      valueClassName={
                        vehicle.active
                          ? "text-emerald-400"
                          : "text-red-400"
                      }
                    />

                  </div>
                ) : (
                  <EmptyAssignment
                    text="Vehicle has not been assigned yet."
                  />
                )}

              </section>

              {/* NOTES */}
              {shipment.notes && (
                <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6 md:p-7">

                  <h2 className="mb-3 font-black text-white">
                    Shipment Notes
                  </h2>

                  <p className="text-sm leading-6 text-slate-400">
                    {shipment.notes}
                  </p>

                </section>
              )}

              {/* READ ONLY NOTICE */}
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-5 py-4 text-sm leading-6 text-emerald-300">
                <strong>Read-only tracking:</strong>{" "}
                Buyers can view their shipment information
                here. Shipment, vehicle and delivery-staff
                management is available only to authorized
                Shipping and Admin users.
              </div>

            </div>
          )}

      </div>
    </main>
  );
}


/* =========================================================
   INFO CARD
========================================================= */

function InfoCard({
  label,
  value,
  icon,
  valueClassName = "text-white",
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 transition hover:border-cyan-500/30">

      <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
        {icon}
        {label}
      </div>

      <div
        className={`wrap-break-words font-bold ${valueClassName}`}
      >
        {value}
      </div>

    </div>
  );
}


/* =========================================================
   ADDRESS CARD
========================================================= */

function AddressCard({
  title,
  value,
}) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">

      <div className="mb-3 flex items-center gap-2">

        <MapPin
          size={19}
          className="text-cyan-400"
        />

        <h2 className="font-black text-white">
          {title}
        </h2>

      </div>

      <p className="text-sm leading-6 text-slate-400">
        {value}
      </p>

    </div>
  );
}


/* =========================================================
   EMPTY ASSIGNMENT
========================================================= */

function EmptyAssignment({
  text,
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 text-sm text-slate-500">
      {text}
    </div>
  );
}

