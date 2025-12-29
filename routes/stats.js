import express from 'express';
import { getStats } from '../db/queries.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const stats = await getStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching all player stats:', error);
    res.status(500).json({ error: 'Failed to fetch player stats' });
  }
});

export default router;
