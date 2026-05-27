import { request } from "./request";

const productService = {
  getAllProducts: (params) => request("GET", "/api/products", null, {}, params),
  getProducts: (id) => request("GET", `/api/products/${id}`),
  createProduct: (productData) => request("POST", "/api/products", productData),
  updateProduct: (productId, productData) =>
    request("PUT", `/api/products/${productId}`, productData),
  deleteProduct: (productId) => request("DELETE", `/api/products/${productId}`),
  searchProducts: (query) =>
    request("GET", `/api/products?searchTerm=${encodeURIComponent(query)}`),
};

export default productService;

