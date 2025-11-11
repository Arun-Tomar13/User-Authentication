import mongoose from 'mongoose';

const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    index: true
  },
  otp: {
    type: String,
    required: true
  },
  tempUserData: {
    name: {
      type: String,
      required: false  
    },
    password: {
      type: String,
      required: false 
    }
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600  // Auto-delete after 10 minutes
  }
});

const OTP = mongoose.model('OTP', OTPSchema);
export default OTP;
