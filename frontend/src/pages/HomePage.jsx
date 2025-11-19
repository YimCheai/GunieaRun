import React from "react";
import styles from "../styles/Home.module.css";
import logoImg from "../assets/images/logo.png";
import guineaImg from "../assets/images/guinea.png";      // 캐릭터
import platformImg from "../assets/images/platform.png";  // 구름/발판
import cherryIcon from "../assets/images/cherry.png";
import peachIcon from "../assets/images/peach.png";

function Home() {
  const navigate = useNavigate();

  const handleStart = () => {
    // 게임 씬/페이지로 이동할 경로로 수정
    navigate("/game");
  };

  const handleLogout = () => {
    navigate("/login");
  };

  const handleRank = () => {
    navigate("/rank");
  };

  const handleStore = () => {
    navigate("/store");
  };

  return (
    <div className={styles.homeContainer}>
      {/* 상단 바 */}
      <header className={styles.topBar}>
        <button className={styles.smallButton} onClick={handleLogout}>
          LOG OUT
        </button>

        <div className={styles.currencyBox}>
          <div className={styles.currencyItem}>
            <img src={cherryIcon} alt="cherry" />
            <span>33175</span>
          </div>
          <div className={styles.currencyItem}>
            <img src={peachIcon} alt="peach" />
            <span>33175</span>
          </div>
        </div>
      </header>

      {/* 메인 영역 */}
      <main className={styles.main}>
        <img src={logoImg} alt="GuineaRun logo" className={styles.logo} />

        <div className={styles.sideButtons}>
          <button className={styles.sideButton} onClick={handleRank}>
            RANK
          </button>
          <button className={styles.sideButton} onClick={handleStore}>
            STORE
          </button>
        </div>

        <div className={styles.characterSection}>
          <img
            src={guineaImg}
            alt="guinea"
            className={styles.character}
          />
          <img
            src={platformImg}
            alt="platform"
            className={styles.platform}
          />
        </div>

        <button className={styles.startButton} onClick={handleStart}>
          START
        </button>
      </main>
    </div>
  );
}

export default Home;
