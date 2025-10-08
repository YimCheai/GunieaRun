// server.js (ESM)
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// 정적 파일(index.html, index.js) 서빙
app.use(express.static(__dirname));

// ---------------- Mock DB ----------------
let scores = []; // { userId, score, date }
let items = [
  { itemId: "hat01", name: "기니 모자", price: 100, type: "hat" },
  { itemId: "ribbon01", name: "리본",   price:  80, type: "ribbon" }
];
let userItems = {};          // { [userId]: [{ itemId, type, isEquipped, acquiredAt }] }
let wallets   = { user1: 200 }; // { [userId]: hay }

// ---------------- Health ----------------
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, msg: "GuineaRun API server running" });
});

// ---------------- SCORE ----------------
app.post("/score/save", (req, res) => {
  const { userId, score } = req.body || {};
  if (!userId || typeof score !== "number") {
    return res.status(400).json({ ok: false, error: "bad params" });
  }
  scores.push({ userId, score, date: new Date().toISOString() });
  return res.json({ ok: true });
});

app.get("/score/rank", (req, res) => {
  const limit = Number(req.query.limit ?? 10);
  const best = {};
  for (const s of scores) best[s.userId] = Math.max(best[s.userId] ?? 0, s.score ?? 0);
  const ranks = Object.entries(best)
    .map(([userId, bestScore]) => ({ userId, bestScore }))
    .sort((a, b) => b.bestScore - a.bestScore)
    .slice(0, limit);
  return res.json({ ok: true, ranks });
});

// ---------------- ITEM ----------------
app.get("/item/list", (_req, res) => {
  res.json({ ok: true, items });
});

app.post("/item/buy", (req, res) => {
  const { userId, itemId } = req.body || {};
  const item = items.find(i => i.itemId === itemId);
  if (!userId || !item) return res.status(400).json({ ok: false, error: "bad params" });

  const cur = wallets[userId] ?? 0;
  if (cur < item.price) return res.json({ ok: false, error: "not enough hay" });

  wallets[userId] = cur - item.price;
  if (!userItems[userId]) userItems[userId] = [];
  userItems[userId].push({
    itemId: item.itemId,
    type: item.type,
    isEquipped: false,
    acquiredAt: new Date().toISOString()
  });
  res.json({ ok: true, newHay: wallets[userId] });
});

app.post("/item/equip", (req, res) => {
  const { userId, itemId, equip } = req.body || {};
  if (!userId || !itemId || typeof equip !== "boolean") {
    return res.status(400).json({ ok: false, error: "bad params" });
  }
  const list = userItems[userId] ?? [];
  const meta = items.find(i => i.itemId === itemId);
  if (!meta) return res.status(404).json({ ok: false, error: "no item meta" });

  // 동일 타입 모두 해제
  for (const it of list) if (it.type === meta.type) it.isEquipped = false;

  // 대상 찾아 equip 적용
  const target = list.find(i => i.itemId === itemId);
  if (!target) return res.status(404).json({ ok: false, error: "not owned" });
  target.isEquipped = !!equip;

  res.json({ ok: true });
});

// ---------------- 유틸 ----------------
app.get("/user/inventory", (req, res) => {
  const userId = req.query.userId;
  const list = userItems[userId] ?? [];
  res.json({ ok: true, inventory: list });
});

app.get("/wallet/balance", (req, res) => {
  const userId = req.query.userId;
  const hay = wallets[userId] ?? 0;
  res.json({ ok: true, hay });
});

// ---------------- SPA 라우팅(Express v5 안전 버전) ----------------
// API 경로를 제외한 나머지는 index.html로
app.get(/^(?!\/(score|item|api|user|wallet)\b).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ---------------- RUN ----------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});