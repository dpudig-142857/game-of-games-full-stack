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

/*router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await login(req, username, password);
    res.status(200).json({
      authenticated: result.authenticated,
      user: result.user ?? null,
      text: result.text
    });
  } catch (error) {
    console.error('Error fetching authenticate:', error);
    res.status(500).json({ error: 'Failed to fetch authenticate' });
  }
});*/
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const result = await pool.query(
      'SELECT * FROM accounts WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ authenticated: false });
    }

    const user = result.rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);

    if (!ok) {
      return res.status(401).json({ authenticated: false });
    }

    // 🔴 THESE TWO LINES ARE CRITICAL
    req.session.regenerate(err => {
      if (err) return next(err);

      req.session.userId = user.id;

      req.session.save(err => {
        if (err) return next(err);

        res.status(200).json({
          authenticated: true,
          user: {
            id: user.id,
            username: user.username,
            role: user.role
          }
        });
      });
    });

  } catch (err) {
    next(err);
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
