import { request } from "./request";

const paymentService = {
  processPayment: (data) =>
    request("POST", "/api/payments/create-payment-link", data),
  postWebhook: (data) => request("POST", "/api/payments/webhook", data),
};

export default paymentService;

