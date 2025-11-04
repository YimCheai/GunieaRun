import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import personImg from "../assets/images/person.png";
import lockImg from "../assets/images/lock.png";
<<<<<<< HEAD
import eyeonImg from "../assets/images/eyeon.png";
import eyeoffImg from "../assets/images/eyeoff.png";
import mailImg from "../assets/images/mail.png";
import logoImg from "../assets/images/login_logo.png";
=======
import eyeonImg from "../assets/images/eyes-on.png";
import eyeoffImg from "../assets/images/eyes-off.png";
import mailImg from "../assets/images/mail.png";
import logoImg from "../assets/images/logo.png";
>>>>>>> origin/main

export default function SignUp() {
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

  const goToLogin = () => navigate("/login");

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-white font-[Pretendard]">
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <img src={logoImg} alt="logo" className="w-[200px]" />
        <div className="text-[45px] font-semibold mt-[42px] mb-[27px]">회원가입</div>
        <div className="flex text-[24px] text-[#757575] mb-[50px]">
          이미 회원이신가요?
          <span onClick={goToLogin} className="ml-[28px] font-bold text-black cursor-pointer">
            로그인
          </span>
        </div>

        <div className="w-[680px] h-[243px] border border-[#d9d9d9] rounded-[25px] flex flex-col overflow-hidden">
          <div className="flex flex-1 items-center px-[20px] text-[22px] border-b border-[#d9d9d9]">
            <img src={personImg} className="w-[32px] h-[32px] mr-[16px] opacity-70" />
            <input
              type="text"
              name="id"
              placeholder="아이디"
              value={form.id}
              onChange={handleChange}
              className="flex-1 text-[22px] outline-none"
              required
            />
          </div>

          <div className="flex flex-1 items-center px-[20px] text-[22px] border-b border-[#d9d9d9]">
            <img src={lockImg} className="w-[32px] h-[32px] mr-[16px] opacity-70" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="비밀번호"
              value={form.password}
              onChange={handleChange}
              className="flex-1 text-[22px] outline-none"
              required
            />
            <img
              src={showPassword ? eyeonImg : eyeoffImg}
              onClick={() => setShowPassword(!showPassword)}
              className="w-[32px] h-[32px] cursor-pointer"
            />
          </div>

          <div className="flex flex-1 items-center px-[20px] text-[22px]">
            <img src={mailImg} className="w-[32px] h-[32px] mr-[16px] opacity-70" />
            <input
              type="email"
              name="email"
              placeholder="이메일 주소"
              value={form.email}
              onChange={handleChange}
              className="flex-1 text-[22px] outline-none"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-[680px] h-[88px] bg-black rounded-[25px] flex justify-center items-center mt-[80px] text-white text-[32px] font-semibold cursor-pointer"
        >
          회원가입
        </button>

        {(emailError || passwordError) && (
          <div className="mt-4 text-red-500 text-[20px]">
            {emailError || passwordError}
          </div>
        )}
      </form>
    </div>
  );
}
