import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const generateAuthToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      email: user.email,
    },
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_EXPIRES_IN,
    }
  );
};

export const verifyAuthToken = (token) => {
  return jwt.verify(token, env.JWT_SECRET);
};
