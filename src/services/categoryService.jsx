import { request } from "./request";

const categoryService = {
  getAllCategories: (params) => request("GET", "/api/categories", null, {}, params),
  getCategory: (id) => request("GET", `/api/categories/${id}`),
  createCategory: (data) => request("POST", "/api/categories", data),
  updateCategory: (id, data) => request("PUT", `/api/categories/${id}`, data),
  deleteCategory: (id) => request("DELETE", `/api/categories/${id}`),
};

export default categoryService;
