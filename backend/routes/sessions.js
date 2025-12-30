import express from 'express';

const router = express.Router();

router.get('/', (req, res) => res.send('root'));
router.get('/home', (req, res) => res.send('home'));
router.get('/continue', (req, res) => res.send('continue'));
router.get('/:id/creating', (req, res) => res.send('creating'));
router.get('/:id/results', (req, res) => res.send('results'));
router.get('/:id', (req, res) => res.send('catch-all'));

export default router;
