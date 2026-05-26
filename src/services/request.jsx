import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log("API_BASE_URL:", API_BASE_URL);
import Cookies from "js-cookie";
const request = async (method, url, data = null, headers = {}, params = {}) => {
  try {
    const token = Cookies.get("token");
    console.log("token:", token);
    const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axios({
      method,
      url: `${API_BASE_URL}${url}`,
      data,
      headers: {
        ...headers,
        ...authHeaders,
      },
      params,
    });

    return response;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export { request };
