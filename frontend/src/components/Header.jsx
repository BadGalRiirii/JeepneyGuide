import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Bus, Menu, X, MapPin } from 'lucide-react'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/finder', label: 'Route Finder' },
  { to: '/routes', label: 'All Routes' },
  { to: '/tips', label: 'Tips' },
]

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#060d1a]/90 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/25 group-hover:shadow-amber-500/40 transition-all">
            <Bus className="w-4 h-4 text-black" strokeWidth={2.5} />
          </div>
          <div className="leading-none">
            <span className="font-black text-white text-base tracking-tight">SakayKo</span>
            <span className="text-amber-500 font-black text-base"> CDO</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-400'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-2">
          <Link to="/finder" className="btn-primary text-sm flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Find My Route
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {open && (
        <div className="md:hidden border-t border-white/5 bg-[#060d1a]/95 backdrop-blur-xl px-4 py-3 flex flex-col gap-1 animate-fade-in">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-400'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <Link
            to="/finder"
            onClick={() => setOpen(false)}
            className="btn-primary text-sm mt-2 flex items-center justify-center gap-2"
          >
            <MapPin className="w-4 h-4" />
            Find My Route
          </Link>
        </div>
      )}
    </header>
  )
}
