import { request } from "./request";

const brandService = {
  getAllBrands: (params) => request("GET", "/api/brands", null, {}, params),
  getBrand: (id) => request("GET", `/api/brands/${id}`),
  createBrand: (data) => request("POST", "/api/brands", data),
  updateBrand: (id, data) => request("PUT", `/api/brands/${id}`, data),
  deleteBrand: (id) => request("DELETE", `/api/brands/${id}`),
};

export default brandService;
