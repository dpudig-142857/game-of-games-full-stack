import express from 'express';
import { getAllPlayers, getPlayerById, createPlayer } from '../db/queries.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const players = await getAllPlayers();
        res.json(players);
    } catch (error) {
        console.error('Error fetching players:', error);
        res.status(500).json({ error: 'Failed to fetch players' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const player = await getPlayerById(req.params.id);
        if (!player) return res.status(404).json({ error: 'Player not found' });
        res.json(player);
    } catch (error) {
        console.error('Error fetching player by ID:', error);
        res.status(500).json({ error: 'Failed to fetch player' });
    }
});

router.post('/', async (req, res) => {
    try {
        const playerId = await createPlayer(req.body);
        res.status(201).json({ playerId });
    } catch (error) {
        console.log('Error creating player:', error);
        res.status(500).json({ error: 'Failed to create player' });
    }
});

export default router;
