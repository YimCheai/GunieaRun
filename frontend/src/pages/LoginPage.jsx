import React, { useState } from "react";
import styles from "../styles/Login.module.css";
import eyeonImg from "../assets/images/eye-on.png";
import eyeoffImg from "../assets/images/eye-off.png";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../firebase/firebaseConfig"
import styles from "../styles/Login.module.css"

function Login() {
  const [form, setForm] = useState({ email: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await signInWithEmailAndPassword(auth, form.email, form.password)
      alert("로그인 성공!")
      navigate("/home") // 로그인 후 홈 또는 게임 화면으로 이동
    } catch (error) {
      console.error(error)
      alert("이메일 또는 비밀번호가 올바르지 않습니다")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form className={styles.signupContainer} onSubmit={handleSubmit}>
      <h2 className={styles.title}>로그인</h2>

      <div className={styles.inputGroupBox}>
        <div className={styles.inputLine}>
          <input
            type="email"
            name="email"
            placeholder="이메일"
            value={form.email}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>

        <div className={styles.inputLine}>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="비밀번호"
            value={form.password}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{ cursor: "pointer" }}
          >
            👁️
          </span>
        </div>
      </div>

      <button className={styles.signupButton} type="submit" disabled={isLoading}>
        {isLoading ? "로그인 중..." : "로그인"}
      </button>

      <div className={styles.loginPrompt}>
        아직 회원이 아니신가요?{" "}
        <span onClick={() => navigate("/signup")}>회원가입</span>
      </div>
    </form>
  )
}

export default Login
