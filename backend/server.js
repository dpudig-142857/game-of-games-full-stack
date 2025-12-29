import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import pg from 'pg';
import session from 'express-session';
import pgSession from 'connect-pg-simple';

import cookieParser from "cookie-parser";

import sessionsRoutes from './routes/sessions.js';
import statsRoutes from './routes/stats.js';
import playersRoutes from './routes/players.js';
import gamesRoutes from './routes/games.js';
import pointsRoutes from './routes/points.js';
import tournamentRoutes from './routes/tournament.js';
import authRoutes from './routes/auth.js';

dotenv.config();

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  }
});

const PgSession = pgSession(session);

const photosPath = path.join(process.cwd(), 'photos');

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(cors({
    origin: 'https://thegameofgames.win',
    credentials: true
}));
app.set('trust proxy', 1);
app.use(session({
    proxy: true,
    store: new PgSession({
        pool,
        tableName: 'user_sessions'
    }),
    name: 'gameofgames.sid',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    }
}));

app.use('/photos', express.static(photosPath));
app.use('/api/sessions', sessionsRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/players', playersRoutes);
app.use('/api/games', gamesRoutes);
app.use('/api/points', pointsRoutes);
app.use('/api/tournament', tournamentRoutes);
app.use('/api/auth', authRoutes);

app.get('/debug/db', async (req, res) => {
    try {
        const r = await pool.query('SELECT NOW()');
        res.json({ ok: true, time: r.rows[0].now });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, error: err.message });
    }
});

app.get('/debug/session', (req, res) => {
    try {
        req.session.views = (req.session.views || 0) + 1;
        res.json({ ok: true, session: req.session });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, error: err.message });
    }
});

app.get('/debug/cookie', (req, res) => {
  req.session.test = 'ok';
  res.json({ ok: true });
});

app.get('/debug/raw-cookie', (req, res) => {
  res.cookie('debug', '1', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax'
  });
  res.json({ ok: true });
});

export default app;
