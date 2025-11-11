import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../api/auth';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user: contextUser, setUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', address: '' });
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: user, isLoading, error, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      console.log('🔍 Dashboard: Fetching profile...');
      const token = localStorage.getItem('token');
      console.log('🔑 Dashboard: Token in localStorage:', token ? 'EXISTS' : 'MISSING');
      
      try {
        const result = await authAPI.getProfile();
        console.log('✅ Dashboard: Profile fetched:', result);
        return result;
      } catch (error) {
        console.error('❌ Dashboard: Fetch failed:', error);
        throw error;
      }
    },
    retry: 1,
    refetchOnMount: true,
    enabled: true,
  });

  // Update context and form when user data loads
  useEffect(() => {
    if (user) {
      console.log('✅ Dashboard: User loaded', user);
      setUser(user);
      setForm({ 
        name: user.name || '', 
        phone: user.phone || '', 
        address: user.address || '' 
      });
    }
  }, [user, setUser]);

  // Update profile mutation
  const mutation = useMutation({
    mutationFn: authAPI.updateProfile,
    onSuccess: (data) => {
      console.log('✅ Profile updated:', data);
      queryClient.setQueryData(['profile'], data);
      setUser(data);
      setEditing(false);
      // Refetch to ensure latest data
      setTimeout(() => refetch(), 100);
    },
    onError: (error) => {
      console.error('❌ Update failed:', error);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('📤 Submitting update:', form);
    mutation.mutate(form);
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="loading-container">
        <div className="alert alert-danger" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <strong>❌ Error:</strong> {error.message}
          <br />
          <button onClick={() => refetch()} className="btn-primary mt-3">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="loading-container">
        <p style={{ color: 'white' }}>No user data available</p>
        <button onClick={() => refetch()} className="btn-primary mt-3">
          Reload
        </button>
      </div>
    );
  }

  const initials = user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="dashboard-container">
      <div className="profile-card">
        <div className="profile-avatar">{initials}</div>
        <h2>{editing ? 'Edit Profile' : 'My Profile'}</h2>
        <p className="text-muted">{editing ? 'Update your information' : 'Manage your account'}</p>

        {mutation.isSuccess && (
          <div className="alert alert-success">
            <strong>✅</strong> Profile updated successfully!
          </div>
        )}

        {mutation.isError && (
          <div className="alert alert-danger">
            <strong>❌</strong> {mutation.error.message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="profile-field">
            <label>Full Name</label>
            {editing ? (
              <input 
                value={form.name} 
                onChange={(e) => setForm({ ...form, name: e.target.value })} 
                required 
              />
            ) : (
              <p>{user.name}</p>
            )}
          </div>

          <div className="profile-field">
            <label>Email Address</label>
            <p>
              {user.email}
              {user.isVerified && <span className="badge">✓ Verified</span>}
            </p>
          </div>

          <div className="profile-field">
            <label>Phone Number</label>
            {editing ? (
              <input 
                type="tel"
                value={form.phone} 
                onChange={(e) => setForm({ ...form, phone: e.target.value })} 
                maxLength={10}
                placeholder="Enter 10-digit phone"
              />
            ) : (
              <p>{user.phone || <span className="text-muted">Not provided</span>}</p>
            )}
          </div>

          <div className="profile-field">
            <label>Address</label>
            {editing ? (
              <textarea 
                value={form.address} 
                onChange={(e) => setForm({ ...form, address: e.target.value })} 
                rows={3}
                placeholder="Enter your address"
              />
            ) : (
              <p>{user.address || <span className="text-muted">Not provided</span>}</p>
            )}
          </div>

          {editing ? (
            <div className="btn-group">
              <button type="submit" className="btn-primary" disabled={mutation.isPending}>
                {mutation.isPending ? 'Saving...' : '💾 Save Changes'}
              </button>
              <button 
                type="button" 
                onClick={() => {
                  setEditing(false);
                  setForm({ 
                    name: user.name || '', 
                    phone: user.phone || '', 
                    address: user.address || '' 
                  });
                }} 
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              <button type="button" onClick={() => setEditing(true)} className="btn-primary btn-full">
                ✏️ Edit Profile
              </button>
              
              {/*  Password Button */}
              <button 
                type="button" 
                onClick={() => navigate('/change-password')} 
                className="btn-secondary btn-full"
                style={{ marginTop: '12px' }}
              >
                🔒 Change Password
              </button>
            </>
          )}
        </form>

        {!editing && (
          <div className="profile-footer">
            <p className="text-muted">
              Member since {new Date(user.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
