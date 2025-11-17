import axiosInstance from "../utils/axios"

export const tradeInService = {
  getStatistic: async (params = {}) => {
    const response = await axiosInstance.get('/trade/statistic', {
      params,
    })
    return response.data
  },
  getAssignData: async (params = {}) => {
    const response = await axiosInstance.get('/trade/need-assign-data', {
      params,
    })
    return response.data
  },
  getProgressData: async (params = {}) => {
    const response = await axiosInstance.get('/trade/progress', {
      params,
    })
    return response.data
  },
  getFinishData: async (params = {}) => {
    const response = await axiosInstance.get('/trade/finish', {
      params,
    })
    return response.data
  },
  getDataTrust: async (params = {}) => {
    const response = await axiosInstance.get('/trade/data-trust', {
      params,
    })
    return response.data
  },
  getDetailDataTrust: async (id) => {
    const response = await axiosInstance.get('/trade/data-trust/'+ id)
    return response.data
  },
  getProgressDataById: async (id) => {
    const response = await axiosInstance.get('/trade/progress/' + id)
    return response.data
  },
  getFinishDataById: async (id) => {
    const response = await axiosInstance.get('/trade/finish/' + id)
    return response.data
  },
  getById: async (id) => {
    const response = await axiosInstance.get('/trade/' + id)
    return response.data
  },
  getProfile: async () => {
    const response = await axiosInstance.get('/trade/profile')
    return response.data
  },
  store: async (data) => {
    const response = await axiosInstance.post('/trade', data)
    return response.data
  },
  assignSpv: async (data) => {
    const response = await axiosInstance.put(`/trade/${data.id}/assign-spv`, data)
    return response.data
  },
  assignTrust: async (data) => {
    const response = await axiosInstance.put(`/trade/${data.id}/assign-trust`, data)
    return response.data
  },
  assignSales: async (data) => {
    const response = await axiosInstance.put(`/trade/${data.id}/assign-sales`, data)
    return response.data
  },
  changePassword: async (data) => {
    const response = await axiosInstance.post('/trade/change-password', data)
    return response.data
  },
  update: async (data) => {
    const response = await axiosInstance.put(`/trade/${data.id}`, data)
    return response.data
  },
  delete: async (id) => {
    const response = await axiosInstance.delete(`/trade/${id}`)
    return response.data
  },
}