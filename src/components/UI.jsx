import { useState } from 'react'

/* ── Spinner ── */
export function Spinner({ size = 20 }) {
  return (
    <div style={{
      width: size, height: size,
      border: `2px solid rgba(124,106,247,0.2)`,
      borderTopColor: 'var(--accent)',
      borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
      display: 'inline-block'
    }} />
  )
}

/* ── Button ── */
export function Button({ children, variant = 'primary', size = 'md', disabled, onClick, style, type = 'button' }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    fontFamily: 'var(--font-body)', fontWeight: 500,
    border: 'none', borderRadius: 'var(--radius-sm)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'all 0.15s ease',
    whiteSpace: 'nowrap',
  }
  const sizes = {
    sm: { padding: '6px 12px', fontSize: 13 },
    md: { padding: '9px 18px', fontSize: 14 },
    lg: { padding: '12px 24px', fontSize: 15 },
  }
  const variants = {
    primary: { background: 'var(--accent)', color: '#fff' },
    ghost: { background: 'transparent', color: 'var(--text-2)', border: '1px solid var(--border)' },
    danger: { background: 'var(--red-bg)', color: 'var(--red)', border: '1px solid rgba(248,113,113,0.2)' },
    success: { background: 'var(--green-bg)', color: 'var(--green)', border: '1px solid rgba(74,222,128,0.2)' },
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      style={{ ...base, ...sizes[size], ...variants[variant], ...style }}>
      {children}
    </button>
  )
}

/* ── Input ── */
export function Input({ label, value, onChange, placeholder, multiline, rows = 3, error }) {
  const inputStyle = {
    width: '100%', padding: '10px 14px',
    background: 'var(--bg-3)', border: `1px solid ${error ? 'var(--red)' : 'var(--border)'}`,
    borderRadius: 'var(--radius-sm)', color: 'var(--text)',
    fontSize: 14, outline: 'none', transition: 'border-color 0.15s',
    resize: multiline ? 'vertical' : 'none',
    fontFamily: 'var(--font-body)',
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && <label style={{ fontSize: 13, color: 'var(--text-2)', fontWeight: 500 }}>{label}</label>}
      {multiline
        ? <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows} style={inputStyle}
            onFocus={e => e.target.style.borderColor = 'var(--accent)'}
            onBlur={e => e.target.style.borderColor = error ? 'var(--red)' : 'var(--border)'} />
        : <input value={value} onChange={onChange} placeholder={placeholder} style={inputStyle}
            onFocus={e => e.target.style.borderColor = 'var(--accent)'}
            onBlur={e => e.target.style.borderColor = error ? 'var(--red)' : 'var(--border)'} />
      }
      {error && <span style={{ fontSize: 12, color: 'var(--red)' }}>{error}</span>}
    </div>
  )
}

/* ── Card ── */
export function Card({ children, style, onClick, hover = false }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => hover && setHovered(true)}
      onMouseLeave={() => hover && setHovered(false)}
      style={{
        background: 'var(--bg-2)',
        border: `1px solid ${hovered ? 'var(--border-hover)' : 'var(--border)'}`,
        borderRadius: 'var(--radius)',
        transition: 'border-color 0.15s, transform 0.15s',
        transform: hovered && onClick ? 'translateY(-2px)' : 'none',
        cursor: onClick ? 'pointer' : 'default',
        ...style
      }}>
      {children}
    </div>
  )
}

/* ── Badge ── */
export function Badge({ children, color = 'accent' }) {
  const colors = {
    accent: { bg: 'var(--accent-bg)', text: 'var(--accent-2)' },
    green: { bg: 'var(--green-bg)', text: 'var(--green)' },
    red: { bg: 'var(--red-bg)', text: 'var(--red)' },
    amber: { bg: 'rgba(251,191,36,0.1)', text: 'var(--amber)' },
    gray: { bg: 'rgba(255,255,255,0.06)', text: 'var(--text-2)' },
  }
  const c = colors[color] || colors.accent
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '3px 10px', borderRadius: 99,
      fontSize: 12, fontWeight: 500,
      background: c.bg, color: c.text
    }}>
      {children}
    </span>
  )
}

/* ── Page layout ── */
export function PageLayout({ children }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px' }}>
        {children}
      </div>
    </div>
  )
}

/* ── Top nav ── */
export function TopNav({ title, back, backLabel = 'Voltar', actions }) {
  return (
    <nav style={{
      display: 'flex', alignItems: 'center', gap: 16,
      padding: '20px 0', borderBottom: '1px solid var(--border)',
      marginBottom: 32
    }}>
      {back && (
        <a href={back} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          color: 'var(--text-2)', fontSize: 14, transition: 'color 0.15s'
        }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-2)'}>
          ← {backLabel}
        </a>
      )}
      <span style={{
        fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600,
        color: 'var(--text)', flex: 1
      }}>{title}</span>
      {actions && <div style={{ display: 'flex', gap: 8 }}>{actions}</div>}
    </nav>
  )
}

/* ── Empty state ── */
export function EmptyState({ icon, title, description, action }) {
  return (
    <div style={{ textAlign: 'center', padding: '64px 20px' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>{icon}</div>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, marginBottom: 8 }}>{title}</h3>
      <p style={{ color: 'var(--text-2)', fontSize: 14, marginBottom: 24 }}>{description}</p>
      {action}
    </div>
  )
}

/* ── Progress bar ── */
export function ProgressBar({ value, max, color = 'var(--accent)' }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div style={{ width: '100%', height: 4, background: 'var(--bg-4)', borderRadius: 99, overflow: 'hidden' }}>
      <div style={{
        height: '100%', width: pct + '%', background: color,
        borderRadius: 99, transition: 'width 0.4s cubic-bezier(.16,1,.3,1)'
      }} />
    </div>
  )
}

/* ── Toast ── */
let toastTimeout
export function useToast() {
  const [toast, setToast] = useState(null)
  const show = (message, type = 'success') => {
    clearTimeout(toastTimeout)
    setToast({ message, type })
    toastTimeout = setTimeout(() => setToast(null), 3000)
  }
  return { toast, show }
}

export function Toast({ toast }) {
  if (!toast) return null
  const colors = {
    success: { bg: 'var(--green-bg)', border: 'rgba(74,222,128,0.25)', text: 'var(--green)' },
    error: { bg: 'var(--red-bg)', border: 'rgba(248,113,113,0.25)', text: 'var(--red)' },
  }
  const c = colors[toast.type] || colors.success
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 1000,
      padding: '12px 20px', borderRadius: 'var(--radius-sm)',
      background: c.bg, border: `1px solid ${c.border}`, color: c.text,
      fontSize: 14, fontWeight: 500,
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      animation: 'slideUp 0.3s ease both'
    }}>
      {toast.message}
    </div>
  )
}
