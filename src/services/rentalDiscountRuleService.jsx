import { request } from "./request";

const rentalDiscountRuleService = {
  getAllRules: (params) => request("GET", "/api/rental-discount-rules", null, {}, params),
  getRule: (id) => request("GET", `/api/rental-discount-rules/${id}`),
  createRule: (data) => request("POST", "/api/rental-discount-rules", data),
  updateRule: (id, data) => request("PUT", `/api/rental-discount-rules/${id}`, data),
  deleteRule: (id) => request("DELETE", `/api/rental-discount-rules/${id}`),
  calculateDiscount: (params) => request("GET", "/api/rental-discount-rules/calculate", null, {}, params),
};

export default rentalDiscountRuleService;
