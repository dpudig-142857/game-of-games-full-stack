import express from 'express';
import {
  getAllSessions,
  getNextSession,
  getIncompleteSessions,
  makeActive,
  getCreatingInfo,
  getLogs,
  getContinueLogs,
  getSessionById,
  getSessionResults,
  createSession,
  deleteSession,
  upload420Photo,
  saveSession,
  completeSession,
  intrudeSession,
  abandonSession,
  breakCone,
  victoryCone
} from '../db/queries.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const sessions = await getAllSessions();
        res.json(sessions);
    } catch (error) {
        console.error('Error fetching sessions:', error);
        res.status(500).json({ error: 'Failed to fetch sessions' });
    }
});

router.get('/home', async (req, res) => {
    try {
        const num = await getNextSession();
        res.json(num);
    } catch (error) {
        console.error('Error fetching sessions:', error);
        res.status(500).json({ error: 'Failed to fetch sessions' });
    }
});

router.get('/incomplete', async (req, res) => {
    try {
        const sessions = await getIncompleteSessions();
        res.json(sessions);
    } catch (error) {
        console.error('Error fetching incomplete sessions:', error);
        res.status(500).json({ error: 'Failed to fetch incomplete sessions' });
    }
});

router.get('/logs', async (req, res) => {
    try {
        const logs = await getLogs();
        res.json(logs);
    } catch (error) {
        console.error('Error fetching logs:', error);
        res.status(500).json({ error: 'Failed to fetch logs' });
    }
});

router.get('/continue', async (req, res) => {
    try {
        const logs = await getContinueLogs();
        res.json(logs);
    } catch (error) {
        console.error('Error fetching logs:', error);
        res.status(500).json({ error: 'Failed to fetch logs' });
    }
});

router.get('/:id/creating', async (req, res) => {
    try {
        const info = await getCreatingInfo(req.params.id);
        res.json(info);
    } catch (error) {
        console.error('Error fetching creating info:', error);
        res.status(500).json({ error: 'Failed to fetch creating info' });
    }
});

router.get('/:id/results', async (req, res) => {
    try {
        const results = await getSessionResults(req.params.id);
        res.json(results);
    } catch (error) {
        console.error('Error fetching session results:', error);
        res.status(500).json({ error: 'Failed to fetch session results' });
    }
});

/*router.put('/:id/players', async (req, res) => {
    try {

    } catch (error) {
        console.error('Error putting players for ')
    }
});*/

router.post('/', async (req, res) => {
    try {
        const sessionId = await createSession(req.body);
        res.status(201).json({ sessionId });
    } catch (error) {
        console.error('Error creating session:', error);
        res.status(500).json({ error: 'Failed to create session' });
    }
});

router.post('/:id/continue/active', async (req, res) => {
    try {
        const success = await makeActive(req.params.id);
        res.status(201).json({ success });
    } catch (error) {
        console.log('Error continuing session:', error);
        res.status(500).json({ error: 'Failed to continue session' });
    }
});

router.post('/:id/continue/complete', async (req, res) => {
    try {
        const success = await makeActive(req.params.id);
        res.status(201).json({ success });
    } catch (error) {
        console.log('Error continuing session:', error);
        res.status(500).json({ error: 'Failed to continue session' });
    }
});

router.post('/:id/delete', async (req, res) => {
    try {
        const success = await deleteSession(req.params.id);
        res.status(201).json({ success });
    } catch (error) {
        console.error('Error creating session:', error);
        res.status(500).json({ error: 'Failed to delete session' });
    }
});

router.post('/:id/upload', async (req, res) => {
    try {
        const save = await upload420Photo(req.params.id, req.body);
        res.json({ save });
    } catch (error) {
        console.error('Error saving 4:20 Game Photo', error);
        res.status(500).json({ error: 'Failed to save 4:20 Game Photo' });
    }
});

router.post('/:id/save', async (req, res) => {
    try {
        const save = await saveSession(req.params.id, req.body);
        res.json({ save });
    } catch (error) {
        console.error('Error saving game:', error);
        res.status(500).json({ error: 'Failed to save game' });
    }
});

router.post('/:id/complete', async (req, res) => {
    try {
        const success = await completeSession(req.params.id, req.body);
        res.json({ success });
    } catch (error) {
        console.error('Error completing session:', error);
        res.status(500).json({ error: 'Failed to complete session' });
    }
});

router.post('/:id/intrude', async (req, res) => {
    try {
        const success = await intrudeSession(req.params.id, req.body);
        res.json({ success });
    } catch (error) {
        console.error('Error intruding session:', error);
        res.status(500).json({ error: 'Failed to intrude session' });
    }
});

router.post('/:id/abandon', async (req, res) => {
    try {
        const success = await abandonSession(req.params.id, req.body);
        res.json({ success });
    } catch (error) {
        console.error('Error intruding session:', error);
        res.status(500).json({ error: 'Failed to intrude session' });
    }
});

router.post('/:id/break_cone', async (req, res) => {
    try {
        const success = await breakCone(req.params.id, req.body);
        res.json({ success });
    } catch (error) {
        console.error('Error with break cone:', error);
        res.status(500).json({ error: 'Failed to do break cone' });
    }
});

router.post('/:id/victory_cone', async (req, res) => {
    try {
        const success = await victoryCone(req.params.id, req.body);
        res.json({ success });
    } catch (error) {
        console.error('Error with victory cone:', error);
        res.status(500).json({ error: 'Failed to do victory cone' });
    }
});

/*router.put('/:id', async (req, res) => {
    try {
        
    }
});*/

router.get('/:id', async (req, res) => {
    try {
        const session = await getSessionById(req.params.id);
        if (!session) return res.status(404).json({ error: 'Session not found' });
        res.json(session);
    } catch (error) {
        console.error('Error fetching session by ID:', error);
        res.status(500).json({ error: 'Failed to fetch session' });
    }
});

export default router;
