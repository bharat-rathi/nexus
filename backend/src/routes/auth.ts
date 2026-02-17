import { Router } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { db } from '../db';

const router = Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

// Mock login for development (since we don't have real Google credentials yet)
router.post('/dev-login', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });

    let user = await db.user.findUnique({ where: { email } });
    if (!user) {
      user = await db.user.create({
        data: {
          email,
          name: email.split('@')[0],
          authProvider: 'dev',
        },
      });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user });
  } catch (error) {
    console.error('Dev login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Google Login
router.post('/google', async (req, res) => {
  try {
    const { idToken } = req.body;
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    
    if (!payload?.email) throw new Error('No email in token');

    let user = await db.user.findUnique({ where: { email: payload.email } });
    if (!user) {
      user = await db.user.create({
        data: {
          email: payload.email,
          name: payload.name,
          avatar: payload.picture,
          authProvider: 'google',
          authProviderId: payload.sub,
        },
      });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
});

export default router;
