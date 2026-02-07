import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

//import pg from 'pg';
import session from 'express-session';
import pgSession from 'connect-pg-simple';

import cookieParser from "cookie-parser";

import { router as sessionsRoutes } from './routes/sessions.js';
import { router as statsRoutes } from './routes/stats.js';
import { router as playersRoutes } from './routes/players.js';
import { router as gamesRoutes } from './routes/games.js';
import { router as pointsRoutes } from './routes/points.js';
import { router as tournamentRoutes } from './routes/tournament.js';
import { router as userRoutes } from './routes/user.js';
import { router as debugRoutes } from './routes/debug.js';

import { pool } from './db/pool.js';

dotenv.config();

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
app.use('/api/user', userRoutes);
app.use('/debug', debugRoutes);

export default app;
