import { LayoutDashboard, Users, Megaphone, Sparkles, Zap } from 'lucide-react'

const links = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'campaigns', label: 'Campaigns', icon: Megaphone },
  { id: 'ai', label: 'AI Studio', icon: Sparkles },
]

export default function Sidebar({ active, onNav }) {
  return (
    <aside style={{
      width: 220, background: 'var(--bg2)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      padding: '28px 14px', gap: 2, flexShrink: 0,
      position: 'relative', overflow: 'hidden'
    }}>
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', top: -60, left: -60,
        width: 200, height: 200, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(108,71,255,0.12) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* Logo */}
      <div style={{ padding: '0 10px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'linear-gradient(135deg, #6c47ff, #9d7eff)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 16px rgba(108,71,255,0.5)'
          }}>
            <Zap size={14} color="white" fill="white" />
          </div>
          <span style={{
            fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 17,
            background: 'linear-gradient(135deg, #fff 0%, #9d7eff 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>XENO CRM</span>
        </div>
        <div style={{
          fontSize: 10, color: 'var(--text-muted)', letterSpacing: 2,
          textTransform: 'uppercase', paddingLeft: 36
        }}>AI-Native</div>
      </div>

      {/* Nav */}
      {links.map(({ id, label, icon: Icon }) => {
        const isActive = active === id
        return (
          <button key={id} onClick={() => onNav(id)} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '11px 12px', borderRadius: 10, border: 'none',
            cursor: 'pointer', width: '100%', textAlign: 'left',
            background: isActive ? 'linear-gradient(135deg, rgba(108,71,255,0.2), rgba(157,126,255,0.08))' : 'transparent',
            color: isActive ? 'var(--accent3)' : 'var(--text-muted)',
            fontWeight: isActive ? 600 : 400, fontSize: 13,
            transition: 'all 0.2s',
            boxShadow: isActive ? 'inset 0 0 0 1px rgba(108,71,255,0.3)' : 'none',
            position: 'relative', overflow: 'hidden'
          }}
            onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'var(--text-dim)' }}
            onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isActive ? 'var(--accent3)' : 'var(--text-muted)' }}
          >
            {isActive && <div style={{
              position: 'absolute', left: 0, top: '20%', bottom: '20%',
              width: 3, borderRadius: 2, background: 'var(--accent2)'
            }} />}
            <Icon size={15} />
            {label}
          </button>
        )
      })}

      {/* Bottom status */}
      <div style={{ marginTop: 'auto', padding: '16px 12px 0', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 6px var(--green)' }} />
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>All systems live</span>
        </div>
      </div>
    </aside>
  )
}