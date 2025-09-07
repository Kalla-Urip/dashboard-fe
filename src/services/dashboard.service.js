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
  getStatisticCard: async (params = {}) => {
    const response = await axiosInstance.get('/dashboard/statistic-card', {
      params,
    })
    return response.data
  },
  getMonthlySalesPerYear: async (params = {}) => {
    const response = await axiosInstance.get('/dashboard/monthly-sales-peryear', {
      params,
    })
    return response.data
  },
  getTop5Sales: async (params = {}) => {
    const response = await axiosInstance.get('/dashboard/top-5-sales', {
      params,
    })
    return response.data
  },
  getTop5Model: async (params = {}) => {
    const response = await axiosInstance.get('/dashboard/top-5-model', {
      params,
    })
    return response.data
  },
  getTopRevenueBySales: async (params = {}) => {
    const response = await axiosInstance.get('/dashboard/top-revenue-by-sales', {
      params,
    })
    return response.data
  },
  getSalesDataByStatus: async (params = {}) => {
    const response = await axiosInstance.get('/dashboard/sales-data-by-status', {
      params,
    })
    return response.data
  },
  getSalesNameDataByStatus: async (params = {}) => {
    const response = await axiosInstance.get('/dashboard/sales-name-data-by-status', {
      params,
    })
    return response.data
  },
  getTrustDataByStatus: async (params = {}) => {
    const response = await axiosInstance.get('/dashboard/trust-data-by-status', {
      params,
    })
    return response.data
  },
  getTrustNameDataByStatus: async (params = {}) => {
    const response = await axiosInstance.get('/dashboard/trust-name-data-by-status', {
      params,
    })
    return response.data
  },
}