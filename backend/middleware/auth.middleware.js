import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    
    // ✅ Use jwt.verify (not jwtverify or anything else)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth error:', error.message);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export default protect;
