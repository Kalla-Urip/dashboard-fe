import axios from "axios"
import { API_BASE_URL } from "../config/api.config"

export const authService = {
  login: async body => {
    const { data } = await axios.post(`${API_BASE_URL}/auth/login`, body)
    return data
  }
}