import express from 'express';
import { getAllPointsSystem } from '../db/queries.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const pointsSystem = await getAllPointsSystem();
        res.json(pointsSystem);
    } catch (error) {
        console.error('Error fetching points system:', error);
        res.status(500).json({ error: 'Failed to fetch points system' });
    }
});

export { router };