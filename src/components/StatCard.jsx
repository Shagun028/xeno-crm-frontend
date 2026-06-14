export default function StatCard({ label, value, sub, color = 'var(--accent2)', icon, delay = 0 }) {
  return (
    <div className="fade-up" style={{
      animationDelay: `${delay}ms`,
      background: 'var(--bg2)',
      border: '1px solid var(--border)',
      borderRadius: 16, padding: '20px 22px',
      display: 'flex', flexDirection: 'column', gap: 10,
      position: 'relative', overflow: 'hidden',
      transition: 'border-color 0.2s, transform 0.2s',
      cursor: 'default'
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(108,71,255,0.3)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)' }}
    >
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: 80, height: 80, borderRadius: '0 16px 0 80px',
        background: `radial-gradient(circle at top right, ${color}18, transparent 70%)`,
        pointerEvents: 'none'
      }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 500 }}>{label}</div>
        {icon && <div style={{ color, opacity: 0.6 }}>{icon}</div>}
      </div>
      <div style={{
        fontSize: 34, fontWeight: 700, fontFamily: 'Space Grotesk',
        color, lineHeight: 1, letterSpacing: -1
      }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{sub}</div>}
    </div>
  )
}