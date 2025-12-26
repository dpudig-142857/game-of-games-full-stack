import express from 'express';
import { authenticate , login, logout } from '../db/queries.js';

const router = express.Router();

router.get('/me', async (req, res) => {
  try {
    const result = await authenticate(req);
    res.json(result);
  } catch (error) {
    console.error('Error fetching authentication:', error);
    res.status(500).json({ error: 'Failed to fetch authentication' });
  }
});

router.get('/status', async (req, res) => {
  try {
    
  } catch (error) {
    console.error('Error fetching authentication:', error);
    res.status(500).json({ error: 'Failed to fetch authentication status' });
  }
});

router.post('/register', async (req, res) => {
  try {
    
  } catch (error) {
    console.error('Error posting authentication:', error);
    res.status(500).json({ error: 'Failed to post authentication' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await login(req, username, password);
    console.log(result);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error fetching authenticate:', error);
    res.status(500).json({ error: 'Failed to fetch authenticate' });
  }
});

router.post('/logout', async (req, res) => {
  try {
    const result = await logout(req, res);
    console.log(result);
  } catch (error) {
    console.error('Error fetching authenticate:', error);
    res.status(500).json({ error: 'Failed to fetch authenticate' });
  }
});

export default router;
