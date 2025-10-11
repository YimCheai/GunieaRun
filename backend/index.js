// index.js
import { UserAPI, ScoreAPI, ItemAPI, FRUIT_SCORES } from "../frontend/src/api/client.js";

const el = (id) => document.getElementById(id);
const show = (id, data) => (el(id).textContent = JSON.stringify(data, null, 2));

// Health
el("btn-health").addEventListener("click", async () => {
  const data = await UserAPI.health();
  show("out-health", data);
});

// User
el("btn-register").addEventListener("click", async () => {
  const userId = el("userId").value.trim();
  const nickname = el("nickname").value.trim();
  const data = await UserAPI.register({ userId, nickname });
  show("out-user", data);
});

el("btn-userinfo").addEventListener("click", async () => {
  const userId = el("userId").value.trim();
  const data = await UserAPI.info({ userId });
  show("out-user", data);
});

el("btn-inv").addEventListener("click", async () => {
  const userId = el("userId").value.trim();
  const data = await UserAPI.inventory({ userId });
  show("out-user", data);
});

// Score
el("btn-save").addEventListener("click", async () => {
  const userId = el("userId").value.trim();
  const base = Number(el("scoreVal").value) || 0;
  const score = base + FRUIT_SCORES.cherry; // 예: 체리 20점 가산
  const data = await ScoreAPI.save({ userId, score });
  show("out-score", data);
});

el("btn-rank").addEventListener("click", async () => {
  const data = await ScoreAPI.rank({ limit: 10 });
  show("out-score", data);
});

// Item
el("btn-list").addEventListener("click", async () => {
  const data = await ItemAPI.list();
  show("out-item", data);
});

el("btn-buy").addEventListener("click", async () => {
  const userId = el("userId").value.trim();
  const itemId = el("itemIdBuy").value.trim();
  const data = await ItemAPI.buy({ userId, itemId });
  show("out-item", data);
});

el("btn-equip").addEventListener("click", async () => {
  const userId = el("userId").value.trim();
  const itemId = el("itemIdBuy").value.trim();
  const data = await ItemAPI.equip({ userId, itemId, equip: true });
  show("out-item", data);
});
