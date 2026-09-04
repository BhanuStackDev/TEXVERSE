import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { shippingApi } from "../../services/api";

export default function AdminVehicles() {
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState([]);
  const [staff, setStaff] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [vehicleForm, setVehicleForm] = useState({
    registration_number: "",
    vehicle_type: "",
    model: "",
    color: "",
    capacity: "",
    active: true,
  });

  const [staffForm, setStaffForm] = useState({
    name: "",
    phone: "",
    staff_code: "",
    license_number: "",
    city: "",
    active: true,
  });

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const vehicleData = await shippingApi.vehicles();
      const staffData = await shippingApi.staff();

      setVehicles(Array.isArray(vehicleData) ? vehicleData : []);
      setStaff(Array.isArray(staffData) ? staffData : []);
    } catch (err) {
      console.error(err);
      setError(err?.message || "Failed to load data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function changeVehicle(event) {
    const { name, value, type, checked } = event.target;

    setVehicleForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function changeStaff(event) {
    const { name, value, type, checked } = event.target;

    setStaffForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function createVehicle(event) {
    event.preventDefault();

    try {
      setError("");
      setMessage("");

      await shippingApi.createVehicle(vehicleForm);

      setVehicleForm({
        registration_number: "",
        vehicle_type: "",
        model: "",
        color: "",
        capacity: "",
        active: true,
      });

      setMessage("Vehicle created successfully.");
      await loadData();
    } catch (err) {
      console.error(err);
      setError(err?.message || "Failed to create vehicle.");
    }
  }

  async function createStaff(event) {
    event.preventDefault();

    try {
      setError("");
      setMessage("");

      await shippingApi.createStaff(staffForm);

      setStaffForm({
        name: "",
        phone: "",
        staff_code: "",
        license_number: "",
        city: "",
        active: true,
      });

      setMessage("Delivery staff created successfully.");
      await loadData();
    } catch (err) {
      console.error(err);
      setError(err?.message || "Failed to create delivery staff.");
    }
  }

  async function deleteVehicle(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this vehicle?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await shippingApi.deleteVehicle(id);

      setMessage("Vehicle deleted successfully.");
      await loadData();
    } catch (err) {
      console.error(err);
      setError(err?.message || "Failed to delete vehicle.");
    }
  }

  async function deleteStaff(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this delivery staff member?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await shippingApi.deleteStaff(id);

      setMessage("Delivery staff deleted successfully.");
      await loadData();
    } catch (err) {
      console.error(err);
      setError(err?.message || "Failed to delete delivery staff.");
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-28">
      <div className="max-w-7xl mx-auto">
        <button
          type="button"
          onClick={() => navigate("/admin")}
          className="mb-8 text-cyan-400 hover:text-cyan-300"
        >
          ← Back to Admin Dashboard
        </button>

        <h1 className="text-4xl font-black">
          Vehicles & Delivery Staff
        </h1>

        <p className="text-slate-400 mt-3">
          Manage TEXVERSE delivery vehicles and delivery personnel.
        </p>

        {error && (
          <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
            {error}
          </div>
        )}

        {message && (
          <div className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-300">
            {message}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6 mt-8">
          <form
            onSubmit={createVehicle}
            className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
          >
            <h2 className="text-2xl font-bold">
              Add Vehicle
            </h2>

            <div className="grid gap-4 mt-6">
              <input
                name="registration_number"
                value={vehicleForm.registration_number}
                onChange={changeVehicle}
                placeholder="Registration Number"
                required
                className="rounded-xl bg-slate-950 border border-slate-700 p-3"
              />

              <input
                name="vehicle_type"
                value={vehicleForm.vehicle_type}
                onChange={changeVehicle}
                placeholder="Vehicle Type"
                required
                className="rounded-xl bg-slate-950 border border-slate-700 p-3"
              />

              <input
                name="model"
                value={vehicleForm.model}
                onChange={changeVehicle}
                placeholder="Model"
                className="rounded-xl bg-slate-950 border border-slate-700 p-3"
              />

              <input
                name="color"
                value={vehicleForm.color}
                onChange={changeVehicle}
                placeholder="Color"
                className="rounded-xl bg-slate-950 border border-slate-700 p-3"
              />

              <input
                name="capacity"
                value={vehicleForm.capacity}
                onChange={changeVehicle}
                placeholder="Capacity"
                className="rounded-xl bg-slate-950 border border-slate-700 p-3"
              />

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="active"
                  checked={vehicleForm.active}
                  onChange={changeVehicle}
                />
                Active Vehicle
              </label>

              <button
                type="submit"
                className="rounded-xl bg-cyan-500 text-slate-950 font-bold p-3 hover:bg-cyan-400"
              >
                Create Vehicle
              </button>
            </div>
          </form>

          <form
            onSubmit={createStaff}
            className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
          >
            <h2 className="text-2xl font-bold">
              Add Delivery Staff
            </h2>

            <div className="grid gap-4 mt-6">
              <input
                name="name"
                value={staffForm.name}
                onChange={changeStaff}
                placeholder="Full Name"
                required
                className="rounded-xl bg-slate-950 border border-slate-700 p-3"
              />

              <input
                name="phone"
                value={staffForm.phone}
                onChange={changeStaff}
                placeholder="Phone"
                required
                className="rounded-xl bg-slate-950 border border-slate-700 p-3"
              />

              <input
                name="staff_code"
                value={staffForm.staff_code}
                onChange={changeStaff}
                placeholder="Staff Code"
                required
                className="rounded-xl bg-slate-950 border border-slate-700 p-3"
              />

              <input
                name="license_number"
                value={staffForm.license_number}
                onChange={changeStaff}
                placeholder="License Number"
                className="rounded-xl bg-slate-950 border border-slate-700 p-3"
              />

              <input
                name="city"
                value={staffForm.city}
                onChange={changeStaff}
                placeholder="City"
                className="rounded-xl bg-slate-950 border border-slate-700 p-3"
              />

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="active"
                  checked={staffForm.active}
                  onChange={changeStaff}
                />
                Active Staff
              </label>

              <button
                type="submit"
                className="rounded-xl bg-emerald-500 text-slate-950 font-bold p-3 hover:bg-emerald-400"
              >
                Create Delivery Staff
              </button>
            </div>
          </form>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mt-8">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden">
            <div className="p-6 border-b border-slate-800">
              <h2 className="text-2xl font-bold">
                Vehicles ({vehicles.length})
              </h2>
            </div>

            {loading ? (
              <div className="p-6 text-slate-400">
                Loading vehicles...
              </div>
            ) : vehicles.length === 0 ? (
              <div className="p-6 text-slate-500">
                No vehicles found.
              </div>
            ) : (
              <div>
                {vehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className="p-6 border-b border-slate-800"
                  >
                    <div className="flex justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-lg">
                          {vehicle.registration_number}
                        </h3>

                        <p className="text-slate-400">
                          {vehicle.vehicle_type}
                        </p>

                        <p className="text-sm text-slate-500 mt-2">
                          Model: {vehicle.model || "—"}
                        </p>

                        <p className="text-sm text-slate-500">
                          Capacity: {vehicle.capacity || "—"}
                        </p>

                        <p className="text-sm text-slate-500">
                          Status: {vehicle.active ? "Active" : "Inactive"}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => deleteVehicle(vehicle.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden">
            <div className="p-6 border-b border-slate-800">
              <h2 className="text-2xl font-bold">
                Delivery Staff ({staff.length})
              </h2>
            </div>

            {loading ? (
              <div className="p-6 text-slate-400">
                Loading delivery staff...
              </div>
            ) : staff.length === 0 ? (
              <div className="p-6 text-slate-500">
                No delivery staff found.
              </div>
            ) : (
              <div>
                {staff.map((person) => (
                  <div
                    key={person.id}
                    className="p-6 border-b border-slate-800"
                  >
                    <div className="flex justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-lg">
                          {person.name}
                        </h3>

                        <p className="text-slate-400">
                          {person.staff_code}
                        </p>

                        <p className="text-sm text-slate-500 mt-2">
                          Phone: {person.phone}
                        </p>

                        <p className="text-sm text-slate-500">
                          City: {person.city || "—"}
                        </p>

                        <p className="text-sm text-slate-500">
                          License: {person.license_number || "—"}
                        </p>

                        <p className="text-sm text-slate-500">
                          Status: {person.active ? "Active" : "Inactive"}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => deleteStaff(person.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}