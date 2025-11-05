import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../firebase/firebaseConfig"

// ✅ 이미지 import
import personImg from "../assets/images/person.png"
import lockImg from "../assets/images/lock.png"
import eyeonImg from "../assets/images/eyes-on.png"
import eyeoffImg from "../assets/images/eyes-off.png"
import mailImg from "../assets/images/mail.png"
import logoImg from "../assets/images/logo.png"

function Login() {
  const [form, setForm] = useState({ email: "", password: "" })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await signInWithEmailAndPassword(auth, form.email, form.password)
      alert("로그인 성공!")
      
      // ✅ 로그인 완료 시 Waiting 화면으로 이동
      navigate("/waiting")
    } catch (err) {
      alert("이메일 또는 비밀번호가 올바르지 않습니다")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.wrapper}>
      <form style={styles.container} onSubmit={handleSubmit}>
        <img src={logoImg} alt="logo" style={styles.logo} />

        <div style={styles.loginTitle}>로그인</div>

        <div style={styles.signupText}>
          아직 회원이 아니신가요?
          <span style={styles.signupBtn} onClick={() => navigate("/signup")}>
            회원가입
          </span>
        </div>

        <div style={styles.inputBox}>
          <div style={styles.inputRow}>
            <img src={mailImg} alt="email" style={styles.icon} />
            <input
              type="email"
              name="email"
              placeholder="이메일"
              value={form.email}
              onChange={handleChange}
              required
              disabled={loading}
              style={styles.input}
            />
          </div>

          <div style={{ ...styles.inputRow, borderTop: "1px solid #d9d9d9" }}>
            <img src={lockImg} alt="pw" style={styles.icon} />

            <input
              type={showPw ? "text" : "password"}
              name="password"
              placeholder="비밀번호"
              value={form.password}
              onChange={handleChange}
              required
              disabled={loading}
              style={styles.input}
            />

            <img
              src={showPw ? eyeonImg : eyeoffImg}
              alt="toggle"
              onClick={() => setShowPw(!showPw)}
              style={{ width: 32, height: 32, cursor: "pointer" }}
            />
          </div>
        </div>

        <button type="submit" style={styles.loginButton}>
          {loading ? "로그인 중..." : "로그인"}
        </button>
      </form>
    </div>
  )
}

// ✅ 스타일
const styles = {
  wrapper: {
    margin: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  logo: {
    width: 200,
    height: "auto"
  },
  loginTitle: {
    fontFamily: "Pretendard, sans-serif",
    fontWeight: 600,
    fontSize: 45,
    marginTop: 42,
    marginBottom: 27
  },
  signupText: {
    display: "flex",
    alignItems: "center",
    fontFamily: "Pretendard, sans-serif",
    fontSize: 24,
    color: "#757575",
    marginBottom: 50
  },
  signupBtn: {
    marginLeft: 28,
    fontWeight: 700,
    color: "#F482BD",
    cursor: "pointer"
  },
  inputBox: {
    width: 680,
    height: 162,
    border: "1px solid #d9d9d9",
    borderRadius: 25,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden"
  },
  inputRow: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    padding: "0 20px"
  },
  icon: {
    width: 32,
    height: 32,
    opacity: 0.7,
    marginRight: 16
  },
  input: {
    flex: 1,
    border: "none",
    outline: "none",
    fontFamily: "Pretendard, sans-serif",
    fontSize: 22
  },
  loginButton: {
    width: 680,
    height: 88,
    marginTop: 141,
    backgroundColor: "#F482BD",
    color: "#fff",
    borderRadius: 25,
    fontFamily: "Pretendard, sans-serif",
    fontWeight: 600,
    fontSize: 32,
    cursor: "pointer",
    border: "none"
  }
}

export default Login