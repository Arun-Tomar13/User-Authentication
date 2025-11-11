import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import OTP from '../models/OTP.model.js';
import { generateOTP, sendOTPEmail } from '../utils/sendEmail.util.js';

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

/**
 * @desc    Register user and send OTP
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    console.log('📝 Registration:', email);

    // Check if user exists
    const userExists = await User.findOne({ email, isVerified: true });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate OTP
    const otp = generateOTP();
    console.log('🔢 OTP:', otp);

    // Delete existing OTP
    await OTP.deleteMany({ email });

    // Save OTP with temp data
    await OTP.create({ 
      email, 
      otp,
      tempUserData: { name, password: hashedPassword }
    });

    // Send email
    await sendOTPEmail(email, otp);

    res.status(201).json({ 
      message: 'Registration successful! OTP sent to your email.',
      email 
    });
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Verify OTP and create user
 * @route   POST /api/auth/verify-otp
 * @access  Public
 */
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    console.log('🔍 Verifying OTP for:', email);

    // Find OTP
    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    console.log('✅ OTP valid, creating user...');

    // Create user
    const user = await User.create({
      name: otpRecord.tempUserData.name,
      email: email,
      password: otpRecord.tempUserData.password,
      isVerified: true
    });

    console.log('✅ User created:', user._id);

    // Delete OTP
    await OTP.deleteOne({ email, otp });

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      message: 'Email verified successfully!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        isVerified: user.isVerified,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('❌ Verification error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Resend OTP
 * @route   POST /api/auth/resend-otp
 * @access  Public
 */
export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const existingOTP = await OTP.findOne({ email });
    if (!existingOTP) {
      return res.status(404).json({ message: 'No pending registration found.' });
    }

    const newOtp = generateOTP();
    console.log('🔢 New OTP:', newOtp);

    existingOTP.otp = newOtp;
    existingOTP.createdAt = Date.now();
    await existingOTP.save();

    await sendOTPEmail(email, newOtp);

    res.status(200).json({ message: 'New OTP sent!' });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('🔑 Login attempt for:', email);

    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.log('❌ User not found');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log('✅ User found:', user._id);

    if (!user.isVerified) {
      console.log('⚠️ User not verified');
      return res.status(403).json({ 
        message: 'Please verify your email first.',
        needsVerification: true 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('🔍 Password match:', isMatch);

    if (!isMatch) {
      console.log('❌ Password mismatch');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log('✅ Login successful!');

    const token = generateToken(user._id);

    // ✅ DEBUG: Log what we're sending
    const responseData = {
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        isVerified: user.isVerified,
        createdAt: user.createdAt
      }
    };

    console.log('📤 SENDING RESPONSE:', JSON.stringify(responseData, null, 2));

    res.status(200).json(responseData);
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Get user profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        isVerified: user.isVerified,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;

    await user.save();

    console.log('✅ Profile updated for:', user.email);

    res.status(200).json({
      message: 'Profile updated successfully!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        isVerified: user.isVerified,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Forgot Password - Send OTP
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    console.log('🔑 Forgot password request for:', email);

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email' });
    }

    // Generate OTP
    const otp = generateOTP();
    console.log('🔢 Password reset OTP:', otp);

    // Delete existing OTP for this email
    await OTP.deleteMany({ email });

    // Save OTP (no temp data needed, just for password reset)
    await OTP.create({ email, otp });

    // Send email
    await sendOTPEmail(email, otp, 'Password Reset');

    res.status(200).json({ 
      message: 'Password reset OTP sent to your email',
      email 
    });
  } catch (error) {
    console.error('❌ Forgot password error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Reset Password with OTP
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    console.log('🔑 Reset password attempt for:', email);

    // Verify OTP
    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    console.log('✅ OTP verified');

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    user.password = hashedPassword;
    await user.save();

    // Delete OTP
    await OTP.deleteOne({ email, otp });

    console.log('✅ Password reset successful');

    res.status(200).json({ message: 'Password reset successful! Please login.' });
  } catch (error) {
    console.error('❌ Reset password error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Change Password (requires OTP) - Step 1: Send OTP
 * @route   POST /api/auth/change-password-otp
 * @access  Private
 */
export const sendChangePasswordOTP = async (req, res) => {
  try {
    const user = req.user;
    const email = user.email;

    console.log('🔑 Change password OTP request for:', email);

    // Generate OTP
    const otp = generateOTP();
    console.log('🔢 Change password OTP:', otp);

    // Delete existing OTP
    await OTP.deleteMany({ email });

    // ✅ FIX: Save OTP WITHOUT tempUserData (password change doesn't need it)
    await OTP.create({ 
      email, 
      otp,
      // Don't include tempUserData for password changes
    });

    // Send email
    await sendOTPEmail(email, otp, 'Change Password');

    res.status(200).json({ 
      message: 'OTP sent to your email',
      email 
    });
  } catch (error) {
    console.error('❌ Send change password OTP error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


/**
 * @desc    Change Password (requires OTP) - Step 2: Verify & Change
 * @route   POST /api/auth/change-password
 * @access  Private
 */
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, otp } = req.body;
    const user = req.user;

    if (!currentPassword || !newPassword || !otp) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    console.log('🔑 Change password attempt for:', user.email);

    // Verify OTP
    const otpRecord = await OTP.findOne({ email: user.email, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Get user with password
    const userWithPassword = await User.findById(user._id).select('+password');

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, userWithPassword.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    userWithPassword.password = hashedPassword;
    await userWithPassword.save();

    // Delete OTP
    await OTP.deleteOne({ email: user.email, otp });

    console.log('✅ Password changed successfully');

    res.status(200).json({ message: 'Password changed successfully!' });
  } catch (error) {
    console.error('❌ Change password error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
