import express from 'express';
import {  } from '../db/queries.js';
import { pool } from './db/pool.js';

const router = express.Router();

router.get('/db', async (req, res) => {
    try {
        const r = await pool.query('SELECT NOW()');
        res.json({ ok: true, time: r.rows[0].now });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, error: err.message });
    }
});

router.get('/session', (req, res) => {
    try {
        req.session.views = (req.session.views || 0) + 1;
        res.json({ ok: true, session: req.session });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, error: err.message });
    }
});

router.get('/cookie', (req, res) => {
  req.session.test = 'ok';
  res.json({ ok: true });
});

router.get('/raw-cookie', (req, res) => {
  res.cookie('debug', '1', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax'
  });
  res.json({ ok: true });
});

export { router };
