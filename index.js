import express from "express";
import cors from "cors";
import admin from "firebase-admin";
import { readFileSync } from "fs";

// 🔑 Firebase 서비스 계정 키 JSON 파일 불러오기
const serviceAccount = JSON.parse(readFileSync("./serviceAccountKey.json", "utf8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const app = express();
app.use(cors());
app.use(express.json());

// =====================
// 1️⃣ 테스트용 라우트
// =====================
app.get("/", (req, res) => {
  res.send("GuineaRun API is running!");
});

// =====================
// 2️⃣ 토큰 검증 미들웨어
// =====================
async function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1]; // "Bearer <ID_TOKEN>"

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // UID, 이메일 등 저장
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
}

// =====================
// 3️⃣ 로그인한 사용자 정보 조회 API
// =====================
app.get("/users/me", authenticateToken, async (req, res) => {
  try {
    const userRecord = await admin.auth().getUser(req.user.uid);
    res.json({
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName
    });
  } catch (error) {
    res.status(404).json({ error: "User not found" });
  }
});

// =====================
// 4️⃣ 서버 실행
// =====================
app.listen(3000, () => {
  console.log("✅ Server started on http://localhost:3000");
});
