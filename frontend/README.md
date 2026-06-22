# Nexora — AI Service Booking Landing Page

Same design + same hover/animation system as the original recording — built with the **exact same libraries**:

- **framer-motion** — scroll-reveal (`whileInView`), staggered delays, FAQ accordion height/rotate animation
- **bootstrap-icons** — all icons (`bi bi-*` classes)
- Hand-matched CSS: `.lift` card hover, `.btn-brand` / `.btn-ghost` / `.btn-icon` button hovers, `pulseDot`, `floatY`, typing cursor — same cubic-bezier curves and durations as the source.

## Install & run

```bash
npm install
npm run dev
```

Browser me `http://localhost:5173` open karo.

## Production build

```bash
npm run build
npm run preview
```

## Folder structure

```
src/
  api/                      -> axios client + per-resource API calls (auth, services, bookings, categories, users)
  context/
    AuthContext.jsx         -> login/signup/logout, session persistence + restore
    ThemeContext.jsx        -> dark/light theme
  components/
    NetworkBackground.jsx   -> animated particle/network background
    Navbar.jsx               -> top navigation, auth-aware (Sign in/Get started vs Dashboard/Logout)
    AuthLayout.jsx            -> shared shell for Login/Signup pages
    ProtectedRoute.jsx         -> blocks unauthenticated users + wrong-role access
    dashboard/
      DashboardLayout.jsx      -> sidebar + topbar shell shared by all 3 dashboards
      StatCard.jsx / StatusBadge.jsx / ProfileView.jsx
    Hero.jsx, Services.jsx, HowItWorks.jsx, Features.jsx,
    Testimonials.jsx, FAQ.jsx, CTA.jsx, Footer.jsx, AIWidget.jsx  -> landing page sections
  pages/
    LandingPage.jsx, LoginPage.jsx, SignupPage.jsx
    dashboard/customer/   -> Overview, BrowseServices, MyBookings, Profile
    dashboard/provider/   -> Overview, MyServices, Bookings, Profile
    dashboard/admin/      -> Overview, Users, AllBookings, Categories, Profile
  App.jsx     -> router: landing + auth pages + 3 role-protected dashboards
  main.jsx
  index.css
```

See the root-level `README.md` (one folder up) for full-stack setup, including the
backend and the 3-role signup/login flow.

## Customize

- Colors/fonts: `tailwind.config.js`
- Copy/text: seedha respective component file me edit karo
- Service list, reviews, FAQs: arrays diye gaye hain top of each component file me
