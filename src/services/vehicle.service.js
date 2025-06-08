import axiosInstance from "../utils/axios"
// import { handleApiError } from "../utils/errorHandler"

export const vehicleService = {
  fetchAll: async (params = {}) => {
    const response = await axiosInstance.get('/vehicle/paginate', {
      params,
    })
    return response.data
  },
  getById: async (params = {}, id) => {
    const response = await axiosInstance.get(`/vehicle/${id}/service-history/`,{
      params
    })
    return response.data
  },
  getServiceDetail: async (id) => {
    const response = await axiosInstance.get('/vehicle/service-detail/' + id)
    return response.data
  },
  store: async (data) => {
    const response = await axiosInstance.post('/vehicle', data)
    return response.data
  },
  update: async (data) => {
    const response = await axiosInstance.put(`/vehicle/${data.id}`, data)
    return response.data
  },
  delete: async (id) => {
    const response = await axiosInstance.delete(`/vehicle/${id}`)
    return response.data
  },
}