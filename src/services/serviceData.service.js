import axiosInstance from "../utils/axios"

export const serviceDataService = {
  fetchAll: async (params = {}) => {
    const response = await axiosInstance.get('/service-data/today', {
      params,
    })
    return response.data
  },
  getById: async (id) => {
    const response = await axiosInstance.get('/service-data/' + id)
    return response.data
  },
}