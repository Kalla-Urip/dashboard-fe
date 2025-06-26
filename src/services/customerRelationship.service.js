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
  },
  getInstallmentDuedate: async (params = {}) => {
    const response = await axiosInstance.get('/customer-relationship/installment-duedate', {
      params,
    })
    return response.data
  },
  followUpInstallmentDuedate: async (id) => {
    const response = await axiosInstance.post('/customer-relationship/installment-duedate/'+id)
    return response.data
  },
  getServiceDueDate: async (params = {}) => {
    const response = await axiosInstance.get('/customer-relationship/service', {
      params,
    })
    return response.data
  },
  followUpServiceDuedate: async (id) => {
    const response = await axiosInstance.post('/customer-relationship/service/'+id)
    return response.data
  },
}