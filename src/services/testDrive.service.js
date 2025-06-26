import axiosInstance from "../utils/axios"
// import { handleApiError } from "../utils/errorHandler"

export const testDriveService = {
  findAllRequest: async (params = {}) => {
    const response = await axiosInstance.get('/test-drive/paginate', {
      params,
    })
    return response.data
  },
  history: async (params = {}) => {
    const response = await axiosInstance.get('/test-drive/history', {
      params,
    })
    return response.data
  },
  requestDetail: async (id) => {
    const response = await axiosInstance.get('/test-drive/' + id)
    return response.data
  },
  changeStatus: async (id, body) => {
    const response = await axiosInstance.post(`/test-drive/${id}/change-status`, body)
    return response.data
  },
}