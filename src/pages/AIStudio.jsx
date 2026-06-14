import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles, Zap, Bot } from 'lucide-react'
import { chat, segment, draftMessage, sendCampaign } from '../api'

export default function AIStudio() {
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: "Hey! I'm your AI marketing co-pilot.\n\nTell me who you want to reach — I'll find them, draft the perfect message, and send the campaign. Try tapping a suggestion below.",
  }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [pendingCampaign, setPendingCampaign] = useState(null)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const addMessage = (role, content, meta = null) => {
    setMessages(prev => [...prev, { role, content, meta }])
  }

  const handleSend = async (text) => {
    const userMsg = (text || input).trim()
    if (!userMsg || loading) return
    setInput('')
    addMessage('user', userMsg)
    setLoading(true)

    try {
      const history = [...messages, { role: 'user', content: userMsg }]
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .map(m => ({ role: m.role, content: m.content }))

      const { data } = await chat(history)

      if (data.action === 'segment') {
        addMessage('assistant', data.message || 'Searching your shopper base...')
        const segResult = await segment(data.params.description)
        const { customers, count } = segResult.data

        if (count === 0) {
          addMessage('assistant', "No customers matched that criteria. Try a broader description.")
        } else {
          addMessage(
  'assistant',
  `Audience Ready

${count} customers matched.

Segment:
${data.params.description}

Next step:
Ask me to draft a campaign message.`,
  {
    type: 'segment_result',
    customers,
    count,
    description: data.params.description
  }
)
          setPendingCampaign({ customers, segmentDescription: data.params.description })
        }

      } else if (data.action === 'draft_message') {
        addMessage('assistant', data.message || 'Drafting your message...')
        const draft = await draftMessage({
          campaignGoal: data.params.campaignGoal || userMsg,
          segmentDescription: data.params.segmentDescription || pendingCampaign?.segmentDescription || 'general audience',
          sampleCustomer: pendingCampaign?.customers?.[0]
        })
        addMessage('assistant', `Here's your message:\n\n"${draft.data.message}"\n\nShall I send this? Tell me what to name the campaign.`, {
          type: 'draft_result', message: draft.data.message
        })
        setPendingCampaign(prev => ({ ...prev, messageTemplate: draft.data.message }))

      } else if (data.action === 'send_campaign') {
        if (!pendingCampaign?.customers || !pendingCampaign?.messageTemplate) {
          addMessage('assistant', "Let's first find your audience and draft a message before sending!")
        } else {
          addMessage('assistant', 'Launching campaign...')
          const result = await sendCampaign({
            name: data.params.name || userMsg,
            segmentDescription: pendingCampaign.segmentDescription,
            messageTemplate: pendingCampaign.messageTemplate,
            channel: 'whatsapp',
            customers: pendingCampaign.customers
          })
          addMessage('assistant',
  `Campaign Successfully Launched

Audience: ${result.data.sent} customers

Channel: WhatsApp

Status: Sending

You can now monitor opens, clicks and delivery metrics in the Campaigns dashboard.`, {
            type: 'campaign_sent', ...result.data
          })
          setPendingCampaign(null)
        }
      } else {
        addMessage('assistant', data.message || "I didn't catch that. Try describing your audience or campaign goal.")
      }

    } catch (e) {
      addMessage('assistant', 'Something went wrong. Try again.')
    }

    setLoading(false)
  }

  const suggestions = [
  "Find VIP customers who spent over ₹5000",
  "Show customers inactive for 90 days",
  "Find shoppers from Chennai",
  "Draft a re-engagement message",
  "Create a festival sale campaign",
  "Send the campaign",
]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg)' }}>
      {/* Header */}
      <div style={{ padding: '24px 40px 20px', borderBottom: '1px solid var(--border)', background: 'var(--bg2)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #6c47ff, #9d7eff)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px rgba(108,71,255,0.4)', animation: 'glow 3s ease infinite'
          }}>
            <Sparkles size={16} color="white" />
          </div>
          <div>
            <div style={{ fontFamily: 'Space Grotesk', fontSize: 18, fontWeight: 700 }}>AI Studio</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Describe your campaign in plain English</div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--green)' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 6px var(--green)' }} />
            AI Active
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '28px 40px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {messages.map((msg, i) => (
          <div key={i} className="fade-up" style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', gap: 10 }}>
            {msg.role === 'assistant' && (
              <div style={{
                width: 30, height: 30, borderRadius: 9, flexShrink: 0, marginTop: 2,
                background: 'linear-gradient(135deg, rgba(108,71,255,0.3), rgba(157,126,255,0.2))',
                border: '1px solid rgba(108,71,255,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Bot size={13} color="var(--accent2)" />
              </div>
            )}
            <div style={{ maxWidth: '72%' }}>
              <div style={{
                background: msg.role === 'user'
                  ? 'linear-gradient(135deg, #6c47ff, #8a65ff)'
                  : 'var(--bg2)',
                border: msg.role === 'user' ? 'none' : '1px solid var(--border)',
                borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '4px 18px 18px 18px',
                padding: '12px 16px', fontSize: 14, lineHeight: 1.65, color: 'var(--text)',
                whiteSpace: 'pre-wrap', boxShadow: msg.role === 'user' ? '0 4px 20px rgba(108,71,255,0.3)' : 'none'
              }}>
                {msg.content.replace(/\*\*(.*?)\*\*/g, '$1')}
              </div>

              {msg.meta?.type === 'segment_result' && (
                <div style={{ marginTop: 10, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <div
  style={{
    marginTop: 10,
    marginBottom: 10,
    padding: 12,
    background: 'var(--bg3)',
    borderRadius: 10,
    border: '1px solid var(--border)'
  }}
>
  <div style={{ fontSize: 12 }}>
    Audience Size: <strong>{msg.meta.count}</strong>
  </div>

  <div
    style={{
      fontSize: 11,
      color: 'var(--text-muted)',
      marginTop: 4
    }}
  >
    {msg.meta.description}
  </div>
</div>
                  {msg.meta.customers.slice(0, 6).map(c => (
                    <span key={c.id} style={{
                      fontSize: 11, padding: '4px 12px', borderRadius: 20, fontWeight: 500,
                      background: 'rgba(108,71,255,0.15)', color: 'var(--accent3)',
                      border: '1px solid rgba(108,71,255,0.25)'
                    }}>{c.name}</span>
                  ))}
                  {msg.meta.count > 6 && (
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', padding: '4px 8px' }}>+{msg.meta.count - 6} more</span>
                  )}
                </div>
              )}

              {msg.meta?.type === 'campaign_sent' && (
                <div style={{ marginTop: 10, padding: '12px 16px', background: 'var(--green-dim)', border: '1px solid rgba(0,229,160,0.2)', borderRadius: 12, fontSize: 13, color: 'var(--green)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Zap size={13} fill="var(--green)" />
                  Campaign live · {msg.meta.sent} messages dispatched
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{
              width: 30, height: 30, borderRadius: 9,
              background: 'linear-gradient(135deg, rgba(108,71,255,0.3), rgba(157,126,255,0.2))',
              border: '1px solid rgba(108,71,255,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Bot size={13} color="var(--accent2)" />
            </div>
            <div style={{ padding: '12px 18px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '4px 18px 18px 18px', display: 'flex', gap: 5 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent2)', animation: 'pulse 1.2s ease-in-out infinite', animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div style={{ padding: '16px 40px 28px', borderTop: '1px solid var(--border)', background: 'var(--bg2)', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
          {suggestions.map(s => (
            <button key={s} onClick={() => handleSend(s)} style={{
              fontSize: 12, padding: '6px 14px', borderRadius: 20,
              border: '1px solid var(--border)', background: 'transparent',
              color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'Inter'
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent3)'; e.currentTarget.style.background = 'rgba(108,71,255,0.08)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent' }}
            >{s}</button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <input ref={inputRef} value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Describe your audience, message, or campaign..."
            style={{
              flex: 1, background: 'var(--bg3)',
              border: '1px solid var(--border-bright)',
              borderRadius: 14, padding: '14px 18px',
              color: 'var(--text)', fontSize: 14, outline: 'none', fontFamily: 'Inter',
              transition: 'border-color 0.2s, box-shadow 0.2s'
            }}
            onFocus={e => { e.target.style.borderColor = 'rgba(108,71,255,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(108,71,255,0.1)' }}
            onBlur={e => { e.target.style.borderColor = 'var(--border-bright)'; e.target.style.boxShadow = 'none' }}
          />
          <button onClick={() => handleSend()} disabled={loading} style={{
            background: loading ? 'var(--bg4)' : 'linear-gradient(135deg, #6c47ff, #8a65ff)',
            border: 'none', borderRadius: 14, padding: '14px 22px',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', gap: 8,
            color: 'white', fontWeight: 600, fontSize: 14,
            boxShadow: loading ? 'none' : '0 4px 20px rgba(108,71,255,0.4)',
            transition: 'all 0.2s'
          }}>
            <Send size={15} /> Send
          </button>
        </div>
      </div>
    </div>
  )
}