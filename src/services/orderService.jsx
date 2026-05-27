import { request } from "./request";

const orderService = {
  getOrders: () => request("GET", "/api/orders"),
  getMyOrders: () => request("GET", "/api/orders/my-orders"),
};

export default orderService;
