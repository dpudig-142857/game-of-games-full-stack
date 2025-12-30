import express from 'express';

import {
    getAllSessions
} from '../db/queries.js';

const router = express.Router();

router.get('/', async (req, res) => res.send('root'));

router.get('/home', async (req, res) => res.send('home'));

router.get('/incomplete', async (req, res) => res.send('incomplete'));

router.get('/logs', async (req, res) => res.send('logs'));

router.get('/continue', async (req, res) => res.send('continue'));

router.get('/:id/creating', async (req, res) => res.send('id creating'));

router.get('/:id/results', async (req, res) => res.send('id results'));

router.post('/', async (req, res) => res.send('post /'));

router.post('/:id/continue/active', async (req, res) => res.send('post id continue active'));

router.post('/:id/continue/complete', async (req, res) => res.send('post id continue complete'));

router.post('/:id/delete', async (req, res) => res.send('post id delete'));

router.post('/:id/upload', async (req, res) => res.send('post id upload'));

router.post('/:id/save', async (req, res) => res.send('post id save'));

router.post('/:id/complete', async (req, res) => res.send('post id complete'));

router.post('/:id/intrude', async (req, res) => res.send('post id intrude'));

router.post('/:id/abandon', async (req, res) => res.send('post id abandon'));

router.post('/:id/break_cone', async (req, res) => res.send('post id break_cone'));

router.post('/:id/victory_cone', async (req, res) => res.send('post id victory_cone'));

router.get('/:id', async (req, res) => res.send('id'));

export { router };
