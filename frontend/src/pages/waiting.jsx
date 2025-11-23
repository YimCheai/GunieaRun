import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';

import waitBackground from '../assets/images/waiting.png';
import startButton from '../assets/images/start.svg';
import logoutButton from '../assets/images/logout.svg';
import cherryScore from '../assets/images/cherry_score.svg';
import peachScore from '../assets/images/peach_score.svg';
import rankButton from '../assets/images/rank.svg';

export default function Waiting() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("로그아웃 성공");
      navigate('/'); // MainPage로 이동
    } catch (err) {
      console.error("로그아웃 실패:", err);
    }
  };

  const handleStart = () => {
    console.log('Start 클릭 - Phaser 게임으로 이동');
    navigate('/ingame'); // 공백 제거, InGame 페이지로 이동
  };

  return (
    <>
      {/* 글로벌 CSS 초기화 */}
      <style>
        {`
          html, body, #root {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow: hidden; /* 스크롤 제거 */
            background: #000;
          }
        `}
      </style>

      <div
        style={{
          width: '100vw',
          height: '100vh',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* 전체 배경 */}
        <img
          src={waitBackground}
          alt="waiting background"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />

        {/* 오른쪽 아래 start 버튼 */}
        <img
          src={startButton}
          alt="start"
          style={{
            position: 'absolute',
            right: '1%',
            bottom: '-11%',
            width: '410px',
            height: 'auto',
            cursor: 'pointer',
          }}
          onClick={handleStart}
        />

        {/* 왼쪽 위 logout 버튼 */}
        <img
          src={logoutButton}
          alt="logout"
          style={{
            position: 'absolute',
            top: '-3%',
            left: '1%',
            width: '202px',
            height: 'auto',
            cursor: 'pointer',
          }}
          onClick={handleLogout}
        />

        {/* 로그아웃 밑에 rank 버튼 */}
        <img
          src={rankButton}
          alt="rank"
          style={{
            position: 'absolute',
            top: '18%',
            left: '1%',
            width: '213px',
            height: 'auto',
            cursor: 'pointer',
          }}
          onClick={() => console.log('Rank 클릭')}
        />

        {/* 오른쪽 위 cherry_score */}
        <img
          src={cherryScore}
          alt="cherry score"
          style={{
            position: 'absolute',
            top: '1%',
            right: 'calc(5% + 239px)',
            width: '210px',
            height: 'auto',
          }}
        />

        {/* 오른쪽 위 peach_score */}
        <img
          src={peachScore}
          alt="peach score"
          style={{
            position: 'absolute',
            top: '-1%',
            right: '5%',
            width: '239px',
            height: 'auto',
          }}
        />
      </div>
    </>
  );
}
    