import axiosInstance from "../utils/axios"

export const trustService = {
  fetchAll: async (params = {}) => {
    const response = await axiosInstance.get('/trust/paginate', {
      params,
    })
    return response.data
  },
  getById: async (id) => {
    const response = await axiosInstance.get('/trust/' + id)
    return response.data
  },
}