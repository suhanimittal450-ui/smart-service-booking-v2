const productLinks = [
  { label: 'Services', href: '#services' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#services' },
]

const companyLinks = ['About', 'Careers', 'Blog', 'Press']
const supportLinks = ['Help center', 'Contact', 'Trust & safety']

export default function Footer() {
  return (
    <footer className="relative px-6 md:px-10 max-w-7xl mx-auto py-14 border-t border-soft">
      <div className="grid md:grid-cols-4 gap-10 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-8 rounded-xl bg-brand-gradient flex items-center justify-center text-sm">✦</span>
            <span className="font-display font-bold">Nexora.</span>
          </div>
          <p className="text-soft text-sm max-w-xs">
            The smart way to book trusted local pros, matched instantly by AI.
          </p>
        </div>

        <div>
          <p className="font-semibold mb-4 text-sm">Product</p>
          <ul className="space-y-3 text-sm">
            {productLinks.map((l) => (
              <li key={l.label}>
                <a href={l.href} className="nav-link-x">{l.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-semibold mb-4 text-sm">Company</p>
          <ul className="space-y-3 text-sm">
            {companyLinks.map((l) => (
              <li key={l}>
                <button type="button" className="nav-link-x">{l}</button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-semibold mb-4 text-sm">Support</p>
          <ul className="space-y-3 text-sm">
            {supportLinks.map((l) => (
              <li key={l}>
                <button type="button" className="nav-link-x">{l}</button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-soft pt-6 border-t border-soft">
        <p>© {new Date().getFullYear()} Nexora. All rights reserved.</p>
        <div className="flex gap-6">
          <button type="button" className="nav-link-x">Privacy</button>
          <button type="button" className="nav-link-x">Terms</button>
        </div>
      </div>
    </footer>
  )
}
