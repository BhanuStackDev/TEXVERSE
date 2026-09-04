import dashboardImage from "../assets/marketplace-dashboard.webp";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-950 p-10">

      <h1 className="text-3xl font-bold text-white mb-8">
        Marketplace Dashboard
      </h1>

      <div className="rounded-3xl overflow-hidden border border-slate-700">
        <img
          src={dashboardImage}
          alt="Marketplace Dashboard"
          className="w-full h-auto"
        />
      </div>

    </div>
  );
}