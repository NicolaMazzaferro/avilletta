import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import App from '../App';

function Middleware() {
    const { isLoggedIn } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ path: location.pathname }} />;
  }
  return <App />;
}

export default Middleware;