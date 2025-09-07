import axios from "axios";
import { AI_BASE_URL } from "../config/api.config";

export const aiService = {
  salesInsight: async () => {
    const response = await axios({
      method: 'GET',
      url: `${AI_BASE_URL}/insight/sales`,
    });
    return response.data
  },
}