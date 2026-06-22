import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  getMyBookings,
  cancelBooking,
  createPaymentOrder,
  verifyPayment,
} from "../../../api/bookings";
import StatusBadge from "../../../components/dashboard/StatusBadge";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [payingId, setPayingId] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  const load = () => {
    setLoading(true);
    getMyBookings()
      .then((res) => setBookings(res.data.bookings))
      .catch((err) =>
        setError(err.response?.data?.message || "Failed to load bookings"),
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const onCancel = async (id) => {
    setBusyId(id);
    setError("");
    try {
      await cancelBooking(id);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not cancel booking");
    } finally {
      setBusyId(null);
    }
  };

  const onPayNow = async (booking) => {
    setPayingId(booking._id);
    setError("");
    setSuccessMsg("");
    try {
      // Backend se Razorpay order banao
      const res = await createPaymentOrder(booking._id);
      const { order } = res.data;

      // Razorpay checkout popup kholo
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Nexora — Smart Service Booking",
        description: booking.service?.title || "Service Payment",
        order_id: order.id,
        handler: async (response) => {
          try {
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            setSuccessMsg("✅ Payment successful! Booking confirmed.");
            load();
          } catch {
            setError("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: booking.customer?.name || "",
          email: booking.customer?.email || "",
        },
        theme: { color: "#00D084" },
        modal: {
          ondismiss: () => setPayingId(null),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => {
        setError(`Payment failed: ${response.error.description}`);
        setPayingId(null);
      });
      rzp.open();
    } catch (err) {
      setError(err.response?.data?.message || "Could not initiate payment");
    } finally {
      setPayingId(null);
    }
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-display text-2xl md:text-3xl font-bold">
          My bookings
        </h1>
        <p className="text-soft text-sm mt-1">
          Track every booking you've made and its current status.
        </p>
      </motion.div>

      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-400 text-sm mb-4 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3"
        >
          {error}
        </motion.p>
      )}
      {successMsg && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-green-400 text-sm mb-4 bg-green-400/10 border border-green-400/20 rounded-xl px-4 py-3"
        >
          {successMsg}
        </motion.p>
      )}

      <div className="bg-surface border-soft border rounded-2xl overflow-hidden">
        {loading ? (
          <p className="text-soft text-sm p-6">Loading…</p>
        ) : bookings.length === 0 ? (
          <p className="text-soft text-sm p-6">
            No bookings yet — go browse some services!
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-soft border-b text-left text-faint text-xs uppercase">
                  <th className="p-4 font-medium">Service</th>
                  <th className="p-4 font-medium">Provider</th>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Amount</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Payment</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr
                    key={b._id}
                    className="border-soft border-b last:border-0 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="p-4 font-medium">{b.service?.title}</td>
                    <td className="p-4 text-soft">{b.provider?.name}</td>
                    <td className="p-4 text-soft whitespace-nowrap">
                      {new Date(b.bookingDate).toLocaleString()}
                    </td>
                    <td className="p-4 text-soft font-medium">
                      ₹{b.totalAmount}
                    </td>
                    <td className="p-4">
                      <StatusBadge status={b.status} />
                    </td>

                    {/* Payment Status Column */}
                    <td className="p-4">
                      {b.paymentStatus === "paid" ? (
                        <span
                          className="text-xs font-semibold px-2.5 py-1 rounded-full"
                          style={{
                            background: "rgba(0,208,132,0.15)",
                            color: "rgb(0,208,132)",
                          }}
                        >
                          ✓ Paid
                        </span>
                      ) : (
                        <span className="text-xs text-faint">Unpaid</span>
                      )}
                    </td>

                    {/* Actions Column */}
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {/* Pay Now button — sirf jab provider ne accept kiya ho aur payment pending ho */}
                        {b.status === "accepted" &&
                          b.paymentStatus !== "paid" && (
                            <button
                              onClick={() => onPayNow(b)}
                              disabled={payingId === b._id}
                              className="text-xs font-semibold px-3 py-1.5 rounded-full disabled:opacity-50 transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
                              style={{
                                background: "rgba(0,208,132,0.15)",
                                color: "rgb(0,208,132)",
                                border: "1px solid rgba(0,208,132,0.35)",
                              }}
                            >
                              {payingId === b._id
                                ? "⏳ Opening…"
                                : "💳 Pay Now"}
                            </button>
                          )}

                        {/* Cancel button */}
                        {["pending", "accepted"].includes(b.status) &&
                          b.paymentStatus !== "paid" && (
                            <button
                              onClick={() => onCancel(b._id)}
                              disabled={busyId === b._id}
                              className="text-xs font-medium text-red-400 hover:text-red-300 disabled:opacity-50 whitespace-nowrap"
                            >
                              {busyId === b._id ? "Cancelling…" : "Cancel"}
                            </button>
                          )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
