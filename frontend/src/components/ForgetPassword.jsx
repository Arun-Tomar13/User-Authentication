import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authAPI } from '../api/auth';

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP + New Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  //  Separate state for each password field
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const navigate = useNavigate();

  const sendOTPMutation = useMutation({
    mutationFn: authAPI.forgotPassword,
    onSuccess: () => {
      setStep(2);
    },
  });

  const resetMutation = useMutation({
    mutationFn: authAPI.resetPassword,
    onSuccess: () => {
      setTimeout(() => navigate('/login'), 2000);
    },
  });

  const handleSendOTP = (e) => {
    e.preventDefault();
    sendOTPMutation.mutate(email.trim().toLowerCase());
  };

  const handleReset = (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters!');
      return;
    }

    resetMutation.mutate({ email, otp, newPassword });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-icon">🔑</div>
        <h2>Forgot Password</h2>
        <p className="text-muted">
          {step === 1 ? 'Enter your email to receive OTP' : 'Enter OTP and new password'}
        </p>

        {sendOTPMutation.isError && (
          <div className="alert alert-danger">
            <strong>❌</strong> {sendOTPMutation.error.message}
          </div>
        )}

        {sendOTPMutation.isSuccess && step === 1 && (
          <div className="alert alert-success">
            <strong>✅</strong> OTP sent! Check your email.
          </div>
        )}

        {resetMutation.isError && (
          <div className="alert alert-danger">
            <strong>❌</strong> {resetMutation.error.message}
          </div>
        )}

        {resetMutation.isSuccess && (
          <div className="alert alert-success">
            <strong>✅</strong> Password reset successful! Redirecting to login...
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendOTP}>
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

            <button type="submit" disabled={sendOTPMutation.isPending} className="btn-primary btn-full">
              {sendOTPMutation.isPending ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleReset}>
            <div className="form-group">
              <label>OTP</label>
              <input
                type="text"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                maxLength={6}
                required
                style={{ 
                  fontSize: '1.5rem', 
                  letterSpacing: '0.3em', 
                  textAlign: 'center',
                  fontWeight: '600'
                }}
              />
            </div>

            {/*  New Password  */}
            <div className="form-group">
              <label>New Password</label>
              <div className="password-input">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <button 
                  type="button" 
                  onClick={() => setShowNewPassword(!showNewPassword)} 
                  className="toggle-password"
                >
                  {showNewPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {/*  Confirm Password */}
            <div className="form-group">
              <label>Confirm Password</label>
              <div className="password-input">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={resetMutation.isPending} className="btn-primary btn-full">
              {resetMutation.isPending ? 'Resetting...' : 'Reset Password'}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep(1);
                setOtp('');
                setNewPassword('');
                setConfirmPassword('');
                setShowNewPassword(false);
                setShowConfirmPassword(false);
              }}
              className="btn-secondary btn-full mt-2"
            >
              Back
            </button>
          </form>
        )}

        <p className="text-center mt-3">
          Remember your password? <Link to="/login" style={{ color: '#667eea', textDecoration: 'none', fontWeight: '600' }}>Login</Link>
        </p>
      </div>
    </div>
  );
}
