import express from 'express';
import { BracketsManager } from 'brackets-manager';
import { InMemoryDatabase } from 'brackets-memory-db';
import { pool } from '../db/pool.js';

const router = express.Router();

function createManager(bracketData = null) {
    const storage = new InMemoryDatabase();
    if (bracketData) storage.data = bracketData;
    return new BracketsManager(storage);
}

function padToPowerOfTwo(players) {
    let pad = [...players];
    const count = players.length;
    const nextPower = Math.pow(2, Math.ceil(Math.log2(count)));
    const byesNeeded = nextPower - count;

    for (let i = 0; i < byesNeeded; i++) {
        pad.push(`BYE ${i + 1}`);
    }

    return pad;
}

// POST /api/tournament/create
router.post('/create', async (req, res) => {
    const { players, sessionId, game, num } = req.body;

    let paddedPlayers = players[0]?.name
        ? padToPowerOfTwo(players.map(p => p.name))
        : padToPowerOfTwo(players);

    console.log(players);
    console.log(paddedPlayers);

    try {
        const manager = createManager();
        const allIds = await pool.query(`SELECT id FROM tournaments;`)
        const sessionIds = await pool.query(`
            SELECT id FROM tournaments WHERE game = $1 AND session_id = $2;
        `, [
            game,
            sessionId
        ]);
        const ids = sessionIds.rows;
        const id = ids.length == 0 ? allIds.rows.length + 1 : ids.at(-1);

        const tournament = await manager.create.stage({
            tournamentId: id,
            name: `Game of Games No. ${sessionId} - ${game}`,
            type: 'double_elimination',
            seeding: paddedPlayers,
            settings: { grandFinal: 'double' },
        });

        await pool.query(`
            INSERT INTO tournaments (id, game, session_id, bracket, game_number)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (id)
            DO UPDATE SET
              bracket = EXCLUDED.bracket,
              updated_at = NOW()
        `, [
            id, game, sessionId, JSON.stringify(manager.storage.data), num
        ]);

        res.json({ success: true, tournamentId: id, tournament });
    } catch (error) {
        console.error('Error creating tournament:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/tournament/:id/results
router.get('/:id/results', async (req, res) => {
    try {
        const id = Number(req.params.id);

        const { rows } = await pool.query(
            `SELECT bracket FROM tournaments WHERE id = $1`,
            [id]
        );
        console.log(rows)

        if (!rows.length) {
            return res.status(404).json({ error: 'Tournament not found' });
        }

        const manager = createManager(rows[0].bracket);
        const stages = await manager.storage.select('stage');
        const standings = await manager.get.finalStandings(stages[0].id);

        res.json(standings);
    } catch (err) {
        console.error(`Error retrieving tournament results: ${err}`);
        console.error(`${err.stack}`);
        res.status(500).json({ error: 'Failed to retrieve tournament results' });
    }
});

// GET /api/tournament/session/:id
router.get('/session/:id', async (req, res) => {
    try {
        const sessionId = Number(req.params.id);
        const { rows } = await pool.query(`
            SELECT game_number, game_instance_id, bracket
            FROM tournaments
            WHERE session_id = $1;
        `, [
            sessionId
        ]);

        if (!rows.length) {
            return res.status(404).json({ error: 'No tournaments found' });
        }

        res.json(rows);
    } catch (err) {
        console.error(`Error retrieving tournament results: ${err}`);
        res.status(500).json({ error: 'Failed to retrieve tournament results' });
    }
});

// POST /api/tournament/:id/update
router.post('/:id/update', async (req, res) => {
    try {
        const tournamentId = Number(req.params.id);
        const { matchId, winnerId, scores } = req.body;

        const { rows } = await pool.query(
            `SELECT bracket FROM tournaments WHERE id = $1`,
            [tournamentId]
        );

        if (!rows.length) {
            return res.status(404).json({ error: 'Tournament not found' });
        }

        const manager = createManager(rows[0].bracket);

        const match = (await manager.storage.select('match'))
            .find(m => m.id === Number(matchId));

        if (!match) {
            return res.status(404).json({ error: 'Match not found' });
        }

        const isOpp1 = Number(winnerId) === match.opponent1.id;

        await manager.update.match({
            id: Number(matchId),
            opponent1: {
                result: isOpp1 ? 'win' : 'loss',
                score: scores?.[match.opponent1.id],
            },
            opponent2: {
                result: isOpp1 ? 'loss' : 'win',
                score: scores?.[match.opponent2.id],
            },
        });

        await pool.query(
            `UPDATE tournaments SET bracket = $1, updated_at = NOW() WHERE id = $2`,
            [JSON.stringify(manager.storage.data), tournamentId]
        );

        res.json({ success: true });
    } catch (err) {
        console.error('Error updating match result:', err);
        res.status(500).json({ error: 'Failed to update match' });
    }
});

// GET /api/tournament/:id
router.get('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { rows } = await pool.query(`
            SELECT bracket FROM tournaments WHERE id = $1
        `, [id]);

        if (!rows.length) {
            return res.status(404).json({ error: 'Tournament not found' });
        }

        res.json({ bracket: rows[0].bracket });
    } catch (err) {
        console.error('Error retrieving tournament data:', err);
        res.status(500).json({ error: 'Failed to retrieve tournament' });
    }
});

export { router };
