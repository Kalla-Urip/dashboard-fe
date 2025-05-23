import axiosInstance from "../utils/axios"
// import { handleApiError } from "../utils/errorHandler"

export const userService = {
  fetchAll: async (params = {}) => {
    const response = await axiosInstance.get('/user/paginate', {
      params,
    })
    return response.data
  },
  getSpvTrust: async (params = {}) => {
    const response = await axiosInstance.get('/user/spv-trust', {
      params,
    })
    return response.data
  },
  getTrust: async (params = {}) => {
    const response = await axiosInstance.get('/user/trust', {
      params,
    })
    return response.data
  },
  getSpvSales: async (params = {}) => {
    const response = await axiosInstance.get('/user/spv-sales', {
      params,
    })
    return response.data
  },
  getSales: async (params = {}) => {
    const response = await axiosInstance.get('/user/sales', {
      params,
    })
    return response.data
  },
  getById: async (id) => {
    const response = await axiosInstance.get('/user/' + id)
    return response.data
  },
  getProfile: async () => {
    const response = await axiosInstance.get('/user/profile')
    return response.data
  },
  store: async (data) => {
    const response = await axiosInstance.post('/user', data)
    return response.data
  },
  changePassword: async (data) => {
    const response = await axiosInstance.post('/user/change-password', data)
    return response.data
  },
  update: async (data) => {
    const response = await axiosInstance.put(`/user/${data.id}`, data)
    return response.data
  },
  delete: async (id) => {
    const response = await axiosInstance.delete(`/user/${id}`)
    return response.data
  },
}