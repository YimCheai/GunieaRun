export const ScoreAPI = {
  save: ({ userId, score }, token) =>
    request("/score/save", { method: "POST", body: { userId, score }, token }),
  rank: ({ limit = 10 } = {}, token) =>
    request(`/score/rank?limit=${limit}`, { token }),
};