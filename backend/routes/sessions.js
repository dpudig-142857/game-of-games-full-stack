import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'sessions working' });
});

export default router;
