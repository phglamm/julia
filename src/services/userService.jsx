import { request } from "./request";

const userService = {
  getProfile: () => request("GET", "/api/users/profile"),
  updateProfile: (profileData) =>
    request("PUT", "/api/users/profile", profileData),
};

export default userService;

