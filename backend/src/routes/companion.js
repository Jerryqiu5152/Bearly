const express = require('express');
const prisma = require('../lib/prisma');
const authRequired = require('../middleware/auth');

const router = express.Router();
router.use(authRequired);

const TASK_POINTS = { walk: 10, water: 5, journal: 15, breathe: 10 };

router.get('/', async (req, res) => {
  let companion = await prisma.companion.findUnique({ where: { userId: req.userId } });
  if (!companion) {
    companion = await prisma.companion.create({ data: { userId: req.userId } });
  }
  res.json(withMood(companion));
});

router.post('/tasks/complete', async (req, res) => {
  const { taskType } = req.body;
  const points = TASK_POINTS[taskType];
  if (!points) return res.status(400).json({ message: 'Unknown task type' });

  await prisma.wellnessTaskLog.create({ data: { userId: req.userId, taskType, points } });

  const companion = await prisma.companion.findUnique({ where: { userId: req.userId } });
  const now = new Date();
  const wasYesterday = companion.lastTaskAt &&
    (now.getTime() - new Date(companion.lastTaskAt).getTime()) < 1000 * 60 * 60 * 36;

  const newPoints = companion.points + points;
  const updated = await prisma.companion.update({
    where: { userId: req.userId },
    data: {
      points: newPoints,
      stage: Math.min(3, Math.floor(newPoints / 100)),
      streak: wasYesterday ? companion.streak + 1 : 1,
      lastTaskAt: now,
    },
  });

  res.json(withMood(updated));
});

// Simple derived mood so a few missed days visibly (but gently) affects the companion —
// never punitive, just a nudge back toward care.
function withMood(companion) {
  const hoursSinceCare = companion.lastTaskAt
    ? (Date.now() - new Date(companion.lastTaskAt).getTime()) / 3600000
    : 999;
  const mood = hoursSinceCare > 48 ? 'tired' : hoursSinceCare > 24 ? 'neutral' : 'happy';
  return { ...companion, mood };
}

module.exports = router;
