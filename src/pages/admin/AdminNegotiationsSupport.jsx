import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  negotiationApi,
  supportApi,
} from "../../services/api";

export default function AdminNegotiationsSupport() {
  const navigate = useNavigate();

  const [negotiations, setNegotiations] = useState([]);
  const [tickets, setTickets] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [negotiationData, ticketData] =
        await Promise.all([
          negotiationApi.adminAll(),
          supportApi.all(),
        ]);

      setNegotiations(
        Array.isArray(negotiationData)
          ? negotiationData
          : []
      );

      setTickets(
        Array.isArray(ticketData)
          ? ticketData
          : []
      );
    } catch (err) {
      console.error(err);
      setError(
        err?.message ||
          "Failed to load negotiations and support tickets."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function updateNegotiation(id, status) {
    try {
      setError("");
      setMessage("");

      await negotiationApi.updateAdminStatus(
        id,
        status
      );

      setMessage(
        "Negotiation status updated successfully."
      );

      await loadData();
    } catch (err) {
      console.error(err);
      setError(
        err?.message ||
          "Failed to update negotiation."
      );
    }
  }

  async function updateTicket(id, status) {
    try {
      setError("");
      setMessage("");

      await supportApi.updateStatus(
        id,
        status
      );

      setMessage(
        "Support ticket status updated successfully."
      );

      await loadData();
    } catch (err) {
      console.error(err);
      setError(
        err?.message ||
          "Failed to update support ticket."
      );
    }
  }

  const openNegotiations = negotiations.filter(
    (item) => item.status === "Open"
  ).length;

  const openTickets = tickets.filter(
    (item) =>
      item.status === "Open" ||
      item.status === "In Progress"
  ).length;

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

        <p className="text-cyan-400 text-sm font-bold uppercase tracking-wider">
          TEXVERSE ADMIN
        </p>

        <h1 className="text-4xl md:text-5xl font-black mt-2">
          Negotiations & Support
        </h1>

        <p className="text-slate-400 mt-3 max-w-3xl">
          Monitor buyer-supplier negotiations and
          manage customer support tickets.
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-500">
              Total Negotiations
            </p>

            <p className="text-3xl font-black mt-2">
              {negotiations.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-500">
              Open Negotiations
            </p>

            <p className="text-3xl font-black mt-2">
              {openNegotiations}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-500">
              Support Tickets
            </p>

            <p className="text-3xl font-black mt-2">
              {tickets.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-500">
              Active Tickets
            </p>

            <p className="text-3xl font-black mt-2">
              {openTickets}
            </p>
          </div>

        </div>

        <div className="grid lg:grid-cols-2 gap-6 mt-8">

          <section className="rounded-3xl border border-slate-800 bg-slate-900 overflow-hidden">

            <div className="p-6 border-b border-slate-800">
              <h2 className="text-2xl font-black">
                Negotiations
              </h2>

              <p className="text-slate-500 mt-1">
                Buyer offers and supplier negotiations.
              </p>
            </div>

            {loading ? (
              <div className="p-6 text-slate-400">
                Loading negotiations...
              </div>
            ) : negotiations.length === 0 ? (
              <div className="p-6 text-slate-500">
                No negotiations found.
              </div>
            ) : (
              <div>
                {negotiations.map((item) => (
                  <div
                    key={item.id}
                    className="p-6 border-b border-slate-800"
                  >
                    <div className="flex justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-lg">
                          Negotiation #{item.id}
                        </h3>

                        <p className="text-slate-400 mt-2">
                          Product ID: {item.product_id}
                        </p>

                        <p className="text-slate-400">
                          Buyer ID: {item.buyer_id}
                        </p>

                        <p className="text-slate-400">
                          Supplier ID: {item.supplier_id}
                        </p>

                        <p className="text-slate-400">
                          Quantity: {item.quantity}
                        </p>

                        <p className="text-cyan-400 font-semibold mt-2">
                          Offer: ₹{item.offer_price}
                        </p>

                        {item.message && (
                          <p className="text-slate-500 mt-2">
                            {item.message}
                          </p>
                        )}
                      </div>

                      <span className="h-fit rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-300">
                        {item.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-5">
                      <button
                        type="button"
                        onClick={() =>
                          updateNegotiation(
                            item.id,
                            "Accepted"
                          )
                        }
                        className="rounded-lg bg-emerald-500 px-3 py-2 text-sm font-bold text-slate-950"
                      >
                        Accept
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          updateNegotiation(
                            item.id,
                            "Rejected"
                          )
                        }
                        className="rounded-lg bg-red-500 px-3 py-2 text-sm font-bold text-white"
                      >
                        Reject
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          updateNegotiation(
                            item.id,
                            "Closed"
                          )
                        }
                        className="rounded-lg border border-slate-700 px-3 py-2 text-sm font-bold text-slate-300"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-3xl border border-slate-800 bg-slate-900 overflow-hidden">

            <div className="p-6 border-b border-slate-800">
              <h2 className="text-2xl font-black">
                Support Tickets
              </h2>

              <p className="text-slate-500 mt-1">
                Manage customer support requests.
              </p>
            </div>

            {loading ? (
              <div className="p-6 text-slate-400">
                Loading support tickets...
              </div>
            ) : tickets.length === 0 ? (
              <div className="p-6 text-slate-500">
                No support tickets found.
              </div>
            ) : (
              <div>
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="p-6 border-b border-slate-800"
                  >
                    <div className="flex justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-lg">
                          #{ticket.id} — {ticket.subject}
                        </h3>

                        <p className="text-slate-400 mt-2">
                          User ID: {ticket.user_id}
                        </p>

                        <p className="text-slate-500 mt-3">
                          {ticket.message}
                        </p>
                      </div>

                      <span className="h-fit rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-300">
                        {ticket.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-5">
                      <button
                        type="button"
                        onClick={() =>
                          updateTicket(
                            ticket.id,
                            "In Progress"
                          )
                        }
                        className="rounded-lg bg-cyan-500 px-3 py-2 text-sm font-bold text-slate-950"
                      >
                        In Progress
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          updateTicket(
                            ticket.id,
                            "Resolved"
                          )
                        }
                        className="rounded-lg bg-emerald-500 px-3 py-2 text-sm font-bold text-slate-950"
                      >
                        Resolve
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          updateTicket(
                            ticket.id,
                            "Closed"
                          )
                        }
                        className="rounded-lg border border-slate-700 px-3 py-2 text-sm font-bold text-slate-300"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </section>

        </div>
      </div>
    </div>
  );
}