import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getMyServices, createService, updateService, deleteService } from '../../../api/services'
import { getCategories } from '../../../api/categories'

const emptyForm = { title: '', description: '', category: '', price: '', duration: '' }

export default function MyServices() {
  const [services, setServices] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modal, setModal] = useState(null) // null | 'create' | service-object (edit)

  const load = () => {
    setLoading(true)
    Promise.all([getMyServices(), getCategories()])
      .then(([svcRes, catRes]) => {
        setServices(svcRes.data.services)
        setCategories(catRes.data.categories)
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to load services'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const onDelete = async (id) => {
    if (!confirm('Delete this service?')) return
    try {
      await deleteService(id)
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete service')
    }
  }

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold">My services</h1>
          <p className="text-soft text-sm mt-1">Manage the services you offer.</p>
        </div>
        <button onClick={() => setModal('create')} className="btn-brand !py-2.5 !px-5 text-sm">
          <i className="bi bi-plus-lg me-2" /> Add service
        </button>
      </motion.div>

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      {loading ? (
        <p className="text-soft text-sm">Loading…</p>
      ) : services.length === 0 ? (
        <div className="bg-surface border-soft border rounded-2xl p-10 text-center">
          <i className="bi bi-tools text-3xl text-faint mb-3 block" />
          <p className="text-soft text-sm">You haven't listed any services yet.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s) => (
            <div key={s._id} className="lift bg-surface border-soft border rounded-2xl p-5 flex flex-col">
              <span className="px-2.5 py-1 rounded-full bg-surface-strong text-xs w-fit mb-3">{s.category}</span>
              <h3 className="font-display font-bold mb-1">{s.title}</h3>
              <p className="text-soft text-sm mb-4 flex-1 line-clamp-2">{s.description}</p>
              <div className="flex items-center justify-between mb-4">
                <span className="font-display font-bold" style={{ color: 'var(--accent)' }}>${s.price}</span>
                <span className="text-xs text-faint">{s.duration} min</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setModal(s)} className="btn-ghost flex-1 justify-center !py-2 text-sm">
                  <i className="bi bi-pencil me-1.5" /> Edit
                </button>
                <button onClick={() => onDelete(s._id)} className="btn-icon !w-9 !h-9 text-sm text-red-400">
                  <i className="bi bi-trash" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {modal && (
          <ServiceModal
            categories={categories}
            service={modal === 'create' ? null : modal}
            onClose={() => setModal(null)}
            onSaved={() => { setModal(null); load() }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function ServiceModal({ service, categories, onClose, onSaved }) {
  const [form, setForm] = useState(
    service
      ? { title: service.title, description: service.description, category: service.category, price: service.price, duration: service.duration }
      : emptyForm
  )
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const payload = { ...form, price: Number(form.price), duration: Number(form.duration) }
      if (service) await updateService(service._id, payload)
      else await createService(payload)
      onSaved()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save service')
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
        className="bg-surface border-soft border rounded-3xl p-6 w-full max-w-md backdrop-blur-xl max-h-[90vh] overflow-y-auto"
      >
        <h3 className="font-display font-bold text-lg mb-5">{service ? 'Edit service' : 'Add a new service'}</h3>

        <form onSubmit={onSubmit} className="space-y-4">
          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div>
            <label className="text-sm text-soft mb-1.5 block">Title</label>
            <input
              name="title" required value={form.title} onChange={onChange}
              placeholder="Deep home cleaning"
              className="bg-surface border-soft w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
            />
          </div>

          <div>
            <label className="text-sm text-soft mb-1.5 block">Description</label>
            <textarea
              name="description" required rows={3} value={form.description} onChange={onChange}
              placeholder="What's included, what to expect…"
              className="bg-surface border-soft w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[var(--accent)] resize-none"
            />
          </div>

          <div>
            <label className="text-sm text-soft mb-1.5 block">Category</label>
            <input
              name="category" required value={form.category} onChange={onChange}
              list="category-options"
              placeholder="Home Cleaning"
              className="bg-surface border-soft w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
            />
            <datalist id="category-options">
              {categories.map((c) => <option key={c._id} value={c.name} />)}
            </datalist>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-soft mb-1.5 block">Price ($)</label>
              <input
                type="number" min="0" name="price" required value={form.price} onChange={onChange}
                className="bg-surface border-soft w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
              />
            </div>
            <div>
              <label className="text-sm text-soft mb-1.5 block">Duration (min)</label>
              <input
                type="number" min="0" name="duration" required value={form.duration} onChange={onChange}
                className="bg-surface border-soft w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost flex-1 justify-center">Cancel</button>
            <button type="submit" disabled={loading} className="btn-brand flex-1 justify-center disabled:opacity-60">
              {loading ? <i className="bi bi-arrow-repeat animate-spin" /> : service ? 'Save changes' : 'Create service'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}
