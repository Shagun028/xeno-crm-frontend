import axios from 'axios'

const api = axios.create({
  baseURL: 'https://xeno-crm-backend-wfaa.onrender.com'
})

export const getCustomers = () => api.get('/api/customers')

export const getCampaigns = () => api.get('/api/campaigns')

export const getCampaign = (id) =>
  api.get(`/api/campaigns/${id}`)

export const getAnalytics = () =>
  api.get('/api/analytics')

export const getAIInsights = () =>
  api.get('/api/ai-insights')

export const segment = (description) =>
  api.post('/api/segment', { description })

export const draftMessage = (data) =>
  api.post('/api/draft-message', data)

export const sendCampaign = (data) =>
  api.post('/api/campaigns/send', data)

export const chat = (messages) =>
  api.post('/api/chat', { messages })

export default api