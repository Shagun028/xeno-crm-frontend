import { useEffect, useState } from 'react'
import { getCampaigns, getCampaign } from '../api'
import { Megaphone, BarChart2, RefreshCw } from 'lucide-react'

const statusColor = {
  sent: { color: 'var(--blue)', bg: 'var(--blue-dim)', border: 'rgba(0,180,255,0.2)' },
  delivered: { color: 'var(--green)', bg: 'var(--green-dim)', border: 'rgba(0,229,160,0.2)' },
  opened: { color: 'var(--accent2)', bg: 'rgba(157,126,255,0.1)', border: 'rgba(157,126,255,0.2)' },
  clicked: { color: 'var(--yellow)', bg: 'var(--yellow-dim)', border: 'rgba(255,184,0,0.2)' },
  failed: { color: 'var(--red)', bg: 'var(--red-dim)', border: 'rgba(255,68,102,0.2)' },
  queued: { color: 'var(--text-muted)', bg: 'rgba(255,255,255,0.04)', border: 'var(--border)' },
}

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([])
  const [selected, setSelected] = useState(null)
  const [detail, setDetail] = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => { getCampaigns().then(r => setCampaigns(r.data)) }, [])

  const selectCampaign = async (c) => {
    setSelected(c.id)
    const r = await getCampaign(c.id)
    setDetail(r.data)
  }

  const refresh = async () => {
    if (!selected) return
    setRefreshing(true)
    const r = await getCampaign(selected)
    setDetail(r.data)
    setRefreshing(false)
  }

  const deliveryRate = detail?.stats?.total
  ? Math.round((detail.stats.delivered / detail.stats.total) * 100)
  : 0

const openRate = detail?.stats?.delivered
  ? Math.round((detail.stats.opened / detail.stats.delivered) * 100)
  : 0

const ctr = detail?.stats?.opened
  ? Math.round((detail.stats.clicked / detail.stats.opened) * 100)
  : 0

 const statItems = detail ? [
  { label: 'Delivered', value: detail.stats.delivered || 0, ...statusColor.delivered },

  { label: 'Opened', value: detail.stats.opened || 0, ...statusColor.opened },

  { label: 'Clicked', value: detail.stats.clicked || 0, ...statusColor.clicked },

  { label: 'Failed', value: detail.stats.failed || 0, ...statusColor.failed },

  { label: 'Total Sent', value: detail.stats.total || 0, ...statusColor.sent },

  {
    label: 'Delivery Rate',
    value: `${deliveryRate}%`,
    color: 'var(--blue)',
    bg: 'rgba(0,180,255,0.08)',
    border: 'rgba(0,180,255,0.2)'
  },

  {
    label: 'Open Rate',
    value: `${openRate}%`,
    color: 'var(--accent2)',
    bg: 'rgba(157,126,255,0.08)',
    border: 'rgba(157,126,255,0.2)'
  },

  {
    label: 'CTR',
    value: `${ctr}%`,
    color: 'var(--yellow)',
    bg: 'rgba(255,184,0,0.08)',
    border: 'rgba(255,184,0,0.2)'
  },
] : []

  return (
    <div style={{ padding: '40px 48px', maxWidth: 1400 }}>
      <div style={{ marginBottom: 32 }} className="fade-up">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <BarChart2 size={14} color="var(--accent2)" />
          <span style={{ fontSize: 11, color: 'var(--accent2)', textTransform: 'uppercase', letterSpacing: 2, fontWeight: 600 }}>Performance</span>
        </div>
        <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 32, fontWeight: 700, letterSpacing: -1 }}>Campaigns</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: 6, fontSize: 14 }}>Select a campaign to inspect delivery and engagement</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: detail ? '340px 1fr' : '1fr', gap: 20 }}>
        {/* Campaign list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {campaigns.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', background: 'var(--bg2)', borderRadius: 16, border: '1px solid var(--border)' }}>
              <Megaphone size={28} style={{ opacity: 0.2, marginBottom: 12 }} />
              <div style={{ fontSize: 14 }}>No campaigns yet</div>
            </div>
          ) : campaigns.map(c => (
            <div key={c.id} onClick={() => selectCampaign(c)} className="fade-up" style={{
              background: selected === c.id ? 'var(--bg3)' : 'var(--bg2)',
              border: `1px solid ${selected === c.id ? 'rgba(108,71,255,0.4)' : 'var(--border)'}`,
              borderRadius: 16, padding: '16px 20px', cursor: 'pointer',
              transition: 'all 0.15s',
              boxShadow: selected === c.id ? '0 0 0 1px rgba(108,71,255,0.2), inset 0 0 30px rgba(108,71,255,0.03)' : 'none'
            }}
              onMouseEnter={e => { if (selected !== c.id) e.currentTarget.style.borderColor = 'var(--border-bright)' }}
              onMouseLeave={e => { if (selected !== c.id) e.currentTarget.style.borderColor = 'var(--border)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>{c.name}</div>
                <span style={{ fontSize: 10, padding: '3px 10px', borderRadius: 20, fontWeight: 600, letterSpacing: 0.5, background: 'var(--green-dim)', color: 'var(--green)', border: '1px solid rgba(0,229,160,0.2)' }}>
                  {c.status.toUpperCase()}
                </span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>{c.segment_description}</div>
              <div style={{ display: 'flex', gap: 16 }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>👥 {c.audience_size}</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>📱 {c.channel}</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>{new Date(c.created_at).toLocaleDateString('en-IN')}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Detail panel */}
        {detail && (
          <div className="fade-up" style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 20, padding: 28, display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h2 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 20 }}>{detail.name}</h2>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{detail.segment_description}</div>
              </div>
              <button onClick={refresh} style={{
                background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10,
                padding: '8px 14px', cursor: 'pointer', color: 'var(--text-muted)',
                display: 'flex', alignItems: 'center', gap: 6, fontSize: 12
              }}>
                <RefreshCw size={12} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
                Refresh
              </button>
            </div>

            {/* Stats grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              {statItems.map(s => (
                <div key={s.label} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 14, padding: '16px 18px' }}>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8, fontWeight: 600 }}>{s.label}</div>
                  <div style={{ fontSize: 28, fontWeight: 700, fontFamily: 'Space Grotesk', color: s.color, letterSpacing: -1 }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Recipients */}
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12, fontWeight: 600 }}>Recipients</div>
              <div style={{ maxHeight: 320, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {detail.communications.map(comm => {
                  const s = statusColor[comm.status] || statusColor.queued
                  return (
                    <div key={comm.id} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '10px 16px', background: 'var(--bg3)', borderRadius: 10,
                      border: '1px solid var(--border)', transition: 'border-color 0.15s'
                    }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-bright)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                    >
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{comm.customer_name}</div>
                      <span style={{ fontSize: 10, padding: '3px 10px', borderRadius: 20, fontWeight: 600, letterSpacing: 0.5, background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
                        {comm.status.toUpperCase()}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}