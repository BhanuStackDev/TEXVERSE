import { useNavigate } from "react-router-dom";

export default function SupplierOnboarding() {

  const navigate = useNavigate();

  const handleSubmit = () => {
    alert("Supplier Profile Created Successfully!");
    navigate("/supplier");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-28 px-6">

      <div className="max-w-3xl mx-auto bg-slate-900 rounded-3xl p-10">

        <h1 className="text-4xl font-bold mb-8">
          Supplier Onboarding
        </h1>

        <div className="space-y-5">

          <input
            placeholder="Business Name"
            className="w-full bg-slate-800 p-4 rounded-xl"
          />

          <input
            placeholder="Business Type"
            className="w-full bg-slate-800 p-4 rounded-xl"
          />

          <input
            placeholder="Contact Number"
            className="w-full bg-slate-800 p-4 rounded-xl"
          />

          <input
            placeholder="Business Address"
            className="w-full bg-slate-800 p-4 rounded-xl"
          />

          <input
            placeholder="Operating Hours"
            className="w-full bg-slate-800 p-4 rounded-xl"
          />

          <input
            placeholder="Product Categories"
            className="w-full bg-slate-800 p-4 rounded-xl"
          />

          <input
            placeholder="MOQ"
            className="w-full bg-slate-800 p-4 rounded-xl"
          />

          <button
            onClick={handleSubmit}
            className="w-full bg-cyan-500 text-black py-4 rounded-xl font-bold hover:bg-cyan-400"
          >
            Complete Supplier Profile
          </button>

        </div>

      </div>

    </div>
  );
}