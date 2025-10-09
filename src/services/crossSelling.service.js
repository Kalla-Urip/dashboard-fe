import axiosInstance from "../utils/axios"
import { parseFilenameFromDisposition } from "../utils/download"

export const crossSellingService = {
  getTireData: async (params = {}) => {
    const response = await axiosInstance.get('/cross-selling/tire', {
      params,
    })
    return response.data
  },
  getBatteraiData: async (params = {}) => {
    const response = await axiosInstance.get('/cross-selling/batterai', {
      params,
    })
    return response.data
  },
  getBodyRepairData: async (params = {}) => {
    const response = await axiosInstance.get('/cross-selling/body-repair', {
      params,
    })
    return response.data
  },
  followUp: async (id, body) => {
    const response = await axiosInstance.post(`/cross-selling/${id}/follow-up`, body)
    return response.data
  },
  delete: async (id) => {
    const response = await axiosInstance.delete(`/cross-selling/${id}`)
    return response.data
  },
  exportAllData: async (params = {}) => {
    const response = await axiosInstance.get(`/cross-selling/export`, { 
      params,
      responseType: 'blob'
    })
    const disposition = response.headers["content-disposition"];
    const filename = parseFilenameFromDisposition(disposition) || "cross-selling.xlsx";
    return { blob: response.data, filename };
  },
}