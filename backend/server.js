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

/* ===============================
 * Mock DB (메모리 저장소)
 * ===============================*/
let users = [];     // { userId, nickname, hay }
let scores = [];    // { userId, score, date }
let items = [
  { itemId: "hat01",    name: "기니 모자", price: 100, type: "hat" },
  { itemId: "ribbon01", name: "리본",     price:  80, type: "ribbon" },
  { itemId: "crown01",  name: "왕관",     price: 150, type: "hat" },
];
let userItems = {}; // { userId: [ { itemId, type, isEquipped } ] }

/* ===============================
 * USER API
 * ===============================*/
// 회원가입
app.post("/user/register", (req, res) => {
  const { userId, nickname } = req.body || {};
  if (!userId || !nickname) return res.status(400).json({ ok:false, error:"필수값 누락" });
  if (users.find(u => u.userId === userId)) return res.status(400).json({ ok:false, error:"이미 존재하는 유저" });

  const user = { userId, nickname, hay: 200 };
  users.push(user);
  return res.json({ ok:true, user });
});

// 유저 정보 조회
app.get("/user/info", (req, res) => {
  const { userId } = req.query;
  const user = users.find(u => u.userId === userId);
  if (!user) return res.status(404).json({ ok:false, error:"유저 없음" });
  res.json({ ok:true, user });
});

// 유저 인벤토리
app.get("/user/inventory", (req, res) => {
  const { userId } = req.query;
  res.json({ ok:true, inventory: userItems[userId] ?? [] });
});


 /* ===============================*/
// 점수 저장
app.post("/score/save", (req, res) => {
  const { userId, score } = req.body || {};
  if (!userId || typeof score !== "number") return res.status(400).json({ ok:false, error:"잘못된 요청" });

  scores.push({ userId, score, date: new Date().toISOString() });
  return res.json({ ok:true });
});

// 랭킹 조회 (유저별 최고점 Top N)
app.get("/score/rank", (req, res) => {
  const limit = Number(req.query.limit ?? 10);
  const best = {};
  for (const s of scores) best[s.userId] = Math.max(best[s.userId] ?? 0, s.score ?? 0);

  const ranks = Object.entries(best)
    .map(([userId, score]) => {
      const user = users.find(u => u.userId === userId);
      return { userId, nickname: user?.nickname ?? "Guest", score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  res.json({ ok:true, ranks });
});

 * ===============================*/
// 상점 아이템 목록
app.get("/item/list", (_req, res) => res.json({ ok:true, items }));

// 아이템 구매
app.post("/item/buy", (req, res) => {
  const { userId, itemId } = req.body || {};
  const user = users.find(u => u.userId === userId);
  const item = items.find(i => i.itemId === itemId);

  if (!user || !item) return res.status(400).json({ ok:false, error:"유저나 아이템 없음" });
  if (user.hay < item.price) return res.json({ ok:false, error:"잔액 부족" });

  user.hay -= item.price;
  if (!userItems[userId]) userItems[userId] = [];
  userItems[userId].push({ itemId: item.itemId, type: item.type, isEquipped: false });

  res.json({ ok:true, newHay: user.hay });
});

// 아이템 착용/해제 (동일 type은 1개만 착용)
app.post("/item/equip", (req, res) => {
  const { userId, itemId, equip } = req.body || {};
  if (!userId || !itemId || typeof equip !== "boolean") return res.status(400).json({ ok:false, error:"bad params" });

  const inv = userItems[userId] ?? [];
  const meta = items.find(i => i.itemId === itemId);
  if (!meta) return res.status(404).json({ ok:false, error:"아이템 없음" });

  for (const it of inv) if (it.type === meta.type) it.isEquipped = false;
  const target = inv.find(i => i.itemId === itemId);
  if (!target) return res.status(404).json({ ok:false, error:"소유하지 않은 아이템" });

  target.isEquipped = !!equip;
  res.json({ ok:true });
});

 /* ===============================*/
app.get("/api/health", (_req, res) => res.json({ ok:true, msg:"Server running" }));

// SPA 라우팅 (Express v5 대응): API 제외 나머지는 index.html
app.get(/^(?!\/(user|score|item|api)\b).*/, (_req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
