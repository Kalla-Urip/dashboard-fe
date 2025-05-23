import axiosInstance from "../utils/axios"

export const crossSellingService = {
  getTireData: async (params = {}) => {
    const response = await axiosInstance.get('/cross-selling/tire', {
      params,
    })
    return response.data
  },
  getBatteraiData: async (params = {}) => {
    const response = await axiosInstance.get('/cross-selling/batterai', {
      params,
    })
    return response.data
  },
  getBodyRepairData: async (params = {}) => {
    const response = await axiosInstance.get('/cross-selling/body-repair', {
      params,
    })
    return response.data
  },
  followUp: async (id) => {
    const response = await axiosInstance.post(`/cross-selling/${id}/follow-up`)
    return response.data
  }
}