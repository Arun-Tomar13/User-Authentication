import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api/auth';

export default function ChangePassword() {
  const [step, setStep] = useState(1); // 1: Send OTP, 2: Enter OTP + Passwords
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  
  //  Separate state for each password field
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const navigate = useNavigate();

  const sendOTPMutation = useMutation({
    mutationFn: authAPI.sendChangePasswordOTP,
    onSuccess: () => {
      setStep(2);
    },
  });

  const changeMutation = useMutation({
    mutationFn: authAPI.changePassword,
    onSuccess: () => {
      setTimeout(() => navigate('/dashboard'), 2000);
    },
  });

  const handleSendOTP = (e) => {
    e.preventDefault();
    sendOTPMutation.mutate();
  };

  const handleChange = (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match!');
      return;
    }

    if (newPassword.length < 6) {
      alert('New password must be at least 6 characters!');
      return;
    }

    if (newPassword === currentPassword) {
      alert('New password must be different from current password!');
      return;
    }

    changeMutation.mutate({ currentPassword, newPassword, otp });
  };

  return (
    <div className="dashboard-container">
      <div className="profile-card" style={{ maxWidth: '500px' }}>
        <div className="auth-icon" style={{ margin: '0 auto 1.5rem' }}>🔒</div>
        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Change Password</h2>
        <p className="text-muted" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          {step === 1 
            ? 'An OTP will be sent to your email for verification' 
            : 'Enter OTP and your new password'}
        </p>

        {sendOTPMutation.isError && (
          <div className="alert alert-danger">
            <strong>❌</strong> {sendOTPMutation.error.message}
          </div>
        )}

        {sendOTPMutation.isSuccess && step === 1 && (
          <div className="alert alert-success">
            <strong>✅</strong> OTP sent to your email!
          </div>
        )}

        {changeMutation.isError && (
          <div className="alert alert-danger">
            <strong>❌</strong> {changeMutation.error.message}
          </div>
        )}

        {changeMutation.isSuccess && (
          <div className="alert alert-success">
            <strong>✅</strong> Password changed successfully! Redirecting...
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendOTP}>
            <div className="profile-field">
              <p style={{ textAlign: 'center', color: '#666', marginBottom: '1.5rem' }}>
                Click the button below to receive an OTP for password verification.
              </p>
            </div>

            <button 
              type="submit" 
              disabled={sendOTPMutation.isPending} 
              className="btn-primary btn-full"
            >
              {sendOTPMutation.isPending ? 'Sending OTP...' : '📧 Send OTP to Email'}
            </button>

            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn-secondary btn-full mt-3"
            >
              Cancel
            </button>
          </form>
        ) : (
          <form onSubmit={handleChange}>
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

            {/*  Current Password  */}
            <div className="form-group">
              <label>Current Password</label>
              <div className="password-input">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowCurrent(!showCurrent)} 
                  className="toggle-password"
                >
                  {showCurrent ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {/*  New Password  */}
            <div className="form-group">
              <label>New Password</label>
              <div className="password-input">
                <input
                  type={showNew ? 'text' : 'password'}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <button 
                  type="button" 
                  onClick={() => setShowNew(!showNew)} 
                  className="toggle-password"
                >
                  {showNew ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {/* Confirm Password  */}
            <div className="form-group">
              <label>Confirm New Password</label>
              <div className="password-input">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={changeMutation.isPending || otp.length !== 6} 
              className="btn-primary btn-full"
              style={{ marginTop: '1rem' }}
            >
              {changeMutation.isPending ? 'Changing Password...' : '🔒 Change Password'}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep(1);
                setOtp('');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setShowCurrent(false);
                setShowNew(false);
                setShowConfirm(false);
              }}
              className="btn-secondary btn-full mt-2"
            >
              Back
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
