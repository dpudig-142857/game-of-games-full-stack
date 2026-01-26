import express from 'express';
import {
  requireAuth,
  login,
  logout,
  saveAvatar,
  switchVersion,
  switchPassword
} from '../db/queries.js';

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
    authenticated: true,
    user: req.user
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
    const result = await logout(sessionId, res);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching authenticate:', error);
    res.status(500).json({ error: 'Failed to fetch authenticate' });
  }
});

router.post('/change/username', async (req, res) => {
  const { player_id, username } = req.body;

  try {
    const result = await switchUsername(player_id, username);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error switching username:', error);
    res.status(500).json({ error: 'Failed to switch username' });
  }
});

router.post('/change/password', async (req, res) => {
  const { player_id, old_password, new_password } = req.body;

  try {
    const result = await switchPassword(player_id, old_password, new_password);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error switching password:', error);
    res.status(500).json({ error: 'Failed to switch password' });
  }
});

router.post('/change/avatar', async (req, res) => {
  const { player_id, avatar } = req.body;

  try {
    const result = await saveAvatar(player_id, avatar);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error saving avatar:', error);
    res.status(500).json({ error: 'Failed to save avatar' });
  }
});

router.post('/change/version', async (req, res) => {
  const { player_id, version } = req.body;

  try {
    const result = await switchVersion(player_id, version);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error switching version:', error);
    res.status(500).json({ error: 'Failed to switch version' });
  }
});

export { router };
