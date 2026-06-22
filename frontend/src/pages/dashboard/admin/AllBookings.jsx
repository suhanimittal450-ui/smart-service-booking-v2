import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getAllBookings } from '../../../api/bookings'
import StatusBadge from '../../../components/dashboard/StatusBadge'

export default function AllBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getAllBookings()
      .then((res) => setBookings(res.data.bookings))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load bookings'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="font-display text-2xl md:text-3xl font-bold">All bookings</h1>
        <p className="text-soft text-sm mt-1">Every booking across every customer and provider.</p>
      </motion.div>

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      <div className="bg-surface border-soft border rounded-2xl overflow-hidden">
        {loading ? (
          <p className="text-soft text-sm p-6">Loading…</p>
        ) : bookings.length === 0 ? (
          <p className="text-soft text-sm p-6">No bookings yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-soft border-b text-left text-faint text-xs uppercase">
                <th className="p-4 font-medium">Service</th>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Provider</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Amount</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id} className="border-soft border-b last:border-0">
                  <td className="p-4 font-medium">{b.service?.title}</td>
                  <td className="p-4 text-soft">{b.customer?.name}</td>
                  <td className="p-4 text-soft">{b.provider?.name}</td>
                  <td className="p-4 text-soft">{new Date(b.bookingDate).toLocaleDateString()}</td>
                  <td className="p-4 text-soft">${b.totalAmount}</td>
                  <td className="p-4"><StatusBadge status={b.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
