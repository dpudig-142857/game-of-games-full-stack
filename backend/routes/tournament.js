import express from 'express';
import { BracketsManager } from 'brackets-manager';
import { JsonDatabase } from 'brackets-json-db';

let storage = new JsonDatabase();
let manager = new BracketsManager(storage);
const router = express.Router();

/*function resetBracketData(id) {
    const keys = ['participant', 'stage', 'group', 'round', 'match'];
    for (const key of keys) {
        if (Array.isArray(storage.internal.data[key])) {
            storage.internal.data[key] = storage.internal.data[key].filter(item => {
                return item.tournament_id != id;
            });
        }
    }
}*/

async function resetBracketData(id) {
    try {
        await manager.delete.tournament(id);
        console.log(`Tournament ${id} deleted successfully.`);
    } catch (err) {
        console.warn(`No existing tournament with ID ${id} to delete.`, err.message);
    }
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
    const { players, sessionId, game, id } = req.body;
    await resetBracketData(id);

    let paddedPlayers = players[0]?.name
        ? padToPowerOfTwo(players.map(p => p.name))
        : padToPowerOfTwo(players);

    console.log(players);
    console.log(paddedPlayers);

    try {
        const tournament = await manager.create.stage({
            tournamentId: id,
            name: `Game of Games No. ${sessionId} - ${game}`,
            type: 'double_elimination',
            seeding: paddedPlayers,
            settings: { grandFinal: 'double', },
        });

        res.json({ success: true, tournamentId: id, tournament });
    } catch (error) {
        console.error('Error creating tournament:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/tournament/:id
router.get('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const data = await manager.get.tournamentData(id);
        res.json({ bracket: data });
    } catch (err) {
        console.error('Error retrieving tournament data:', err);
        res.status(500).json({ error: 'Failed to retrieve tournament' });
    }
});

// GET /api/tournament/:id/results
router.get('/:id/results', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const data = await manager.get.tournamentData(id);
        const stages = data.stage;

        if (!stages || stages.length === 0) {
            return res.status(404).json({ error: 'No stages found for tournament' });
        }

        const stageId = stages[0].id;
        const standings = await manager.get.finalStandings(stageId);

        res.json(standings);
    } catch (err) {
        console.error(`Error retrieving tournament results: ${err}`);
        res.status(500).json({ error: 'Failed to retrieve tournament results' });
    }
});

// POST /api/tournament/:id/update
router.post('/:id/update', async (req, res) => {
    try {
        const tournamentId = req.params.id;
        const { matchId, winnerId, scores } = req.body;
        const match = (await manager.storage.select('match')).find(m => m.id === Number(matchId));
        if (!match) {
            console.error('Match not found');
            return res.status(404).json({ error: 'Match not found' });
        }

        const isOpp1 = Number(winnerId) == match.opponent1.id;

        if (scores) {
            await manager.update.match({
                id: Number(matchId),
                opponent1: {
                    result: isOpp1 ? 'win' : 'loss',
                    score: scores[match.opponent1.id]
                },
                opponent2: {
                    result: isOpp1 ? 'loss' : 'win',
                    score: scores[match.opponent2.id]
                },
            });
        } else {
            await manager.update.match({
                id: Number(matchId),
                opponent1: { result: isOpp1 ? 'win' : 'loss', },
                opponent2: { result: isOpp1 ? 'loss' : 'win', },
            });
        }

        res.json({ success: true });
    } catch (err) {
        console.error('Error updating match result:', err);
        res.status(500).json({ error: 'Failed to update match' });
    }
});

/*router.post('/update-scores', async (req, res) => {
    const { matchId, scores } = req.body;

    try {
        const match = await manager.find.match(Number(matchId));
        const opp1 = match.opponent1?.id;
        const opp2 = match.opponent2?.id;

        await manager.update.match({
            id: Number(matchId),
            opponent1: { score: scores[opp1] || 0 },
            opponent2: { score: scores[opp2] || 0 }
        });

        res.json({ success: true });
    } catch (err) {
        console.error('Error updating scores:', err);
        res.status(500).json({ error: 'Failed to update scores' });
    }
});*/

export default router;
