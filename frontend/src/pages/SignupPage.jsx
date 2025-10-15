// SignUp.jsx
import React, { useState } from "react";
import styles from "../styles/SignUp.module.css";
import lockImg from "../assets/images/lock.png";
import eyeonImg from "../assets/images/eye-on.png";
import eyeoffImg from "../assets/images/eye-off.png";
import mailImg from "../assets/images/mail.png";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig"

function SignUp() {
  const [form, setForm] = useState({ password: "", email: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "password") {
      if (value.length < 8 || value.length >= 50) {
        setPasswordError("비밀번호는 8자 이상 50자 미만이어야 합니다");
      } else {
        setPasswordError("");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password.length < 8 || form.password.length >= 50) {
      setPasswordError("비밀번호는 8자 이상 50자 미만이어야 합니다");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, form.email, form.password);
      alert("회원가입 완료!");
      navigate("/login");
    } catch (error) {
      console.error("회원가입 오류:", error);
      if (error.code === "auth/email-already-in-use") {
        setEmailError("이미 사용 중인 이메일입니다");
      } else if (error.code === "auth/invalid-email") {
        setEmailError("유효하지 않은 이메일 주소입니다");
      } else if (error.code === "auth/weak-password") {
        setPasswordError("비밀번호가 너무 약합니다");
      } else {
        setEmailError("회원가입 중 오류가 발생했습니다");
      }
    }
  };

  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <form className={styles.signupContainer} onSubmit={handleSubmit}>
      <h2 className={styles.title}>회원가입</h2>

      <div className={styles.inputGroupBox}>
        <div className={styles.inputLine}>
          <img src={mailImg} alt="이메일" />
          <input
            type="email"
            name="email"
            placeholder="이메일 주소"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.inputLine}>
          <img src={lockImg} alt="비밀번호" />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="비밀번호"
            value={form.password}
            onChange={handleChange}
            required
          />
          <img
            src={showPassword ? eyeoffImg : eyeonImg}
            alt="비밀번호 보기"
            className={styles.eyeToggle}
            onClick={() => setShowPassword(!showPassword)}
          />
        </div>
      </div>

      <button className={styles.signupButton} type="submit">
        회원가입
      </button>

      <div className={styles.errorGroup}>
        {emailError && <div className={styles.errorMessage}>{emailError}</div>}
        {passwordError && (
          <div className={styles.errorMessage}>{passwordError}</div>
        )}
      </div>

      <div className={styles.loginPrompt}>
        이미 회원이신가요? <span onClick={goToLogin}>로그인</span>
      </div>
    </form>
  );
}

export default SignUp;
