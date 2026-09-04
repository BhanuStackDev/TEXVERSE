import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import WorkspaceWelcome from "../components/WorkspaceWelcome";
import { shippingApi } from "../services/api";

const emptyShipment = {
  order_id: "",
  carrier: "TEXVERSE Logistics",
  tracking_number: "",
  status: "Order Placed",
  current_location: "",
  eta: "",
  pickup_address: "",
  delivery_address: "",
  delivery_staff_id: "",
  vehicle_id: "",
  notes: "",
};

const emptyVehicle = {
  registration_number: "",
  vehicle_type: "",
  model: "",
  color: "",
  capacity: "",
  active: true,
};

const emptyStaff = {
  name: "",
  phone: "",
  staff_code: "",
  license_number: "",
  city: "",
  active: true,
};

const shipmentStatuses = [
  "Order Placed",
  "Picked Up",
  "In Transit",
  "Out for Delivery",
  "Delivered",
  "Delayed",
  "Cancelled",
];

function normalizeList(value) {
  if (Array.isArray(value)) return value;

  if (Array.isArray(value?.items)) {
    return value.items;
  }

  if (Array.isArray(value?.data)) {
    return value.data;
  }

  return [];
}

function formatDate(value) {
  if (!value) return "—";

  try {
    return new Date(value).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return value;
  }
}

function statusClass(status) {
  const value = String(status || "").toLowerCase();

  if (value.includes("deliver")) {
    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
  }

  if (value.includes("transit")) {
    return "border-cyan-500/30 bg-cyan-500/10 text-cyan-300";
  }

  if (value.includes("pickup")) {
    return "border-blue-500/30 bg-blue-500/10 text-blue-300";
  }

  if (value.includes("delay")) {
    return "border-amber-500/30 bg-amber-500/10 text-amber-300";
  }

  if (value.includes("cancel")) {
    return "border-red-500/30 bg-red-500/10 text-red-300";
  }

  return "border-slate-700 bg-slate-800 text-slate-300";
}

