import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getProviderBookings, updateBookingStatus } from '../../../api/bookings'
import StatusBadge from '../../../components/dashboard/StatusBadge'

const NEXT_ACTIONS = {
  pending: [{ to: 'accepted', label: 'Accept', tint: '0,208,132' }, { to: 'cancelled', label: 'Decline', tint: '255,77,109' }],
  accepted: [{ to: 'in_progress', label: 'Start job', tint: '0,229,255' }],
  in_progress: [{ to: 'completed', label: 'Mark completed', tint: '0,208,132' }],
  completed: [],
  cancelled: [],
}

export default function ProviderBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState(null)

  const load = () => {
    setLoading(true)
    getProviderBookings()
      .then((res) => setBookings(res.data.bookings))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load bookings'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const onAction = async (id, status) => {
    setBusyId(id)
    try {
      await updateBookingStatus(id, status)
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update booking')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-2xl md:text-3xl font-bold">Bookings</h1>
        <p className="text-soft text-sm mt-1">Accept, decline, and progress jobs booked with you.</p>
      </motion.div>

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      {loading ? (
        <p className="text-soft text-sm">Loading…</p>
      ) : bookings.length === 0 ? (
        <div className="bg-surface border-soft border rounded-2xl p-10 text-center">
          <i className="bi bi-inbox text-3xl text-faint mb-3 block" />
          <p className="text-soft text-sm">No bookings yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <div key={b._id} className="bg-surface border-soft border rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-medium">{b.service?.title}</p>
                <p className="text-xs text-faint mt-1">for {b.customer?.name} ({b.customer?.email}) · {new Date(b.bookingDate).toLocaleString()}</p>
                {b.notes && <p className="text-xs text-soft mt-1 italic">"{b.notes}"</p>}
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={b.status} />
                <div className="flex gap-2">
                  {NEXT_ACTIONS[b.status]?.map((action) => (
                    <button
                      key={action.to}
                      onClick={() => onAction(b._id, action.to)}
                      disabled={busyId === b._id}
                      className="text-xs font-semibold px-3 py-1.5 rounded-full disabled:opacity-50"
                      style={{ background: `rgba(${action.tint},0.15)`, color: `rgb(${action.tint})` }}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
