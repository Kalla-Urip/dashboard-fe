import axiosInstance from "../utils/axios"
// import { handleApiError } from "../utils/errorHandler"

export const customerService = {
  fetchAll: async (params = {}) => {
    const response = await axiosInstance.get('/customer/paginate', {
      params,
    })
    return response.data
  },
  getById: async (id) => {
    const response = await axiosInstance.get(`/customer/${id}`)
    return response.data
  },
  store: async (data) => {
    const response = await axiosInstance.post('/customer', data)
    return response.data
  },
  update: async (data) => {
    const response = await axiosInstance.put(`/customer/${data.id}`, data)
    return response.data
  },
  updateFromWAC: async (data) => {
    const response = await axiosInstance.put(`/customer/${data.id}/from-wac`, data)
    return response.data
  },
  delete: async (id) => {
    const response = await axiosInstance.delete(`/customer/${id}`)
    return response.data
  },
}