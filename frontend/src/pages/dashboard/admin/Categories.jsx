import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../../api/categories'

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modal, setModal] = useState(null) // null | 'create' | category-object

  const load = () => {
    setLoading(true)
    getCategories()
      .then((res) => setCategories(res.data.categories))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load categories'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const onDelete = async (id) => {
    if (!confirm('Delete this category?')) return
    try {
      await deleteCategory(id)
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete category')
    }
  }

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold">Categories</h1>
          <p className="text-soft text-sm mt-1">Manage the service categories shown across the platform.</p>
        </div>
        <button onClick={() => setModal('create')} className="btn-brand !py-2.5 !px-5 text-sm">
          <i className="bi bi-plus-lg me-2" /> Add category
        </button>
      </motion.div>

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      {loading ? (
        <p className="text-soft text-sm">Loading…</p>
      ) : categories.length === 0 ? (
        <div className="bg-surface border-soft border rounded-2xl p-10 text-center">
          <i className="bi bi-tags text-3xl text-faint mb-3 block" />
          <p className="text-soft text-sm">No categories yet.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((c) => (
            <div key={c._id} className="lift bg-surface border-soft border rounded-2xl p-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-display font-bold">{c.name}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${c.isActive ? '' : 'opacity-60'}`} style={{ background: c.isActive ? 'rgba(0,208,132,0.15)' : 'rgba(148,163,184,0.15)', color: c.isActive ? 'rgb(0,208,132)' : 'rgb(148,163,184)' }}>
                  {c.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-soft text-sm mb-4 line-clamp-2">{c.description || 'No description'}</p>
              <div className="flex gap-2">
                <button onClick={() => setModal(c)} className="btn-ghost flex-1 justify-center !py-2 text-sm">
                  <i className="bi bi-pencil me-1.5" /> Edit
                </button>
                <button onClick={() => onDelete(c._id)} className="btn-icon !w-9 !h-9 text-sm text-red-400">
                  <i className="bi bi-trash" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {modal && (
          <CategoryModal
            category={modal === 'create' ? null : modal}
            onClose={() => setModal(null)}
            onSaved={() => { setModal(null); load() }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function CategoryModal({ category, onClose, onSaved }) {
  const [form, setForm] = useState(
    category ? { name: category.name, description: category.description, icon: category.icon } : { name: '', description: '', icon: '' }
  )
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (category) await updateCategory(category._id, form)
      else await createCategory(form)
      onSaved()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save category')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-surface border-soft border rounded-3xl p-6 w-full max-w-md backdrop-blur-xl"
      >
        <h3 className="font-display font-bold text-lg mb-5">{category ? 'Edit category' : 'Add category'}</h3>
        <form onSubmit={onSubmit} className="space-y-4">
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div>
            <label className="text-sm text-soft mb-1.5 block">Name</label>
            <input name="name" required value={form.name} onChange={onChange} placeholder="Home Cleaning"
              className="bg-surface border-soft w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[var(--accent)]" />
          </div>
          <div>
            <label className="text-sm text-soft mb-1.5 block">Description</label>
            <textarea name="description" rows={3} value={form.description} onChange={onChange} placeholder="Short description…"
              className="bg-surface border-soft w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[var(--accent)] resize-none" />
          </div>
          <div>
            <label className="text-sm text-soft mb-1.5 block">Icon (bootstrap-icons class, optional)</label>
            <input name="icon" value={form.icon} onChange={onChange} placeholder="bi-house-heart-fill"
              className="bg-surface border-soft w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[var(--accent)]" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost flex-1 justify-center">Cancel</button>
            <button type="submit" disabled={loading} className="btn-brand flex-1 justify-center disabled:opacity-60">
              {loading ? <i className="bi bi-arrow-repeat animate-spin" /> : category ? 'Save changes' : 'Create category'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}
