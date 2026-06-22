import api from './axios'

export const getCustomerDashboard = () => api.get('/users/customer')
export const getProviderDashboard = () => api.get('/users/provider')
export const getAdminDashboard = () => api.get('/users/admin')
export const getAllUsers = (role) => api.get('/users/admin/users', { params: role ? { role } : {} })
export const deleteUser = (id) => api.delete(`/users/admin/users/${id}`)
