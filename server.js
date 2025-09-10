// Node 최신 스타일(ESM) → import 문법으로 라이브러리를 불러옴
import express from "express";    // Express: Node.js에서 가장 많이 쓰이는 서버 프레임워크
import cors from "cors";          // CORS 허용 미들웨어 (다른 도메인에서 요청 가능하게)
import path from "path";
import { fileURLToPath } from "url"; // __dirname 대체용 (ESM에서는 기본 제공 안 함)

// __dirname이 ESM에서는 없기 때문에 직접 계산해서 만듦
const __filename = fileURLToPath(import.meta.url); // 현재 파일의 절대경로
const __dirname = path.dirname(__filename);        // 현재 파일이 있는 디렉토리 경로

const app = express(); // app 객체가 서버의 본체
app.use(cors());       // 모든 요청에 대해 CORS 허용
app.use(express.json());// 요청 본문(body)이 JSON이면 자동으로 파싱

// ---------- 정적 파일(index.html 등) 서빙 ----------
// __dirname 폴더(=서버 실행 위치) 안에 있는 index.html, index.js 같은 파일을 브라우저에 그대로 제공
app.use(express.static(__dirname)); 

// ---------- Mock DB (임시 데이터 저장) ----------
// 서버 껐다 켜면 모두 날아감 (나중에 Firebase나 DB 붙이면 됨)
let scores = []; // 게임 점수 저장 [{ userId, score, date }]
let items = [    // 게임 내 상점 아이템 목록
  { itemId: "hat01", name: "기니 모자", price: 100, type: "hat" },
  { itemId: "ribbon01", name: "리본",   price:  80, type: "ribbon" }
];
let userItems = {};           // 유저별 보유 아이템 { userId: [ { itemId, type, isEquipped, acquiredAt } ] }
let wallets   = { user1: 200 }; // 유저별 화폐 잔액 (게임 머니: hay)

// ---------- 헬스체크 (서버 살아있는지 확인) ----------
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, msg: "GuineaRun API 서버 살아잇음~" });
});

// ---------- Score API ----------
// 점수 저장
app.post("/score/save", (req, res) => {
  const { userId, score } = req.body || {};
  // userId 없거나 점수가 숫자가 아니면 오류
  if (!userId || typeof score !== "number") {
    return res.status(400).json({ ok: false, error: "bad params" });
  }
  // 점수 목록에 저장
  scores.push({ userId, score, date: new Date().toISOString() });
  return res.json({ ok: true });
});

// 점수 랭킹 조회
app.get("/score/rank", (req, res) => {
  const limit = Number(req.query.limit ?? 10); // ?limit=값 없으면 기본 10
  const best = {};
  // 각 유저의 최고 점수만 뽑음
  for (const s of scores) best[s.userId] = Math.max(best[s.userId] ?? 0, s.score ?? 0);
  // [{userId, bestScore}] 형태로 변환하고 점수순 정렬
  const ranks = Object.entries(best)
    .map(([userId, bestScore]) => ({ userId, bestScore }))
    .sort((a, b) => b.bestScore - a.bestScore)
    .slice(0, limit); // 상위 limit명만
  return res.json({ ok: true, ranks });
});

// ---------- ITEM API ----------
// 아이템 목록 조회
app.get("/item/list", (_req, res) => {
  res.json({ ok: true, items });
});

// 아이템 구매
app.post("/item/buy", (req, res) => {
  const { userId, itemId } = req.body || {};
  const item = items.find(i => i.itemId === itemId);
  // 유저ID 없거나 아이템 못 찾으면 에러
  if (!userId || !item) return res.status(400).json({ ok: false, error: "bad params" });

  const cur = wallets[userId] ?? 0; // 현재 잔액
  if (cur < item.price) return res.json({ ok: false, error: "not enough hay" }); // 돈 부족

  // 잔액 차감
  wallets[userId] = cur - item.price;
  // 유저 인벤토리 없으면 생성
  if (!userItems[userId]) userItems[userId] = [];
  // 새 아이템 추가
  userItems[userId].push({
    itemId: item.itemId,
    type: item.type,
    isEquipped: false,
    acquiredAt: new Date().toISOString()
  });
  res.json({ ok: true, newHay: wallets[userId] }); // 새 잔액 반환
});

// 아이템 장착/해제
app.post("/item/equip", (req, res) => {
  const { userId, itemId, equip } = req.body || {};
  // 잘못된 요청 체크
  if (!userId || !itemId || typeof equip !== "boolean") {
    return res.status(400).json({ ok: false, error: "bad params" });
  }
  const list = userItems[userId] ?? [];          // 유저 보유 아이템
  const meta = items.find(i => i.itemId === itemId); // 아이템 메타정보
  if (!meta) return res.status(404).json({ ok: false, error: "no item meta" });

  // 같은 타입의 아이템은 하나만 착용 가능 → 모두 해제
  for (const it of list) if (it.type === meta.type) it.isEquipped = false;

  // 해당 아이템 찾아서 장착/해제
  const target = list.find(i => i.itemId === itemId);
  if (!target) return res.status(404).json({ ok: false, error: "not owned" });
  target.isEquipped = !!equip;

  res.json({ ok: true });
});

// ---------- API ----------
// 유저 인벤토리 확인하기
app.get("/user/inventory", (req, res) => {
  const userId = req.query.userId;
  const list = userItems[userId] ?? [];
  res.json({ ok: true, inventory: list });
});

// 유저 잔액 확인하기
app.get("/wallet/balance", (req, res) => {
  const userId = req.query.userId;
  const hay = wallets[userId] ?? 0;
  res.json({ ok: true, hay });
});

// ---------- SPA 라우팅 지원 ----------
// 위에 정의한 API가 아닌 다른 URL로 접근하면
// index.html을 내려줌 (→ React/Vue 같은 싱글페이지 앱에서 유용)
app.get(/^(?!\/(score|item|api|user|wallet)\b).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ---------- 서버 시작 ----------
const PORT = process.env.PORT || 3000; // 환경변수 PORT 있으면 그 값, 없으면 3000번 포트
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}에서 서버 열림!`);
});