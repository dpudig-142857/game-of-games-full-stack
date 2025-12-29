import express from 'express';
import { getAllGames, getGameById } from '../db/queries.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const games = await getAllGames();
        res.json(games);
    } catch (error) {
        console.error('Error fetching games:', error);
        res.status(500).json({ error: 'Failed to fetch games' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const game = await getGameById(req.params.id);
        if (!game) return res.status(404).json({ error: 'Game not found' });
        res.json(game);
    } catch (error) {
        console.error('Error fetching game by ID:', error);
        res.status(500).json({ error: 'Failed to fetch game' });
    }
});

export default router;
