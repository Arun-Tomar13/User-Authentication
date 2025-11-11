<div align="center">

# 🔐 Account Manager

**A full-stack secure authentication system with OTP verification**

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![TanStack Query](https://img.shields.io/badge/TanStack%20Query-5.0-FF4154?style=for-the-badge&logo=react-query&logoColor=white)](https://tanstack.com/query)
[![Express](https://img.shields.io/badge/Express-4.21-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Tech Stack](#-tech-stack) • [API Docs](#-api-documentation) • [Contributing](#-contributing)

</div>

---

## 📸 Preview

### Authentication Flow

### Register

<div align="center">
  <img src="./preview/register.png" alt="Register" width="800"/>
  <br />
  <strong>Register Page</strong>
</div>

### Login

<div align="center">
  <img src="./preview/login.png" alt="Login" width="800"/>
  <br />
  <strong>Login Page</strong>
</div>

### Forget Password

<div align="center">
  <img src="./preview/forgot-password-1.png" alt="Forgot Password Step 1" width="500"/>
  <br />
  <strong>Forgot Password - Step 1</strong>
</div>

<div align="center">
  <img src="./preview/forgot-password-2.png" alt="Forgot Password Step 2" width="500"/>
  <br />
  <strong>Forgot Password - Step 2</strong>
</div>

### Dashboard

<div align="center">
  <img src="./preview/dashboard.png" alt="Dashboard" width="800"/>
  <br />
  <strong>User Dashboard with Profile Management</strong>
</div>

---

## ✨ Features

### 🔐 Authentication & Security
- ✅ **Email & Password Registration** with validation
- ✅ **OTP Email Verification** for account activation
- ✅ **Secure Login** with JWT tokens
- ✅ **Forgot Password** with OTP-based reset
- ✅ **Change Password** (protected, requires OTP)
- ✅ **Password Visibility Toggle** on all password fields
- ✅ **Token-based Authentication** with JWT
- ✅ **Protected Routes** for authenticated users

### 👤 User Management
- ✅ **Profile Viewing** with user details
- ✅ **Profile Editing** (name, phone, address)
- ✅ **Email Verification Badge**
- ✅ **Member Since** date display

### 📧 Email System
- ✅ **Beautiful HTML Email Templates**
- ✅ **OTP Delivery** for all verification processes
- ✅ **Purpose-specific Templates** (Verification, Reset, Change)
- ✅ **10-minute OTP Expiry** with auto-cleanup

### 🎨 UI/UX
- ✅ **Modern Gradient Design**
- ✅ **Responsive Layout** (mobile, tablet, desktop)
- ✅ **Smooth Animations** and transitions
- ✅ **Loading States** for all async operations
- ✅ **Error & Success Alerts**
- ✅ **Form Validation** with user-friendly messages

---

## 🚀 Demo

### Live Demo
🌐 **[Coming Soon]**

### Test Credentials
```
Email: demo@example.com
Password: demo123
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework |
| **TanStack Query** | Server state management |
| **React Router** | Client-side routing |
| **Context API** | Global auth state |
| **Vanilla CSS** | Styling with custom design system |

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment |
| **Express.js** | Web framework |
| **MongoDB** | Database |
| **Mongoose** | ODM for MongoDB |
| **JWT** | Token-based authentication |
| **Nodemailer** | Email service |
| **bcrypt** | Password hashing |

---

## 📦 Installation

### Prerequisites
- Node.js (v20+)
- MongoDB (v7.0+)
- Gmail account (for email service)

### 1. Clone the Repository
```bash
git clone https://github.com/Arun-Tomar13/User-Authentication.git
cd User-Authentication
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/account-manager
# Or use MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/account-manager

JWT_SECRET=your_super_secret_jwt_key_here_minimum_32_characters

# Gmail Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-digit-app-password
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

### 4. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Access the app:**
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

---

## 📧 Gmail Setup (Important!)

### Enable 2-Step Verification
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification**

### Generate App Password
1. Go to [App Passwords](https://myaccount.google.com/apppasswords)
2. Select **Mail** and your device
3. Copy the **16-digit password**
4. Add to `.env` as `EMAIL_PASS`

---

## 📁 Project Structure

```
account-manager/
│
├── backend/
│   ├── controllers/
│   │   └── auth.controller.js
│   ├── middleware/
│   │   └── auth.middleware.js
│   ├── models/
│   │   ├── User.model.js
│   │   └── OTP.model.js
│   ├── routes/
│   │   └── auth.route.js
│   ├── utils/
│   │   └── sendEmail.util.js
│   ├── config/
│   │   └── db.js
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── VerifyOTP.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── ChangePassword.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── Navbar.jsx
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx
│   │   ├── api/
│   │   │   └── auth.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── package.json
│
├── preview/
│   ├── login.png
│   ├── register.png
│   ├── forgot-password-1.png
│   ├── forgot-password-2.png
│   └── dashboard.png
│
├── .gitignore
└── README.md
```

---

## 🔌 API Documentation

### Base URL
```
http://localhost:5000/api/auth
```

### Endpoints

#### 1. Register User
```http
POST /register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Registration successful! Please check your email for OTP.",
  "email": "john@example.com"
}
```

---

#### 2. Verify OTP
```http
POST /verify-otp
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Response:**
```json
{
  "message": "Email verified successfully!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "673...",
    "name": "John Doe",
    "email": "john@example.com",
    "isVerified": true
  }
}
```

---

#### 3. Login
```http
POST /login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

---

#### 4. Get Profile (Protected)
```http
GET /profile
Authorization: Bearer <token>
```

**Response:**
```json
{
  "user": {
    "id": "673...",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "address": "123 Main St",
    "isVerified": true,
    "createdAt": "2024-11-11T12:00:00.000Z"
  }
}
```

---

#### 5. Update Profile (Protected)
```http
PUT /profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Updated",
  "phone": "9876543210",
  "address": "456 New St"
}
```

---

#### 6. Forgot Password
```http
POST /forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

---

#### 7. Reset Password
```http
POST /reset-password
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456",
  "newPassword": "newpass123"
}
```

---

#### 8. Change Password - Send OTP (Protected)
```http
POST /change-password-otp
Authorization: Bearer <token>
```

---

#### 9. Change Password (Protected)
```http
POST /change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "oldpass123",
  "newPassword": "newpass123",
  "otp": "123456"
}
```

---

## 🔒 Security Features

### Password Security
- ✅ **bcrypt hashing** with salt rounds
- ✅ **Minimum 6 characters** validation
- ✅ **Hide/show toggle** for password fields

### Token Security
- ✅ **JWT tokens** with expiry (30 days)
- ✅ **HTTP-only cookies** ready (optional)
- ✅ **Protected routes** with middleware

### OTP Security
- ✅ **6-digit random** OTP generation
- ✅ **10-minute expiry** with auto-cleanup
- ✅ **One-time use** (deleted after verification)
- ✅ **Email-specific** OTP storage

---

## 🧪 Testing

### Manual Testing Checklist

#### Registration Flow
- [ ] Register with valid email
- [ ] Receive OTP email
- [ ] Verify with correct OTP
- [ ] Redirected to dashboard
- [ ] Token saved in localStorage

#### Login Flow
- [ ] Login with correct credentials
- [ ] Token generated and saved
- [ ] Redirected to dashboard
- [ ] Navbar shows username

#### Forgot Password Flow
- [ ] Enter registered email
- [ ] Receive OTP email
- [ ] Enter OTP + new password
- [ ] Password reset successful
- [ ] Login with new password

#### Change Password Flow
- [ ] From dashboard, click "Change Password"
- [ ] Receive OTP email
- [ ] Enter current password + OTP + new password
- [ ] Password changed successfully
- [ ] Logout and login with new password

#### Profile Management
- [ ] View profile details
- [ ] Edit name, phone, address
- [ ] Save changes
- [ ] Changes reflected immediately

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Arun Tomar**
- GitHub: [@Arun-Tomar13](https://github.com/Arun-Tomar13)
- LinkedIn: [Arun Tomar](https://linkedin.com/in/yourprofile)

---

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [TanStack Query](https://tanstack.com/query)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Nodemailer](https://nodemailer.com/)

---

<div align="center">

**⭐ Star this repo if you found it helpful!**

Made with ❤️ and ☕

</div>
