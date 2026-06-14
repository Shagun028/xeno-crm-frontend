import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Customers from './pages/Customers'
import Campaigns from './pages/Campaigns'
import AIStudio from './pages/AIStudio'

export default function App() {
  const [page, setPage] = useState('dashboard')

  const pages = {
    dashboard: <Dashboard />,
    customers: <Customers />,
    campaigns: <Campaigns />,
    ai: <AIStudio />
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar active={page} onNav={setPage} />
      <main style={{ flex: 1, overflow: 'auto' }}>
        {pages[page]}
      </main>
    </div>
  )
}