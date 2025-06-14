import axiosInstance from "../utils/axios"

export const customerRelationshipService = {
  getBirthDayCustomer: async (params = {}) => {
    const response = await axiosInstance.get('/customer-relationship/birthday', {
      params,
    })
    return response.data
  },
  followUpBirthDayCustomer: async (id) => {
    const response = await axiosInstance.post('/customer-relationship/birthday/'+id)
    return response.data
  }
}