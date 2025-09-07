import axiosInstance from "../utils/axios"
// import { handleApiError } from "../utils/errorHandler"

export const vehicleModelService = {
  fetchAll: async (params = {}) => {
    const response = await axiosInstance.get('/vehicle-model/paginate', {
      params,
    })
    return response.data
  },
  fetchWithoutPaginate: async () => {
    const response = await axiosInstance.get('/vehicle-model/')
    return response.data
  },
  getById: async (id) => {
    const response = await axiosInstance.get('/vehicle-model/' + id)
    return response.data
  },
  store: async (data) => {
    const response = await axiosInstance.post('/vehicle-model', data)
    return response.data
  },
  update: async (data) => {
    const response = await axiosInstance.put(`/vehicle-model/${data.id}`, data)
    return response.data
  },
  delete: async (id) => {
    const response = await axiosInstance.delete(`/vehicle-model/${id}`)
    return response.data
  },
}