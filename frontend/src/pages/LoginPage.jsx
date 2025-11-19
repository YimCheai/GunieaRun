import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import styles from "../styles/Auth.module.css";

import logoImg from "../assets/images/logo.png";
import mailImg from "../assets/images/mail.png";
import lockImg from "../assets/images/lock.png";
import eyeonImg from "../assets/images/eyes-on.png";
import eyeoffImg from "../assets/images/eyes-off.png";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      alert("로그인 성공!");
      navigate("/home");
    } catch {
      alert("이메일 또는 비밀번호가 올바르지 않습니다");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className={styles.authContainer} onSubmit={handleSubmit}>
      <img src={logoImg} alt="logo" className={styles.logo} />
      <div className={styles.title}>로그인</div>

      <div className={styles.prompt}>
        이미 회원이 아니신가요?
        <span onClick={() => navigate("/signup")}>회원가입</span>
      </div>

      <div className={styles.inputGroupBox}>
        <div className={styles.inputLine}>
          <img src={mailImg} alt="mail" />
          <input
            type="email"
            name="email"
            placeholder="이메일주소"
            value={form.email}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>

        <div className={styles.inputLine}>
          <img src={lockImg} alt="lock" />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="비밀번호"
            value={form.password}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
          <img
            src={showPassword ? eyeonImg : eyeoffImg}
            alt="toggle"
            onClick={() => setShowPassword(!showPassword)}
            style={{ cursor: "pointer" }}
          />
        </div>
      </div>

      <button className={styles.authButton} type="submit" disabled={isLoading}>
        {isLoading ? "로그인 중..." : "로그인"}
      </button>
    </form>
  );
}
