import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MainPage from './pages/MainPage';
import Waiting from './pages/waiting';
// import InGame from './pages/ingame'; // 새로 추가

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/waiting" element={<Waiting />} />
        {/* <Route path="/ingame" element={<InGame />} /> Phaser 실행용 */}
      </Routes>
    </BrowserRouter>
  );
}