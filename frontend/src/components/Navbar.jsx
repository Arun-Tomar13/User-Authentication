import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">🔐 Account Manager</Link>
        <div className="navbar-actions">
          {isAuthenticated && user ? (
            <>
              <span className="navbar-user">Hi, {user.name}!</span>
              <button onClick={() => { logout(); navigate('/login'); }} className="btn-logout">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-outline">Login</Link>
              <Link to="/register" className="btn-primary">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
