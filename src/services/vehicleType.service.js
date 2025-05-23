import axiosInstance from "../utils/axios"
// import { handleApiError } from "../utils/errorHandler"

export const vehicleTypeService = {
  fetchAll: async (params = {}) => {
    const response = await axiosInstance.get('/vehicle-type/paginate', {
      params,
    })
    return response.data
  },
  getById: async (id) => {
    const response = await axiosInstance.get('/vehicle-type/' + id)
    return response.data
  },
  store: async (data) => {
    const response = await axiosInstance.post('/vehicle-type', data)
    return response.data
  },
  update: async (data) => {
    const response = await axiosInstance.put(`/vehicle-type/${data.id}`, data)
    return response.data
  },
  delete: async (id) => {
    const response = await axiosInstance.delete(`/vehicle-type/${id}`)
    return response.data
  },
}