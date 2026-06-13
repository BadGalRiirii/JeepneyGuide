import { createContext, useContext, useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

const ThemeCtx = createContext()

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    try { return localStorage.getItem('sakayko-theme') === 'dark' }
    catch { return false }
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    try { localStorage.setItem('sakayko-theme', isDark ? 'dark' : 'light') } catch {}
  }, [isDark])

  return (
    <ThemeCtx.Provider value={{ isDark, toggle: () => setIsDark(d => !d) }}>
      {children}
    </ThemeCtx.Provider>
  )
}

export const useTheme = () => useContext(ThemeCtx)

export function ThemeToggle({ className = '' }) {
  const { isDark, toggle } = useTheme()
  return (
    <button
      onClick={toggle}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`w-8 h-8 flex items-center justify-center rounded-xl bg-th-glass hover:bg-th-glassh border border-th-border transition-all active:scale-90 ${className}`}
    >
      {isDark
        ? <Sun  className="w-4 h-4 text-amber-400" />
        : <Moon className="w-4 h-4 text-th-text2" />}
    </button>
  )
}
