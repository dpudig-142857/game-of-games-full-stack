import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import pg from 'pg';
import session from 'express-session';
import pgSession from 'connect-pg-simple';

import sessionsRoutes from './routes/sessions.js';
import statsRoutes from './routes/stats.js';
import playersRoutes from './routes/players.js';
import gamesRoutes from './routes/games.js';
import pointsRoutes from './routes/points.js';
import tournamentRoutes from './routes/tournament.js';
import authRoutes from './routes/auth.js';

dotenv.config();

const pool = new pg.Pool({
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: process.env.PG_DATABASE,
});

const PgSession = pgSession(session);

const photosPath = path.join(process.cwd(), 'photos');

const app = express();

app.use(session({
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
        sameSite: 'none',
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    }
}));
app.use(cors({
    origin: 'http://thegameofgames.win',
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));

app.use('/photos', express.static(photosPath));
app.use('/api/sessions', sessionsRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/players', playersRoutes);
app.use('/api/games', gamesRoutes);
app.use('/api/points', pointsRoutes);
app.use('/api/tournament', tournamentRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
