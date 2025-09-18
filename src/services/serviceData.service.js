import axiosInstance from "../utils/axios"

export const serviceDataService = {
  fetchAll: async (params = {}) => {
    const response = await axiosInstance.get('/service-data/paginate', {
      params,
    })
    return response.data
  },
  getDataForSa: async (params = {}) => {
    const response = await axiosInstance.get('/service-data/get-data-for-sa', {
      params,
    })
    return response.data
  },
  getById: async (id) => {
    const response = await axiosInstance.get('/service-data/' + id)
    return response.data
  },
  tradeIn: async (id) => {
    const response = await axiosInstance.post(`/service-data/tradein/${id}`)
    return response.data
  },
  update: async (data) => {
    const response = await axiosInstance.put(`/service-data/${data.id}`, data)
    return response.data
  },
  import: async (file) => {
    const response = await axiosInstance.postForm('/service-data/import', { file })
    return response.data
  },
}