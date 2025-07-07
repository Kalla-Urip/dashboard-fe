import axiosInstance from "../utils/axios"

export const dashboardService = {
  getMonthlySummary: async (params = {}) => {
    const response = await axiosInstance.get('/dashboard/summary/monthly', {
      params,
    })
    return response.data
  },
  getTodaySummary: async (params = {}) => {
    const response = await axiosInstance.get('/dashboard/summary/today', {
      params,
    })
    return response.data
  },
  getTopSales: async (params = {}) => {
    const response = await axiosInstance.get('/dashboard/top-sales', {
      params,
    })
    return response.data
  },
}