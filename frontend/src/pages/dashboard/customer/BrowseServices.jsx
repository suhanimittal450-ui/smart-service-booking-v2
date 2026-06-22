import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getServices } from '../../../api/services'
import { createBooking } from '../../../api/bookings'

export default function BrowseServices() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [active, setActive] = useState(null)

  useEffect(() => {
    getServices()
      .then((res) => setServices(res.data.services))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load services'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-2xl md:text-3xl font-bold">Browse services</h1>
        <p className="text-soft text-sm mt-1">Pick a service and book a provider in a couple of taps.</p>
      </motion.div>

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      {loading ? (
        <p className="text-soft text-sm">Loading services…</p>
      ) : services.length === 0 ? (
        <p className="text-soft text-sm">No services available yet. Check back soon.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s, i) => (
            <motion.div
              key={s._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="lift bg-surface border-soft border rounded-2xl p-5 flex flex-col"
            >
              <span className="px-2.5 py-1 rounded-full bg-surface-strong text-xs w-fit mb-3">{s.category}</span>
              <h3 className="font-display font-bold mb-1">{s.title}</h3>
              <p className="text-soft text-sm mb-4 flex-1 line-clamp-2">{s.description}</p>
              <p className="text-xs text-faint mb-4">by {s.provider?.name || 'Provider'}</p>
              <div className="flex items-center justify-between">
                <span className="font-display font-bold" style={{ color: 'var(--accent)' }}>${s.price}</span>
                <button onClick={() => setActive(s)} className="btn-brand !py-2 !px-4 text-sm">
                  Book now
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {active && <BookingModal service={active} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </div>
  )
}

function BookingModal({ service, onClose }) {
  const [date, setDate] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await createBooking({ serviceId: service._id, bookingDate: date, notes })
      setDone(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-surface border-soft border rounded-3xl p-6 w-full max-w-md backdrop-blur-xl"
      >
        {done ? (
          <div className="text-center py-6">
            <i className="bi bi-check-circle-fill text-4xl mb-3 block" style={{ color: 'var(--success)' }} />
            <h3 className="font-display font-bold text-lg mb-1">Booking requested!</h3>
            <p className="text-soft text-sm mb-5">The provider will confirm shortly. Track it under My Bookings.</p>
            <button onClick={onClose} className="btn-brand w-full justify-center">Done</button>
          </div>
        ) : (
          <>
            <h3 className="font-display font-bold text-lg mb-1">Book {service.title}</h3>
            <p className="text-soft text-sm mb-5">${service.price} · with {service.provider?.name}</p>

            <form onSubmit={onSubmit} className="space-y-4">
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <div>
                <label className="text-sm text-soft mb-1.5 block">Preferred date & time</label>
                <input
                  type="datetime-local"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-surface border-soft w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
                />
              </div>
              <div>
                <label className="text-sm text-soft mb-1.5 block">Notes (optional)</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Anything the provider should know…"
                  className="bg-surface border-soft w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[var(--accent)] resize-none"
                />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={onClose} className="btn-ghost flex-1 justify-center">Cancel</button>
                <button type="submit" disabled={loading} className="btn-brand flex-1 justify-center disabled:opacity-60">
                  {loading ? <i className="bi bi-arrow-repeat animate-spin" /> : 'Confirm booking'}
                </button>
              </div>
            </form>
          </>
        )}
      </motion.div>
    </motion.div>
  )
}
