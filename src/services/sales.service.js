import axiosInstance from "../utils/axios"

export const salesService = {
  fetchAll: async (params = {}) => {
    const response = await axiosInstance.get('/sales/paginate', {
      params,
    })
    return response.data
  },
  getById: async (id) => {
    const response = await axiosInstance.get('/sales/' + id)
    return response.data
  },
  import: async (file) => {
    const response = await axiosInstance.postForm('/sales/import', { file })
    return response.data
  },
}