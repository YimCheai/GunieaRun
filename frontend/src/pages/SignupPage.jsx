import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

import personImg from "../assets/images/person.png";
import lockImg from "../assets/images/lock.png";
import eyeonImg from "../assets/images/eyes-on.png";   // ✅ 수정
import eyeoffImg from "../assets/images/eyes-off.png"; // ✅ 수정
import mailImg from "../assets/images/mail.png";
import logoImg from "../assets/images/logo.png";

export default function SignupPage() {
  const [form, setForm] = useState({ id: "", password: "", email: "" });
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

  return (
    <div
      style={{
        margin: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "#fff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Pretendard', sans-serif",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <img src={logoImg} alt="logo" style={{ width: "200px" }} />

        <div style={{ fontWeight: 600, fontSize: "45px", marginTop: "42px", marginBottom: "27px" }}>
          회원가입
        </div>

        <div style={{ display: "flex", fontSize: "24px", color: "#757575", marginBottom: "50px" }}>
          이미 회원이신가요?
          <span
            onClick={() => navigate("/login")}
            style={{ marginLeft: "28px", fontWeight: 700, color: "#F482BD", cursor: "pointer" }}
          >
            로그인
          </span>
        </div>

        <div
          style={{
            width: "680px",
            height: "243px",
            border: "1px solid #d9d9d9",
            borderRadius: "25px",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* 아이디 */}
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              padding: "0 20px",
              borderBottom: "1px solid #d9d9d9",
            }}
          >
            <img src={personImg} alt="user" style={{ width: 32, height: 32, marginRight: 16, opacity: 0.7 }} />
            <input
              type="text"
              name="id"
              placeholder="아이디"
              value={form.id}
              onChange={handleChange}
              required
              style={{ border: "none", outline: "none", fontSize: "22px", flex: 1 }}
            />
          </div>

          {/* 비밀번호 */}
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              padding: "0 20px",
              borderBottom: "1px solid #d9d9d9",
            }}
          >
            <img src={lockImg} alt="lock" style={{ width: 32, height: 32, marginRight: 16, opacity: 0.7 }} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="비밀번호"
              value={form.password}
              onChange={handleChange}
              required
              style={{ border: "none", outline: "none", fontSize: "22px", flex: 1 }}
            />
            <img
              src={showPassword ? eyeonImg : eyeoffImg} // ✅ eyeon / eyeoff
              alt="toggle"
              onClick={() => setShowPassword(!showPassword)}
              style={{ width: 32, height: 32, cursor: "pointer" }}
            />
          </div>

          {/* 이메일 */}
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              padding: "0 20px",
            }}
          >
            <img src={mailImg} alt="mail" style={{ width: 32, height: 32, marginRight: 16, opacity: 0.7 }} />
            <input
              type="email"
              name="email"
              placeholder="이메일"
              value={form.email}
              onChange={handleChange}
              required
              style={{ border: "none", outline: "none", fontSize: "22px", flex: 1 }}
            />
          </div>
        </div>

        <button
          type="submit"
          style={{
            width: "680px",
            height: "88px",
            backgroundColor: "#F482BD",
            borderRadius: "25px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "80px",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "32px",
            color: "#fff",
            border: "none",
          }}
        >
          회원가입
        </button>

        {(emailError || passwordError) && (
          <div style={{ marginTop: "15px", color: "red", fontSize: "20px" }}>
            {emailError || passwordError}
          </div>
        )}
      </form>
    </div>
  );
}
