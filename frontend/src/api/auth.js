const API = 'http://localhost:5000/api/auth';

const request = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  
  console.log(`\n🔵 API Request: ${options.method || 'GET'} ${url}`);
  console.log('🔑 Token from localStorage:', token ? 'EXISTS (' + token.substring(0, 20) + '...)' : 'MISSING');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
    console.log('✅ Authorization header set');
  } else {
    console.log('⚠️ No Authorization header (no token)');
  }

  console.log('📤 Sending request...');
  const res = await fetch(`${API}${url}`, { 
    ...options, 
    headers 
  });
  
  console.log('📥 Response status:', res.status);
  const data = await res.json();
  console.log('📦 Response data:', data);
  
  if (!res.ok) {
    console.error('❌ Request failed');
    throw new Error(data.message || 'Request failed');
  }
  
  console.log('✅ Request successful\n');
  return data;
};

export const authAPI = {
  register: (data) => request('/register', { 
    method: 'POST', 
    body: JSON.stringify(data) 
  }),
  
  verifyOTP: (data) => request('/verify-otp', { 
    method: 'POST', 
    body: JSON.stringify(data) 
  }),
  
  resendOTP: (email) => request('/resend-otp', { 
    method: 'POST', 
    body: JSON.stringify({ email }) 
  }),
  
  login: (data) => request('/login', { 
    method: 'POST', 
    body: JSON.stringify(data) 
  }),
  
  getProfile: () => request('/profile').then(res => res.user || res),
  
  updateProfile: (data) => request('/profile', { 
    method: 'PUT', 
    body: JSON.stringify(data) 
  }).then(res => res.user || res),

   //  Password management
  forgotPassword: (email) => request('/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email })
  }),
  
  resetPassword: (data) => request('/reset-password', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  
  sendChangePasswordOTP: () => request('/change-password-otp', {
    method: 'POST'
  }),
  
  changePassword: (data) => request('/change-password', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

};
