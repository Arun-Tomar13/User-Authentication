import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authAPI } from '../api/auth';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: authAPI.register,
    onSuccess: (data) => {
      navigate('/verify-otp', { state: { email: data.email } });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    mutation.mutate({ name: form.name, email: form.email.trim().toLowerCase(), password: form.password });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-icon">👤</div>
        <h2>Create Account</h2>
        <p className="text-muted">Sign up to get started</p>

        {mutation.isError && (
          <div className="alert alert-danger">
            <strong>❌</strong> {mutation.error.message}
          </div>
        )}

        {mutation.isSuccess && (
          <div className="alert alert-success">
            <strong>✅</strong> Registration successful! Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              minLength={2}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Create password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                minLength={6}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="toggle-password">
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              required
            />
          </div>

          <button type="submit" disabled={mutation.isPending} className="btn-primary btn-full">
            {mutation.isPending ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="text-center mt-3">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}
