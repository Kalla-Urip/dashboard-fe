import axiosInstance from "../utils/axios"

export const customerRating = {
  fetchALl: async (params = {}) => {
    const response = await axiosInstance.get('/customer-rating/paginate', {
      params,
    })
    return response.data
  }
}