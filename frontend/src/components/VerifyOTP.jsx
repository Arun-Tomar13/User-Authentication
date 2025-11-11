import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../api/auth';

export default function VerifyOTP() {
  const [otp, setOtp] = useState('');
  const { state } = useLocation();
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!state?.email) navigate('/register');
  }, [state, navigate]);

  const verifyMutation = useMutation({
    mutationFn: authAPI.verifyOTP,
    onSuccess: (data) => {
      login(data.user, data.token);
      navigate('/dashboard');
    },
  });

  const resendMutation = useMutation({
    mutationFn: authAPI.resendOTP,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    verifyMutation.mutate({ email: state.email, otp });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-icon">📧</div>
        <h2>Verify Email</h2>
        <p className="text-muted">
          Enter 6-digit code sent to<br />
          <strong>{state?.email}</strong>
        </p>

        {verifyMutation.isError && (
          <div className="alert alert-danger">
            <strong>❌</strong> {verifyMutation.error.message}
          </div>
        )}

        {resendMutation.isSuccess && (
          <div className="alert alert-success">
            <strong>✅</strong> New OTP sent!
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              maxLength={6}
              className="otp-input"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={verifyMutation.isPending || otp.length !== 6} 
            className="btn-primary btn-full"
          >
            {verifyMutation.isPending ? 'Verifying...' : 'Verify Email'}
          </button>

          <button 
            type="button" 
            onClick={() => resendMutation.mutate(state.email)} 
            className="btn-secondary btn-full mt-2"
            disabled={resendMutation.isPending}
          >
            {resendMutation.isPending ? 'Sending...' : 'Resend OTP'}
          </button>
        </form>
      </div>
    </div>
  );
}
