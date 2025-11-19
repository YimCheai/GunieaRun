import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import styles from "../styles/Auth.module.css";

import logoImg from "../assets/images/logo.png";
import personImg from "../assets/images/person.png";
import mailImg from "../assets/images/mail.png";
import lockImg from "../assets/images/lock.png";
import eyeonImg from "../assets/images/eyes-on.png";
import eyeoffImg from "../assets/images/eyes-off.png";

export default function SignUp() {
  const [form, setForm] = useState({ id: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 8 || form.password.length > 50) {
      setError("비밀번호는 8자 이상 50자 미만이어야 합니다");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, form.email, form.password);
      alert("회원가입 완료!");
      navigate("/login");
    } catch (err) {
      if (err.code === "auth/email-already-in-use")
        setError("이미 사용 중인 이메일입니다");
      else setError("회원가입 중 오류가 발생했습니다");
    }
  };

  return (
    <form className={styles.authContainer} onSubmit={handleSubmit}>
      <img src={logoImg} alt="logo" className={styles.logo} />
      <div className={styles.title}>회원가입</div>

      <div className={styles.prompt}>
        이미 회원이신가요?
        <span onClick={() => navigate("/login")}>로그인</span>
      </div>

      <div className={styles.inputGroupBox}>
        <div className={styles.inputLine}>
          <img src={personImg} alt="person" />
          <input
            type="text"
            name="id"
            placeholder="아이디"
            value={form.id}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.inputLine}>
          <img src={mailImg} alt="mail" />
          <input
            type="email"
            name="email"
            placeholder="이메일주소"
            value={form.email}
            onChange={handleChange}
            required
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
          />
          <img
            src={showPassword ? eyeonImg : eyeoffImg}
            alt="toggle"
            onClick={() => setShowPassword(!showPassword)}
            style={{ cursor: "pointer" }}
          />
        </div>
      </div>

      <button className={styles.authButton} type="submit">
        회원가입
      </button>

      {error && <div className={styles.errorText}>{error}</div>}
    </form>
  );
}
