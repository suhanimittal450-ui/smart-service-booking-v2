import api from './axios'

export const getServices = () => api.get('/services')
export const getService = (id) => api.get(`/services/${id}`)
export const getMyServices = () => api.get('/services/provider/my-services')
export const createService = (payload) => api.post('/services', payload)
export const updateService = (id, payload) => api.put(`/services/${id}`, payload)
export const deleteService = (id) => api.delete(`/services/${id}`)
