import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import VerifyOTP from './components/VerifyOTP';
import Dashboard from './components/Dashboard';
import ForgotPassword from './components/ForgetPassword';     
import ChangePassword from './components/ChangePassword';     

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
}

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={
          <div className="home-container">
            <div className="home-content">
              <div className="auth-icon">🔐</div>
              <h1>Account Manager</h1>
              <p>Secure account management system with OTP verification</p>
            </div>
          </div>
        } />
        
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        
        {/*  Forgot Password (Public) */}
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        
        {/* Change Password (Protected) */}
        <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
