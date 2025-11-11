import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../api/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: authAPI.login,
    onSuccess: (data) => {
      login(data.user, data.token);
      navigate('/dashboard');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ email: email.trim().toLowerCase(), password });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-icon">🔐</div>
        <h2>Welcome Back</h2>
        <p className="text-muted">Login to your account</p>

        {mutation.isError && (
          <div className="alert alert-danger">
            <strong>❌</strong> {mutation.error.message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="toggle-password">
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {/* Forgot Password Link */}
            <div style={{ textAlign: 'right', marginTop: '8px' }}>
              <Link to="/forgot-password" style={{ fontSize: '14px', color: '#667eea', textDecoration: 'none' }}>
                Forgot Password?
              </Link>
            </div>
          </div>

          <button type="submit" disabled={mutation.isPending} className="btn-primary btn-full">
            {mutation.isPending ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center mt-3">
          Don't have an account? <Link to="/register" style={{ color: '#667eea', textDecoration: 'none', fontWeight: '600' }}>Register here</Link>
        </p>
      </div>
    </div>
  );
}
