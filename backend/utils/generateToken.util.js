import jwt from 'jsonwebtoken';

/**
 * Generate JWT Token
 * @param {String} userId - MongoDB user ID
 * @returns {String} JWT token
 */
export const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};
