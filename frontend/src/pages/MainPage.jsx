import { useNavigate } from 'react-router-dom';
import waitingImg from '../assets/images/waiting.png';

export default function MainPage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        width: '1920px',
        height: '1080px',
        backgroundImage: `url(${waitingImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        cursor: 'pointer'
      }}
      onClick={() => navigate('/signup')}
    />
  );
}
