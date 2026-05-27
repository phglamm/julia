import { request } from "./request";

const authService = {
  login: (loginData) => request("POST", "/api/auth/login", loginData),
  register: (registerData) =>
    request("POST", "/api/auth/register", registerData),
};

export default authService;

