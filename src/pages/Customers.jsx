import { useEffect, useState } from 'react'
import { getCustomers } from '../api'
import { Search, Users, Crown, IndianRupee, ShoppingBag } from 'lucide-react'

const tagStyle = (tag) => {
  const map = {
    vip: {
      bg: 'rgba(108,71,255,0.15)',
      color: '#9d7eff',
      border: 'rgba(108,71,255,0.3)',
    },
    frequent: {
      bg: 'rgba(0,180,255,0.1)',
      color: '#00b4ff',
      border: 'rgba(0,180,255,0.2)',
    },
    'at-risk': {
      bg: 'rgba(255,68,102,0.1)',
      color: '#ff4466',
      border: 'rgba(255,68,102,0.2)',
    },
    new: {
      bg: 'rgba(0,229,160,0.1)',
      color: '#00e5a0',
      border: 'rgba(0,229,160,0.2)',
    },
  }

  return (
    map[tag] || {
      bg: 'rgba(255,255,255,0.05)',
      color: 'var(--text-muted)',
      border: 'var(--border)',
    }
  )
}

export default function Customers() {
  const [customers, setCustomers] = useState([])
  const [search, setSearch] = useState('')
  const [focused, setFocused] = useState(false)
  const [activeFilter, setActiveFilter] = useState('all')

  useEffect(() => {
    getCustomers().then((r) => setCustomers(r.data))
  }, [])

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase()

    return (
      c.name?.toLowerCase().includes(q) ||
      c.city?.toLowerCase().includes(q) ||
      c.tags?.toLowerCase().includes(q)
    )
  })

  const displayedCustomers =
    activeFilter === 'all'
      ? filtered
      : filtered.filter((c) =>
          c.tags?.toLowerCase().includes(activeFilter)
        )

  const vipCount = customers.filter((c) =>
    c.tags?.includes('vip')
  ).length

  const totalRevenue = customers.reduce(
    (sum, c) => sum + (c.total_spent || 0),
    0
  )

  const totalOrders = customers.reduce(
    (sum, c) => sum + (c.order_count || 0),
    0
  )

  const avgOrderValue =
    totalOrders > 0
      ? Math.round(totalRevenue / totalOrders)
      : 0

  return (
    <div style={{ padding: '40px 48px', maxWidth: 1400 }}>
      {/* Header */}
      <div
        style={{
          marginBottom: 32,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }}
        className="fade-up"
      >
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 8,
            }}
          >
            <Users size={14} color="var(--accent2)" />
            <span
              style={{
                fontSize: 11,
                color: 'var(--accent2)',
                textTransform: 'uppercase',
                letterSpacing: 2,
                fontWeight: 600,
              }}
            >
              Shopper Base
            </span>
          </div>

          <h1
            style={{
              fontFamily: 'Space Grotesk',
              fontSize: 32,
              fontWeight: 700,
              letterSpacing: -1,
            }}
          >
            Customers
          </h1>

          <p
            style={{
              color: 'var(--text-muted)',
              marginTop: 6,
              fontSize: 14,
            }}
          >
            {customers.length} shoppers · {displayedCustomers.length} shown
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: 'var(--bg2)',
            border: `1px solid ${
              focused
                ? 'rgba(108,71,255,0.4)'
                : 'var(--border)'
            }`,
            borderRadius: 12,
            padding: '10px 16px',
            transition: 'all 0.2s',
            boxShadow: focused
              ? '0 0 0 3px rgba(108,71,255,0.1)'
              : 'none',
          }}
        >
          <Search size={14} color="var(--text-muted)" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Search name, city, tag..."
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text)',
              fontSize: 13,
              outline: 'none',
              width: 240,
            }}
          />
        </div>
      </div>

      {/* KPI CARDS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4,1fr)',
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            background: 'var(--bg2)',
            border: '1px solid var(--border)',
            borderRadius: 18,
            padding: 20,
          }}
        >
          <Users size={18} color="var(--accent2)" />
          <div
            style={{
              marginTop: 10,
              fontSize: 11,
              color: 'var(--text-muted)',
            }}
          >
            TOTAL CUSTOMERS
          </div>
          <div
            style={{
              fontSize: 30,
              fontWeight: 700,
              marginTop: 4,
            }}
          >
            {customers.length}
          </div>
        </div>

        <div
          style={{
            background: 'var(--bg2)',
            border: '1px solid var(--border)',
            borderRadius: 18,
            padding: 20,
          }}
        >
          <Crown size={18} color="#9d7eff" />
          <div
            style={{
              marginTop: 10,
              fontSize: 11,
              color: 'var(--text-muted)',
            }}
          >
            VIP CUSTOMERS
          </div>
          <div
            style={{
              fontSize: 30,
              fontWeight: 700,
              marginTop: 4,
            }}
          >
            {vipCount}
          </div>
        </div>

        <div
          style={{
            background: 'var(--bg2)',
            border: '1px solid var(--border)',
            borderRadius: 18,
            padding: 20,
          }}
        >
          <IndianRupee size={18} color="var(--green)" />
          <div
            style={{
              marginTop: 10,
              fontSize: 11,
              color: 'var(--text-muted)',
            }}
          >
            TOTAL REVENUE
          </div>
          <div
            style={{
              fontSize: 30,
              fontWeight: 700,
              marginTop: 4,
              color: 'var(--green)',
            }}
          >
            ₹{totalRevenue.toLocaleString()}
          </div>
        </div>

        <div
          style={{
            background: 'var(--bg2)',
            border: '1px solid var(--border)',
            borderRadius: 18,
            padding: 20,
          }}
        >
          <ShoppingBag size={18} color="var(--blue)" />
          <div
            style={{
              marginTop: 10,
              fontSize: 11,
              color: 'var(--text-muted)',
            }}
          >
            AVG ORDER VALUE
          </div>
          <div
            style={{
              fontSize: 30,
              fontWeight: 700,
              marginTop: 4,
            }}
          >
            ₹{avgOrderValue}
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div
        style={{
          display: 'flex',
          gap: 10,
          marginBottom: 24,
          flexWrap: 'wrap',
        }}
      >
        {['all', 'vip', 'frequent', 'at-risk', 'new'].map(
          (filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              style={{
                padding: '8px 14px',
                borderRadius: 999,
                border: '1px solid var(--border)',
                background:
                  activeFilter === filter
                    ? 'rgba(108,71,255,0.15)'
                    : 'transparent',
                color:
                  activeFilter === filter
                    ? '#9d7eff'
                    : 'var(--text-muted)',
                cursor: 'pointer',
              }}
            >
              {filter.toUpperCase()}
            </button>
          )
        )}
      </div>

      {/* TABLE */}
      <div
        className="fade-up"
        style={{
          background: 'var(--bg2)',
          border: '1px solid var(--border)',
          borderRadius: 20,
          overflow: 'hidden',
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
          }}
        >
          <thead>
            <tr
              style={{
                borderBottom: '1px solid var(--border)',
              }}
            >
              {[
                'Customer',
                'City',
                'Orders',
                'Total Spent',
                'Tags',
                'Last Order',
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: '14px 24px',
                    textAlign: 'left',
                    fontSize: 10,
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: 1.5,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {displayedCustomers.map((c, i) => (
              <tr
                key={c.id}
                style={{
                  borderBottom:
                    i < displayedCustomers.length - 1
                      ? '1px solid var(--border)'
                      : 'none',
                }}
              >
                <td style={{ padding: '16px 24px' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                    }}
                  >
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 10,
                        background:
                          'linear-gradient(135deg,#6c47ff,#9d7eff)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                      }}
                    >
                      {c.name?.[0]}
                    </div>

                    <div>
                      <div>{c.name}</div>
                      <div
                        style={{
                          fontSize: 11,
                          color: 'var(--text-muted)',
                        }}
                      >
                        {c.email}
                      </div>
                    </div>
                  </div>
                </td>

                <td style={{ padding: '16px 24px' }}>
                  {c.city}
                </td>

                <td style={{ padding: '16px 24px' }}>
                  {c.order_count}
                </td>

                <td style={{ padding: '16px 24px' }}>
                  <div
                    style={{
                      color: 'var(--green)',
                      fontWeight: 600,
                    }}
                  >
                    ₹{c.total_spent.toLocaleString()}
                  </div>

                  <div
                    style={{
                      width: 100,
                      height: 4,
                      background: 'var(--bg3)',
                      borderRadius: 999,
                      marginTop: 6,
                    }}
                  >
                    <div
                      style={{
                        width: `${Math.min(
                          (c.total_spent / 10000) * 100,
                          100
                        )}%`,
                        height: '100%',
                        background: 'var(--green)',
                        borderRadius: 999,
                      }}
                    />
                  </div>
                </td>

                <td style={{ padding: '16px 24px' }}>
                  <div
                    style={{
                      display: 'flex',
                      gap: 6,
                      flexWrap: 'wrap',
                    }}
                  >
                    {c.tags
                      ?.split(',')
                      .filter(Boolean)
                      .map((tag) => {
                        const s = tagStyle(tag)

                        return (
                          <span
                            key={tag}
                            style={{
                              fontSize: 10,
                              padding: '3px 9px',
                              borderRadius: 20,
                              fontWeight: 600,
                              background: s.bg,
                              color: s.color,
                              border: `1px solid ${s.border}`,
                            }}
                          >
                            {tag.toUpperCase()}
                          </span>
                        )
                      })}
                  </div>
                </td>

                <td
                  style={{
                    padding: '16px 24px',
                    color: 'var(--text-muted)',
                    fontSize: 12,
                  }}
                >
                  {new Date(
                    c.last_order_date
                  ).toLocaleDateString('en-IN')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {displayedCustomers.length === 0 && (
          <div
            style={{
              padding: 60,
              textAlign: 'center',
              color: 'var(--text-muted)',
            }}
          >
            No customers found.
          </div>
        )}
      </div>
    </div>
  )
}