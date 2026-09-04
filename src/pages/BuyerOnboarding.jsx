import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BuyerOnboarding() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    businessType: "",
    industry: "",
    fabric: "",
    quantity: "",
    budget: ""
  });

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    alert("Profile Completed Successfully!");

    navigate("/buyer");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-28 px-6">

      <div className="max-w-3xl mx-auto bg-slate-900 rounded-3xl p-10">

        <h1 className="text-4xl font-bold mb-8">
          Buyer Onboarding
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          <input
            name="businessType"
            placeholder="Business Type"
            onChange={handleChange}
            className="w-full p-4 rounded-xl bg-slate-800"
          />

          <input
            name="industry"
            placeholder="Industry"
            onChange={handleChange}
            className="w-full p-4 rounded-xl bg-slate-800"
          />

          <input
            name="fabric"
            placeholder="Preferred Fabric"
            onChange={handleChange}
            className="w-full p-4 rounded-xl bg-slate-800"
          />

          <input
            name="quantity"
            placeholder="Typical Order Quantity"
            onChange={handleChange}
            className="w-full p-4 rounded-xl bg-slate-800"
          />

          <input
            name="budget"
            placeholder="Budget Range"
            onChange={handleChange}
            className="w-full p-4 rounded-xl bg-slate-800"
          />

          <button
            className="w-full bg-cyan-500 text-black py-4 rounded-xl font-bold hover:bg-cyan-400"
          >
            Complete Profile
          </button>

        </form>

      </div>

    </div>
  );
}