function Field({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
  required = false,
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-300">
        {label}
        {required && <span className="text-red-400"> *</span>}
      </span>

      <input
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder = "Select",
  required = false,
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-300">
        {label}
        {required && <span className="text-red-400"> *</span>}
      </span>

      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-500"
      >
        <option value="">{placeholder}</option>

        {options.map((option) => (
          <option
            key={String(option.value)}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder = "",
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-300">
        {label}
      </span>

      <textarea
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500"
      />
    </label>
  );
}

function ToggleField({ label, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <input
        type="checkbox"
        checked={Boolean(checked)}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-cyan-500"
      />

      <span className="text-sm font-semibold text-slate-300">
        {label}
      </span>
    </label>
  );
}

export default function ShippingDashboard() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("overview");

  const [shipments, setShipments] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [staff, setStaff] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [shipmentForm, setShipmentForm] = useState(emptyShipment);
  const [vehicleForm, setVehicleForm] = useState(emptyVehicle);
  const [staffForm, setStaffForm] = useState(emptyStaff);

  const [editingShipmentId, setEditingShipmentId] = useState(null);
  const [editingVehicleId, setEditingVehicleId] = useState(null);
  const [editingStaffId, setEditingStaffId] = useState(null);

  const [search, setSearch] = useState("");

  const user = useMemo(() => {
    try {
      return JSON.parse(
        localStorage.getItem("texverse_user") || "{}"
      );
    } catch {
      return {};
    }
  }, []);

  const companyName =
    user?.company_name ||
    "TEXVERSE Logistics";

  async function loadAll() {
    setLoading(true);
    setError("");

    try {
      const [shipmentResponse, vehicleResponse, staffResponse] =
        await Promise.all([
          shippingApi.shipments(),
          shippingApi.vehicles(),
          shippingApi.staff(),
        ]);

      setShipments(
        normalizeList(shipmentResponse)
      );

      setVehicles(
        normalizeList(vehicleResponse)
      );

      setStaff(
        normalizeList(staffResponse)
      );
    } catch (err) {
      setError(
        err?.message ||
          "Unable to load shipping data."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  function showSuccess(message) {
    setSuccess(message);
    setError("");

    window.setTimeout(() => {
      setSuccess("");
    }, 3000);
  }

  function showError(message) {
    setError(
      message ||
        "Something went wrong."
    );

    setSuccess("");
  }

  function resetShipmentForm() {
    setShipmentForm({
      ...emptyShipment,
    });

    setEditingShipmentId(null);
  }

  function resetVehicleForm() {
    setVehicleForm({
      ...emptyVehicle,
    });

    setEditingVehicleId(null);
  }

  function resetStaffForm() {
    setStaffForm({
      ...emptyStaff,
    });

    setEditingStaffId(null);
  }

  function editShipment(item) {
    setShipmentForm({
      order_id: item.order_id ?? "",
      carrier:
        item.carrier ||
        "TEXVERSE Logistics",
      tracking_number:
        item.tracking_number || "",
      status:
        item.status ||
        "Order Placed",
      current_location:
        item.current_location || "",
      eta: item.eta || "",
      pickup_address:
        item.pickup_address || "",
      delivery_address:
        item.delivery_address || "",
      delivery_staff_id:
        item.delivery_staff_id ?? "",
      vehicle_id:
        item.vehicle_id ?? "",
      notes: item.notes || "",
    });

    setEditingShipmentId(item.id);
    setActiveTab("shipments");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function editVehicle(item) {
    setVehicleForm({
      registration_number:
        item.registration_number || "",
      vehicle_type:
        item.vehicle_type || "",
      model: item.model || "",
      color: item.color || "",
      capacity: item.capacity || "",
      active:
        item.active !== false,
    });

    setEditingVehicleId(item.id);
    setActiveTab("vehicles");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function editStaff(item) {
    setStaffForm({
      name: item.name || "",
      phone: item.phone || "",
      staff_code:
        item.staff_code || "",
      license_number:
        item.license_number || "",
      city: item.city || "",
      active:
        item.active !== false,
    });

    setEditingStaffId(item.id);
    setActiveTab("staff");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleShipmentSubmit(e) {
    e.preventDefault();

    if (!shipmentForm.order_id) {
      showError("Order ID is required.");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        order_id: Number(
          shipmentForm.order_id
        ),
        carrier:
          shipmentForm.carrier.trim() ||
          "TEXVERSE Logistics",
        tracking_number:
          shipmentForm.tracking_number.trim(),
        status:
          shipmentForm.status,
        current_location:
          shipmentForm.current_location.trim(),
        eta:
          shipmentForm.eta.trim(),
        pickup_address:
          shipmentForm.pickup_address.trim(),
        delivery_address:
          shipmentForm.delivery_address.trim(),
        delivery_staff_id:
          shipmentForm.delivery_staff_id
            ? Number(
                shipmentForm.delivery_staff_id
              )
            : null,
        vehicle_id:
          shipmentForm.vehicle_id
            ? Number(
                shipmentForm.vehicle_id
              )
            : null,
        notes:
          shipmentForm.notes.trim(),
      };

      if (editingShipmentId) {
        await shippingApi.updateShipment(
          editingShipmentId,
          payload
        );

        showSuccess(
          "Shipment updated successfully."
        );
      } else {
        await shippingApi.createShipment(
          payload
        );

        showSuccess(
          "Shipment created successfully."
        );
      }

      resetShipmentForm();
      await loadAll();
    } catch (err) {
      showError(
        err?.message ||
          "Unable to save shipment."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleVehicleSubmit(e) {
    e.preventDefault();

    if (
      !vehicleForm.registration_number.trim() ||
      !vehicleForm.vehicle_type.trim()
    ) {
      showError(
        "Registration number and vehicle type are required."
      );
      return;
    }

    setSaving(true);

    try {
      const payload = {
        registration_number:
          vehicleForm.registration_number.trim(),
        vehicle_type:
          vehicleForm.vehicle_type.trim(),
        model:
          vehicleForm.model.trim(),
        color:
          vehicleForm.color.trim(),
        capacity:
          vehicleForm.capacity.trim(),
        active:
          Boolean(vehicleForm.active),
      };

      if (editingVehicleId) {
        await shippingApi.updateVehicle(
          editingVehicleId,
          payload
        );

        showSuccess(
          "Vehicle updated successfully."
        );
      } else {
        await shippingApi.createVehicle(
          payload
        );

        showSuccess(
          "Vehicle added successfully."
        );
      }

      resetVehicleForm();
      await loadAll();
    } catch (err) {
      showError(
        err?.message ||
          "Unable to save vehicle."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleStaffSubmit(e) {
    e.preventDefault();

    if (
      !staffForm.name.trim() ||
      !staffForm.phone.trim() ||
      !staffForm.staff_code.trim()
    ) {
      showError(
        "Name, phone and staff code are required."
      );
      return;
    }

    setSaving(true);

    try {
      const payload = {
        name:
          staffForm.name.trim(),
        phone:
          staffForm.phone.trim(),
        staff_code:
          staffForm.staff_code.trim(),
        license_number:
          staffForm.license_number.trim(),
        city:
          staffForm.city.trim(),
        active:
          Boolean(staffForm.active),
      };

      if (editingStaffId) {
        await shippingApi.updateStaff(
          editingStaffId,
          payload
        );

        showSuccess(
          "Delivery staff updated successfully."
        );
      } else {
        await shippingApi.createStaff(
          payload
        );

        showSuccess(
          "Delivery staff added successfully."
        );
      }

      resetStaffForm();
      await loadAll();
    } catch (err) {
      showError(
        err?.message ||
          "Unable to save delivery staff."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteShipment(id) {
    if (
      !window.confirm(
        "Delete this shipment?"
      )
    ) {
      return;
    }

    try {
      await shippingApi.deleteShipment(id);

      showSuccess(
        "Shipment deleted successfully."
      );

      if (editingShipmentId === id) {
        resetShipmentForm();
      }

      await loadAll();
    } catch (err) {
      showError(
        err?.message ||
          "Unable to delete shipment."
      );
    }
  }

  async function deleteVehicle(id) {
    if (
      !window.confirm(
        "Delete this vehicle?"
      )
    ) {
      return;
    }

    try {
      await shippingApi.deleteVehicle(id);

      showSuccess(
        "Vehicle deleted successfully."
      );

      if (editingVehicleId === id) {
        resetVehicleForm();
      }

      await loadAll();
    } catch (err) {
      showError(
        err?.message ||
          "Unable to delete vehicle."
      );
    }
  }

  async function deleteStaff(id) {
    if (
      !window.confirm(
        "Delete this delivery staff member?"
      )
    ) {
      return;
    }

    try {
      await shippingApi.deleteStaff(id);

      showSuccess(
        "Delivery staff deleted successfully."
      );

      if (editingStaffId === id) {
        resetStaffForm();
      }

      await loadAll();
    } catch (err) {
      showError(
        err?.message ||
          "Unable to delete delivery staff."
      );
    }
  }

  const stats = useMemo(() => {
    const total = shipments.length;

    const delivered = shipments.filter(
      (item) =>
        String(item.status || "")
          .toLowerCase()
          .includes("deliver")
    ).length;

    const transit = shipments.filter(
      (item) =>
        String(item.status || "")
          .toLowerCase()
          .includes("transit")
    ).length;

    const delayed = shipments.filter(
      (item) =>
        String(item.status || "")
          .toLowerCase()
          .includes("delay")
    ).length;

    const activeVehicles =
      vehicles.filter(
        (item) => item.active
      ).length;

    const activeStaff =
      staff.filter(
        (item) => item.active
      ).length;

    return {
      total,
      delivered,
      transit,
      delayed,
      activeVehicles,
      activeStaff,
    };
  }, [shipments, vehicles, staff]);

  const filteredShipments = useMemo(() => {
    const term =
      search.trim().toLowerCase();

    if (!term) {
      return shipments;
    }

    return shipments.filter(
      (item) =>
        String(item.id)
          .toLowerCase()
          .includes(term) ||
        String(item.order_id)
          .toLowerCase()
          .includes(term) ||
        String(
          item.tracking_number || ""
        )
          .toLowerCase()
          .includes(term) ||
        String(
          item.carrier || ""
        )
          .toLowerCase()
          .includes(term) ||
        String(
          item.status || ""
        )
          .toLowerCase()
          .includes(term) ||
        String(
          item.current_location || ""
        )
          .toLowerCase()
          .includes(term)
    );
  }, [shipments, search]);

  function getVehicle(id) {
    return vehicles.find(
      (item) =>
        Number(item.id) === Number(id)
    );
  }

  function getStaff(id) {
    return staff.find(
      (item) =>
        Number(item.id) === Number(id)
    );
  }

  function renderStatCard(
    title,
    value,
    icon,
    description
  ) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-400">
              {title}
            </p>

            <p className="mt-2 text-3xl font-black text-white">
              {value}
            </p>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-2xl">
            {icon}
          </div>
        </div>

        <p className="mt-3 text-xs text-slate-500">
          {description}
        </p>
      </div>
    );
  }

  function renderNavigation() {
    const items = [
      {
        id: "overview",
        label: "Overview",
        icon: "📊",
      },
      {
        id: "shipments",
        label: "Shipments",
        icon: "📦",
      },
      {
        id: "vehicles",
        label: "Vehicles",
        icon: "🚚",
      },
      {
        id: "staff",
        label: "Delivery Staff",
        icon: "👤",
      },
    ];

    return (
      <div className="flex gap-2 overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 p-2">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setActiveTab(item.id);
              setError("");
              setSuccess("");
            }}
            className={`whitespace-nowrap rounded-xl px-4 py-3 text-sm font-bold transition ${
              activeTab === item.id
                ? "bg-cyan-500 text-slate-950"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <span className="mr-2">
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}
      </div>
    );
  }

  function renderOverview() {
    const recentShipments =
      shipments.slice(0, 8);

    return (
      <div className="space-y-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {renderStatCard(
            "Total Shipments",
            stats.total,
            "📦",
            "All registered shipments"
          )}

          {renderStatCard(
            "In Transit",
            stats.transit,
            "🚛",
            "Currently moving"
          )}

          {renderStatCard(
            "Delivered",
            stats.delivered,
            "✅",
            "Successfully delivered"
          )}

          {renderStatCard(
            "Delayed",
            stats.delayed,
            "⚠️",
            "Requires attention"
          )}

          {renderStatCard(
            "Active Vehicles",
            stats.activeVehicles,
            "🚚",
            "Vehicles available"
          )}

          {renderStatCard(
            "Active Staff",
            stats.activeStaff,
            "👤",
            "Delivery staff available"
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 lg:col-span-2">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-white">
                  Recent Shipments
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Latest shipping activity
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setActiveTab(
                    "shipments"
                  )
                }
                className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-bold text-slate-300 hover:bg-slate-800"
              >
                Manage
              </button>
            </div>

            {recentShipments.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-700 p-10 text-center">
                <div className="text-4xl">
                  📦
                </div>

                <p className="mt-3 font-bold text-white">
                  No shipments yet
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Create your first shipment
                  from the Shipments section.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentShipments.map(
                  (item) => (
                    <div
                      key={item.id}
                      className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-4 md:flex-row md:items-center md:justify-between"
                    >
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-white">
                            Shipment #
                            {item.id}
                          </span>

                          <span className="text-slate-600">
                            •
                          </span>

                          <span className="text-sm text-slate-400">
                            Order #
                            {item.order_id}
                          </span>
                        </div>

                        <p className="mt-1 text-sm text-slate-500">
                          {item.tracking_number ||
                            "No tracking number"}
                        </p>
                      </div>

                      <div
                        className={`w-fit rounded-full border px-3 py-1 text-xs font-bold ${statusClass(
                          item.status
                        )}`}
                      >
                        {item.status ||
                          "Order Placed"}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-black text-white">
              Shipping Company
            </h2>

            <div className="mt-5 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-5">
              <div className="text-3xl">
                🏢
              </div>

              <h3 className="mt-3 text-lg font-black text-white">
                {companyName}
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                B2B Freight & Delivery
              </p>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">
                    Account
                  </span>

                  <span className="font-bold text-cyan-300">
                    Shipping
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">
                    Vehicles
                  </span>

                  <span className="font-bold text-white">
                    {vehicles.length}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">
                    Staff
                  </span>

                  <span className="font-bold text-white">
                    {staff.length}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">
                    Shipments
                  </span>

                  <span className="font-bold text-white">
                    {shipments.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderShipmentForm() {
    return (
      <form
        onSubmit={
          handleShipmentSubmit
        }
        className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl"
      >
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-black text-white">
              {editingShipmentId
                ? "Edit Shipment"
                : "Create Shipment"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Manage order delivery,
              tracking, ETA and assignment.
            </p>
          </div>

          {editingShipmentId && (
            <button
              type="button"
              onClick={
                resetShipmentForm
              }
              className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-bold text-slate-300 hover:bg-slate-800"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <Field
            label="Order ID"
            value={
              shipmentForm.order_id
            }
            onChange={(value) =>
              setShipmentForm(
                (prev) => ({
                  ...prev,
                  order_id: value,
                })
              )
            }
            placeholder="Example: 1"
            type="number"
            required
          />

          <Field
            label="Carrier"
            value={
              shipmentForm.carrier
            }
            onChange={(value) =>
              setShipmentForm(
                (prev) => ({
                  ...prev,
                  carrier: value,
                })
              )
            }
            placeholder="TEXVERSE Logistics"
            required
          />

          <Field
            label="Tracking Number"
            value={
              shipmentForm.tracking_number
            }
            onChange={(value) =>
              setShipmentForm(
                (prev) => ({
                  ...prev,
                  tracking_number:
                    value,
                })
              )
            }
            placeholder="TRK-2026-0001"
          />

          <SelectField
            label="Status"
            value={
              shipmentForm.status
            }
            onChange={(value) =>
              setShipmentForm(
                (prev) => ({
                  ...prev,
                  status: value,
                })
              )
            }
            options={shipmentStatuses.map(
              (status) => ({
                value: status,
                label: status,
              })
            )}
            required
          />

          <Field
            label="Current Location"
            value={
              shipmentForm.current_location
            }
            onChange={(value) =>
              setShipmentForm(
                (prev) => ({
                  ...prev,
                  current_location:
                    value,
                })
              )
            }
            placeholder="Bhopal, Madhya Pradesh"
          />

          <Field
            label="ETA"
            value={
              shipmentForm.eta
            }
            onChange={(value) =>
              setShipmentForm(
                (prev) => ({
                  ...prev,
                  eta: value,
                })
              )
            }
            placeholder="05 Sep 2026, 6:00 PM"
          />

          <SelectField
            label="Delivery Staff"
            value={
              shipmentForm.delivery_staff_id
            }
            onChange={(value) =>
              setShipmentForm(
                (prev) => ({
                  ...prev,
                  delivery_staff_id:
                    value,
                })
              )
            }
            placeholder="Unassigned"
            options={staff.map(
              (item) => ({
                value: item.id,
                label: `${item.name} — ${item.staff_code}${
                  item.active
                    ? ""
                    : " (Inactive)"
                }`,
              })
            )}
          />

          <SelectField
            label="Vehicle"
            value={
              shipmentForm.vehicle_id
            }
            onChange={(value) =>
              setShipmentForm(
                (prev) => ({
                  ...prev,
                  vehicle_id:
                    value,
                })
              )
            }
            placeholder="Unassigned"
            options={vehicles.map(
              (item) => ({
                value: item.id,
                label: `${item.registration_number} — ${item.vehicle_type}${
                  item.active
                    ? ""
                    : " (Inactive)"
                }`,
              })
            )}
          />
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <TextAreaField
            label="Pickup Address"
            value={
              shipmentForm.pickup_address
            }
            onChange={(value) =>
              setShipmentForm(
                (prev) => ({
                  ...prev,
                  pickup_address:
                    value,
                })
              )
            }
            placeholder="Full pickup address"
          />

          <TextAreaField
            label="Delivery Address"
            value={
              shipmentForm.delivery_address
            }
            onChange={(value) =>
              setShipmentForm(
                (prev) => ({
                  ...prev,
                  delivery_address:
                    value,
                })
              )
            }
            placeholder="Full delivery address"
          />

          <div className="md:col-span-2">
            <TextAreaField
              label="Notes"
              value={
                shipmentForm.notes
              }
              onChange={(value) =>
                setShipmentForm(
                  (prev) => ({
                    ...prev,
                    notes: value,
                  })
                )
              }
              placeholder="Special delivery instructions, handling notes, etc."
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-cyan-500 px-6 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : editingShipmentId
              ? "Update Shipment"
              : "Create Shipment"}
          </button>

          <button
            type="button"
            onClick={
              resetShipmentForm
            }
            className="rounded-xl border border-slate-700 px-6 py-3 text-sm font-bold text-slate-300 hover:bg-slate-800"
          >
            Reset
          </button>
        </div>
      </form>
    );
  }

  function renderShipments() {
    return (
      <div className="space-y-6">
        {renderShipmentForm()}

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-black text-white">
                Shipment Management
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {shipments.length} shipment
                {shipments.length === 1
                  ? ""
                  : "s"}
              </p>
            </div>

            <input
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search shipment, order, tracking..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-cyan-500 md:w-80"
            />
          </div>

          {filteredShipments.length ===
          0 ? (
            <div className="rounded-xl border border-dashed border-slate-700 p-10 text-center">
              <div className="text-4xl">
                🔎
              </div>

              <p className="mt-3 font-bold text-white">
                No shipments found
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Create a shipment or change
                the search term.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-275 text-left">
                <thead>
                  <tr className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-500">
                    <th className="px-4 py-4">
                      Shipment
                    </th>

                    <th className="px-4 py-4">
                      Order
                    </th>

                    <th className="px-4 py-4">
                      Tracking
                    </th>

                    <th className="px-4 py-4">
                      Status
                    </th>

                    <th className="px-4 py-4">
                      Location
                    </th>

                    <th className="px-4 py-4">
                      Assignment
                    </th>

                    <th className="px-4 py-4">
                      ETA
                    </th>

                    <th className="px-4 py-4">
                      Created
                    </th>

                    <th className="px-4 py-4">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredShipments.map(
                    (item) => {
                      const vehicle =
                        getVehicle(
                          item.vehicle_id
                        );

                      const staffMember =
                        getStaff(
                          item.delivery_staff_id
                        );

                      return (
                        <tr
                          key={item.id}
                          className="border-b border-slate-800/70 hover:bg-slate-950/60"
                        >
                          <td className="px-4 py-4">
                            <div className="font-bold text-white">
                              #{item.id}
                            </div>

                            <div className="mt-1 text-xs text-slate-500">
                              {item.carrier ||
                                "TEXVERSE Logistics"}
                            </div>
                          </td>

                          <td className="px-4 py-4">
                            <span className="font-bold text-cyan-300">
                              #{item.order_id}
                            </span>
                          </td>

                          <td className="px-4 py-4 text-sm text-slate-300">
                            {item.tracking_number ||
                              "—"}
                          </td>

                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${statusClass(
                                item.status
                              )}`}
                            >
                              {item.status ||
                                "Order Placed"}
                            </span>
                          </td>

                          <td className="max-w-45 px-4 py-4 text-sm text-slate-400">
                            {item.current_location ||
                              "—"}
                          </td>

                          <td className="px-4 py-4">
                            <div className="space-y-1 text-xs">
                              <div className="text-slate-400">
                                🚚{" "}
                                {vehicle
                                  ? vehicle.registration_number
                                  : item.vehicle_id
                                  ? `Vehicle #${item.vehicle_id}`
                                  : "Vehicle —"}
                              </div>

                              <div className="text-slate-400">
                                👤{" "}
                                {staffMember
                                  ? staffMember.name
                                  : item.delivery_staff_id
                                  ? `Staff #${item.delivery_staff_id}`
                                  : "Staff —"}
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-4 text-sm text-slate-400">
                            {item.eta ||
                              "—"}
                          </td>

                          <td className="px-4 py-4 text-xs text-slate-500">
                            {formatDate(
                              item.created_at
                            )}
                          </td>

                          <td className="px-4 py-4">
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  editShipment(
                                    item
                                  )
                                }
                                className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-bold text-slate-300 hover:bg-slate-800"
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  deleteShipment(
                                    item.id
                                  )
                                }
                                className="rounded-lg border border-red-500/30 px-3 py-2 text-xs font-bold text-red-300 hover:bg-red-500/10"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }

  function renderVehicleForm() {
    return (
      <form
        onSubmit={
          handleVehicleSubmit
        }
        className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl"
      >
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-black text-white">
              {editingVehicleId
                ? "Edit Vehicle"
                : "Add Vehicle"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Manage the shipping fleet.
            </p>
          </div>

          {editingVehicleId && (
            <button
              type="button"
              onClick={
                resetVehicleForm
              }
              className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-bold text-slate-300 hover:bg-slate-800"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <Field
            label="Registration Number"
            value={
              vehicleForm.registration_number
            }
            onChange={(value) =>
              setVehicleForm(
                (prev) => ({
                  ...prev,
                  registration_number:
                    value,
                })
              )
            }
            placeholder="MP04 AB 1234"
            required
          />

          <Field
            label="Vehicle Type"
            value={
              vehicleForm.vehicle_type
            }
            onChange={(value) =>
              setVehicleForm(
                (prev) => ({
                  ...prev,
                  vehicle_type:
                    value,
                })
              )
            }
            placeholder="Truck / Van / Container"
            required
          />

          <Field
            label="Model"
            value={
              vehicleForm.model
            }
            onChange={(value) =>
              setVehicleForm(
                (prev) => ({
                  ...prev,
                  model: value,
                })
              )
            }
            placeholder="Tata 407"
          />

          <Field
            label="Color"
            value={
              vehicleForm.color
            }
            onChange={(value) =>
              setVehicleForm(
                (prev) => ({
                  ...prev,
                  color: value,
                })
              )
            }
            placeholder="White"
          />

          <Field
            label="Capacity"
            value={
              vehicleForm.capacity
            }
            onChange={(value) =>
              setVehicleForm(
                (prev) => ({
                  ...prev,
                  capacity:
                    value,
                })
              )
            }
            placeholder="5 Ton"
          />

          <div className="flex items-end pb-3">
            <ToggleField
              label="Vehicle Active"
              checked={
                vehicleForm.active
              }
              onChange={(value) =>
                setVehicleForm(
                  (prev) => ({
                    ...prev,
                    active:
                      value,
                  })
                )
              }
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-cyan-500 px-6 py-3 text-sm font-black text-slate-950 hover:bg-cyan-400 disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : editingVehicleId
              ? "Update Vehicle"
              : "Add Vehicle"}
          </button>

          <button
            type="button"
            onClick={
              resetVehicleForm
            }
            className="rounded-xl border border-slate-700 px-6 py-3 text-sm font-bold text-slate-300 hover:bg-slate-800"
          >
            Reset
          </button>
        </div>
      </form>
    );
  }

  function renderVehicles() {
    return (
      <div className="space-y-6">
        {renderVehicleForm()}

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="mb-5">
            <h2 className="text-xl font-black text-white">
              Vehicle Fleet
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {vehicles.length} vehicle
              {vehicles.length === 1
                ? ""
                : "s"}
            </p>
          </div>

          {vehicles.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-700 p-10 text-center">
              <div className="text-4xl">
                🚚
              </div>

              <p className="mt-3 font-bold text-white">
                No vehicles registered
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {vehicles.map(
                (item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-slate-800 bg-slate-950 p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-3xl">
                          🚚
                        </div>

                        <h3 className="mt-3 text-lg font-black text-white">
                          {item.registration_number}
                        </h3>

                        <p className="mt-1 text-sm text-slate-400">
                          {item.vehicle_type}
                        </p>
                      </div>

                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-bold ${
                          item.active
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                            : "border-red-500/30 bg-red-500/10 text-red-300"
                        }`}
                      >
                        {item.active
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </div>

                    <div className="mt-5 space-y-2 text-sm">
                      <div className="flex justify-between gap-4">
                        <span className="text-slate-500">
                          Model
                        </span>

                        <span className="text-slate-300">
                          {item.model ||
                            "—"}
                        </span>
                      </div>

                      <div className="flex justify-between gap-4">
                        <span className="text-slate-500">
                          Color
                        </span>

                        <span className="text-slate-300">
                          {item.color ||
                            "—"}
                        </span>
                      </div>

                      <div className="flex justify-between gap-4">
                        <span className="text-slate-500">
                          Capacity
                        </span>

                        <span className="text-slate-300">
                          {item.capacity ||
                            "—"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-5 flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          editVehicle(
                            item
                          )
                        }
                        className="flex-1 rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-bold text-slate-300 hover:bg-slate-800"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          deleteVehicle(
                            item.id
                          )
                        }
                        className="flex-1 rounded-xl border border-red-500/30 px-4 py-2.5 text-sm font-bold text-red-300 hover:bg-red-500/10"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  function renderStaffForm() {
    return (
      <form
        onSubmit={
          handleStaffSubmit
        }
        className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl"
      >
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-black text-white">
              {editingStaffId
                ? "Edit Delivery Staff"
                : "Add Delivery Staff"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Manage delivery personnel and
              their operational details.
            </p>
          </div>

          {editingStaffId && (
            <button
              type="button"
              onClick={
                resetStaffForm
              }
              className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-bold text-slate-300 hover:bg-slate-800"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <Field
            label="Full Name"
            value={
              staffForm.name
            }
            onChange={(value) =>
              setStaffForm(
                (prev) => ({
                  ...prev,
                  name: value,
                })
              )
            }
            placeholder="Delivery person's name"
            required
          />

          <Field
            label="Phone"
            value={
              staffForm.phone
            }
            onChange={(value) =>
              setStaffForm(
                (prev) => ({
                  ...prev,
                  phone: value,
                })
              )
            }
            placeholder="9876543210"
            type="tel"
            required
          />

          <Field
            label="Staff Code"
            value={
              staffForm.staff_code
            }
            onChange={(value) =>
              setStaffForm(
                (prev) => ({
                  ...prev,
                  staff_code:
                    value,
                })
              )
            }
            placeholder="DRV-001"
            required
          />

          <Field
            label="License Number"
            value={
              staffForm.license_number
            }
            onChange={(value) =>
              setStaffForm(
                (prev) => ({
                  ...prev,
                  license_number:
                    value,
                })
              )
            }
            placeholder="MP123456789"
          />

          <Field
            label="City"
            value={
              staffForm.city
            }
            onChange={(value) =>
              setStaffForm(
                (prev) => ({
                  ...prev,
                  city: value,
                })
              )
            }
            placeholder="Bhopal"
          />

          <div className="flex items-end pb-3">
            <ToggleField
              label="Staff Active"
              checked={
                staffForm.active
              }
              onChange={(value) =>
                setStaffForm(
                  (prev) => ({
                    ...prev,
                    active:
                      value,
                  })
                )
              }
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-cyan-500 px-6 py-3 text-sm font-black text-slate-950 hover:bg-cyan-400 disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : editingStaffId
              ? "Update Staff"
              : "Add Staff"}
          </button>

          <button
            type="button"
            onClick={
              resetStaffForm
            }
            className="rounded-xl border border-slate-700 px-6 py-3 text-sm font-bold text-slate-300 hover:bg-slate-800"
          >
            Reset
          </button>
        </div>
      </form>
    );
  }

  function renderStaff() {
    return (
      <div className="space-y-6">
        {renderStaffForm()}

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="mb-5">
            <h2 className="text-xl font-black text-white">
              Delivery Staff
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {staff.length} staff member
              {staff.length === 1
                ? ""
                : "s"}
            </p>
          </div>

          {staff.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-700 p-10 text-center">
              <div className="text-4xl">
                👤
              </div>

              <p className="mt-3 font-bold text-white">
                No delivery staff registered
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {staff.map(
                (item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-slate-800 bg-slate-950 p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-3xl">
                          👤
                        </div>

                        <h3 className="mt-3 text-lg font-black text-white">
                          {item.name}
                        </h3>

                        <p className="mt-1 text-sm text-cyan-300">
                          {item.staff_code}
                        </p>
                      </div>

                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-bold ${
                          item.active
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                            : "border-red-500/30 bg-red-500/10 text-red-300"
                        }`}
                      >
                        {item.active
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </div>

                    <div className="mt-5 space-y-2 text-sm">
                      <div className="flex justify-between gap-4">
                        <span className="text-slate-500">
                          Phone
                        </span>

                        <span className="text-slate-300">
                          {item.phone ||
                            "—"}
                        </span>
                      </div>

                      <div className="flex justify-between gap-4">
                        <span className="text-slate-500">
                          License
                        </span>

                        <span className="text-slate-300">
                          {item.license_number ||
                            "—"}
                        </span>
                      </div>

                      <div className="flex justify-between gap-4">
                        <span className="text-slate-500">
                          City
                        </span>

                        <span className="text-slate-300">
                          {item.city ||
                            "—"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-5 flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          editStaff(
                            item
                          )
                        }
                        className="flex-1 rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-bold text-slate-300 hover:bg-slate-800"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          deleteStaff(
                            item.id
                          )
                        }
                        className="flex-1 rounded-xl border border-red-500/30 px-4 py-2.5 text-sm font-bold text-red-300 hover:bg-red-500/10"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pb-20 pt-28 text-white">
      <div className="mx-auto max-w-375 px-4 sm:px-6 lg:px-8">
        <WorkspaceWelcome role="Shipping" />
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-black uppercase tracking-wider text-cyan-300">
                Shipping Company
              </span>

              <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-bold text-slate-400">
                JWT Protected
              </span>
            </div>

            <h1 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
              Shipping Dashboard
            </h1>

            <p className="mt-3 max-w-3xl text-slate-400">
              {companyName} — manage shipments,
              tracking, delivery staff, vehicles
              and delivery assignments from one
              secured workspace.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={loadAll}
              disabled={loading}
              className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-bold text-slate-300 hover:bg-slate-800 disabled:opacity-50"
            >
              {loading
                ? "Refreshing..."
                : "↻ Refresh"}
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/")
              }
              className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-bold text-slate-300 hover:bg-slate-800"
            >
              Home
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm font-semibold text-red-300">
            <div className="flex items-start gap-3">
              <span>⚠️</span>

              <div>
                <p className="font-black">
                  Shipping API Error
                </p>

                <p className="mt-1">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-4 text-sm font-semibold text-emerald-300">
            <span className="mr-2">
              ✅
            </span>
            {success}
          </div>
        )}

        {renderNavigation()}

        <div className="mt-8">
          {loading ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-16 text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400" />

              <p className="mt-5 font-bold text-white">
                Loading shipping operations...
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Connecting to TEXVERSE Shipping APIs
              </p>
            </div>
          ) : (
            <>
              {activeTab ===
                "overview" &&
                renderOverview()}

              {activeTab ===
                "shipments" &&
                renderShipments()}

              {activeTab ===
                "vehicles" &&
                renderVehicles()}

              {activeTab ===
                "staff" &&
                renderStaff()}
            </>
          )}
        </div>
      </div>
    </div>
  );
}