// index.js (ESM in browser)
import { ScoreAPI, ItemAPI, UserAPI, FRUIT_SCORES } from "./src/api/client.js";

const el = (id) => document.getElementById(id);
const show = (id, data) => el(id).textContent = JSON.stringify(data, null, 2);

// Health
el("btn-health").addEventListener("click", async () => {
  const data = await UserAPI.health();
  show("out-health", data);
});

// Score
el("btn-save").addEventListener("click", async () => {
  const userId = el("userIdScore").value.trim();
  const score = Number(el("scoreVal").value) + FRUIT_SCORES.cherry; // 예시로 체리 가산
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
  const userId = el("userIdBuy").value.trim();
  const itemId = el("itemIdBuy").value.trim();
  const data = await ItemAPI.buy({ userId, itemId });
  show("out-item", data);
});

el("btn-equip").addEventListener("click", async () => {
  const userId = el("userIdEquip").value.trim();
  const itemId = el("itemIdEquip").value.trim();
  const data = await ItemAPI.equip({ userId, itemId, equip: true });
  show("out-item", data);
});

// User
el("btn-inv").addEventListener("click", async () => {
  const userId = el("userIdInv").value.trim();
  const data = await UserAPI.inventory({ userId });
  show("out-user", data);
});

el("btn-bal").addEventListener("click", async () => {
  const userId = el("userIdBal").value.trim();
  const data = await UserAPI.balance({ userId });
  show("out-user", data);
});
