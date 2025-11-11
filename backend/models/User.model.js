import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  phone: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// DON'T hash password on save - we'll hash manually in routes
// This prevents double hashing issue

const User = mongoose.model('User', userSchema);

export default User;
