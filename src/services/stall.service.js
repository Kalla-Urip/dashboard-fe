import axiosInstance from "../utils/axios"
// import { handleApiError } from "../utils/errorHandler"

export const stallService = {
  fetchAll: async (params = {}) => {
    const response = await axiosInstance.get('/stall/paginate', {
      params,
    })
    return response.data
  },
  getById: async (id) => {
    const response = await axiosInstance.get('/stall/' + id)
    return response.data
  },
  store: async (data) => {
    const response = await axiosInstance.post('/stall', data)
    return response.data
  },
  update: async (data) => {
    const response = await axiosInstance.put(`/stall/${data.id}`, data)
    return response.data
  },
  delete: async (id) => {
    const response = await axiosInstance.delete(`/stall/${id}`)
    return response.data
  },
}