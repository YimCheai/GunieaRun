export const UserAPI = {
  register: ({ userId, nickname }, token) =>
    request("/user/register", { method: "POST", body: { userId, nickname }, token }),
  info: ({ userId }, token) =>
    request(`/user/info?userId=${encodeURIComponent(userId)}`, { token }),
  inventory: ({ userId }, token) =>
    request(`/user/inventory?userId=${encodeURIComponent(userId)}`, { token }),
  health: () => request("/api/health"),
};