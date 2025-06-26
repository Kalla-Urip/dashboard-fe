import axiosInstance from "../utils/axios"
// import { handleApiError } from "../utils/errorHandler"

export const testDriveVehicleService = {
  fetchAll: async (params = {}) => {
    const response = await axiosInstance.get('/test-drive-vehicle/paginate', {
      params,
    })
    return response.data
  },
  getById: async (id) => {
    const response = await axiosInstance.get('/test-drive-vehicle/' + id)
    return response.data
  },
  store: async (data) => {
    const response = await axiosInstance.post('/test-drive-vehicle', data)
    return response.data
  },
  update: async (data) => {
    const response = await axiosInstance.put(`/test-drive-vehicle/${data.id}`, data)
    return response.data
  },
  delete: async (id) => {
    const response = await axiosInstance.delete(`/test-drive-vehicle/${id}`)
    return response.data
  },
}