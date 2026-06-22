const COLORS = {
  pending: '255,159,28',
  accepted: '0,229,255',
  in_progress: '102,16,242',
  completed: '0,208,132',
  cancelled: '255,77,109',
  paid: '0,208,132',
  failed: '255,77,109',
  refunded: '148,163,184',
}

export default function StatusBadge({ status }) {
  const tint = COLORS[status] || '148,163,184'
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize"
      style={{ background: `rgba(${tint},0.15)`, color: `rgb(${tint})` }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: `rgb(${tint})` }} />
      {status?.replace('_', ' ')}
    </span>
  )
}
