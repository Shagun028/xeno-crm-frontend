import { useEffect, useState } from 'react'
import { getAnalytics, getAIInsights } from '../api'
import StatCard from '../components/StatCard'
import {
  Users,
  Megaphone,
  TrendingUp,
  MousePointer,
  Activity,
  IndianRupee,
  Brain
} from 'lucide-react'

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [insights, setInsights] = useState(null)

  useEffect(() => {
    getAnalytics()
      .then(r => setData(r.data))
      .catch(console.error)

    getAIInsights()
      .then(r => setInsights(r.data))
      .catch(console.error)
  }, [])

  if (!data) {
    return (
      <div
        style={{
          padding: 40,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          color: 'var(--text-muted)'
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: 'var(--accent)',
            animation: 'pulse 1s infinite'
          }}
        />
        Loading...
      </div>
    )
  }

  const {
    totalCustomers,
    totalCampaigns,
    totalRevenue,
    campaignStats,
    recentCampaigns
  } = data

  const deliveryRate =
    campaignStats.total_comms
      ? Math.round(
          (campaignStats.delivered /
            campaignStats.total_comms) * 100
        )
      : 0

  const openRate =
    campaignStats.delivered
      ? Math.round(
          (campaignStats.opened /
            campaignStats.delivered) * 100
        )
      : 0

  const clickRate =
    campaignStats.opened
      ? Math.round(
          (campaignStats.clicked /
            campaignStats.opened) * 100
        )
      : 0

  return (
    <div style={{ padding: '40px 48px', maxWidth: 1400 }}>
      {/* Header */}
      <div
        style={{ marginBottom: 36 }}
        className="fade-up"
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 8
          }}
        >
          <Activity
            size={14}
            color="var(--accent2)"
          />
          <span
            style={{
              fontSize: 11,
              color: 'var(--accent2)',
              textTransform: 'uppercase',
              letterSpacing: 2,
              fontWeight: 600
            }}
          >
            Live Overview
          </span>
        </div>

        <h1
          style={{
            fontFamily: 'Space Grotesk',
            fontSize: 32,
            fontWeight: 700,
            letterSpacing: -1
          }}
        >
          Dashboard
        </h1>

        <p
          style={{
            color: 'var(--text-muted)',
            marginTop: 6,
            fontSize: 14
          }}
        >
          Your brand's pulse in real time
        </p>
      </div>

      {/* KPI CARDS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(220px,1fr))',
          gap: 16,
          marginBottom: 32
        }}
      >
        <StatCard
          label="Shoppers"
          value={totalCustomers}
          color="var(--accent2)"
          icon={<Users size={16} />}
        />

        <StatCard
          label="Campaigns"
          value={totalCampaigns}
          color="var(--green)"
          icon={<Megaphone size={16} />}
        />

        <StatCard
          label="Revenue"
          value={`₹${Math.round(
            totalRevenue
          ).toLocaleString()}`}
          color="var(--green)"
          icon={<IndianRupee size={16} />}
        />

        <StatCard
          label="Delivery Rate"
          value={`${deliveryRate}%`}
          color="var(--blue)"
          icon={<TrendingUp size={16} />}
          sub={`${campaignStats.delivered || 0} delivered`}
        />

        <StatCard
          label="Open Rate"
          value={`${openRate}%`}
          color="var(--yellow)"
          icon={<MousePointer size={16} />}
          sub={`${campaignStats.opened || 0} opened`}
        />

        <StatCard
          label="Click Rate"
          value={`${clickRate}%`}
          color="var(--accent2)"
          icon={<MousePointer size={16} />}
          sub={`${campaignStats.clicked || 0} clicked`}
        />
      </div>

      {/* AI INSIGHTS */}
      {insights && (
        <div
          className="fade-up"
          style={{
            marginBottom: 32,
            background: 'var(--bg2)',
            border: '1px solid var(--border)',
            borderRadius: 20,
            padding: 24
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 20
            }}
          >
            <Brain
              size={18}
              color="var(--accent2)"
            />
            <h2
              style={{
                fontFamily: 'Space Grotesk',
                fontSize: 18
              }}
            >
              AI Insights
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fit,minmax(220px,1fr))',
              gap: 16
            }}
          >
            <StatCard
              label="VIP Inactive"
              value={insights.vipInactive.count}
              color="var(--yellow)"
            />

            <StatCard
              label="Churn Risk"
              value={insights.churnRisk.count}
              color="var(--red)"
            />

            <StatCard
              label="Frequent Buyers"
              value={insights.frequentBuyers.count}
              color="var(--green)"
            />
          </div>

          <div style={{ marginTop: 24 }}>
            {insights.recommendations.map(
              (rec, index) => (
                <div
                  key={index}
                  style={{
                    background: 'var(--bg3)',
                    border: '1px solid var(--border)',
                    borderRadius: 14,
                    padding: 18,
                    marginBottom: 12
                  }}
                >
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: 15
                    }}
                  >
                    {rec.title}
                  </div>

                  <div
                    style={{
                      marginTop: 6,
                      color: 'var(--text-muted)',
                      fontSize: 13
                    }}
                  >
                    {rec.description}
                  </div>

                  <div
                    style={{
                      marginTop: 10,
                      color: 'var(--accent2)',
                      fontSize: 12
                    }}
                  >
                    Audience Size: {rec.audience}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* RECENT CAMPAIGNS */}
      <div
        className="fade-up"
        style={{
          background: 'var(--bg2)',
          border: '1px solid var(--border)',
          borderRadius: 20,
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            padding: '20px 28px',
            borderBottom:
              '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <h2
            style={{
              fontFamily: 'Space Grotesk',
              fontSize: 15,
              fontWeight: 600
            }}
          >
            Recent Campaigns
          </h2>

          <span
            style={{
              fontSize: 11,
              color: 'var(--text-muted)',
              fontFamily: 'JetBrains Mono'
            }}
          >
            {recentCampaigns.length} total
          </span>
        </div>

        {recentCampaigns.map((c, i) => (
          <div
            key={c.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 28px',
              borderBottom:
                i <
                recentCampaigns.length - 1
                  ? '1px solid var(--border)'
                  : 'none'
            }}
          >
            <div>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: 14
                }}
              >
                {c.name}
              </div>

              <div
                style={{
                  fontSize: 12,
                  color: 'var(--text-muted)'
                }}
              >
                {c.segment_description}
              </div>
            </div>

            <div
              style={{
                color: 'var(--text-muted)',
                fontSize: 12
              }}
            >
              {c.audience_size} recipients
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}