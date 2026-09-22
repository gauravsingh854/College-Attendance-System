import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { env } from '../config/env.js';

export const generateSessionQrSecret = () => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Generates dynamic time-expiring QR payload token
 * @param {string} sessionId
 * @param {string} qrSecret
 * @param {number} expiresInSeconds
 */
export const generateDynamicQrToken = (sessionId, qrSecret, expiresInSeconds = 30) => {
  const secretKey = `${env.JWT_SECRET}_${qrSecret}`;
  const payload = {
    sessionId,
    nonce: crypto.randomBytes(8).toString('hex'),
  };

  return jwt.sign(payload, secretKey, {
    expiresIn: `${expiresInSeconds}s`,
  });
};

/**
 * Verifies QR payload token against session secret
 * @param {string} qrToken
 * @param {string} qrSecret
 */
export const verifyDynamicQrToken = (qrToken, qrSecret) => {
  const secretKey = `${env.JWT_SECRET}_${qrSecret}`;
  return jwt.verify(qrToken, secretKey);
};
