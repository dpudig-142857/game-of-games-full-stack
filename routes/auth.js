import express from 'express';
import { requireAuth, login, logout } from '../db/queries.js';

const router = express.Router();

/*router.get('/me', async (req, res) => {
  try {
    const result = await authenticate(req);
    res.json(result);
  } catch (error) {
    console.error('Error fetching authentication:', error);
    res.status(500).json({ error: 'Failed to fetch authentication' });
  }
});*/
router.get('/me', requireAuth(), (req, res) => {
  res.json({
    player_id: req.user.player_id,
    username: req.user.username,
    role: req.user.role
  });
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
    const result = await login(username, password, res);
    if (result.authenticated) {
      res.status(200).json({
        authenticated: result.authenticated,
        user: result.user ?? null,
        text: result.text
      });
    } else {
      res.status(401).json({ error: result.text });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

router.post('/logout', async (req, res) => {
  try {
    const sessionId = req.cookies.gog_session;
  
    const result = await logout(sessionId);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching authenticate:', error);
    res.status(500).json({ error: 'Failed to fetch authenticate' });
  }
});

export default router;
