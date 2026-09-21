const express = require('express');
const prisma = require('../lib/prisma');
const authRequired = require('../middleware/auth');

const router = express.Router();
router.use(authRequired);

router.get('/', async (req, res) => {
  const entries = await prisma.journalEntry.findMany({
    where: { userId: req.userId },
    orderBy: { createdAt: 'desc' },
  });
  res.json(entries);
});

router.post('/', async (req, res) => {
  const { body, mood } = req.body;
  if (!body || !body.trim()) return res.status(400).json({ message: 'Entry body required' });

  const entry = await prisma.journalEntry.create({
    data: { userId: req.userId, body, mood },
  });

  // Journaling also counts toward the companion's wellness task.
  await bumpCompanion(req.userId, 'journal', 15);

  res.status(201).json(entry);
});

async function bumpCompanion(userId, taskType, points) {
  await prisma.wellnessTaskLog.create({ data: { userId, taskType, points } });
  const companion = await prisma.companion.findUnique({ where: { userId } });
  if (!companion) return;
  const newPoints = companion.points + points;
  const newStage = Math.min(3, Math.floor(newPoints / 100));
  await prisma.companion.update({
    where: { userId },
    data: { points: newPoints, stage: newStage, lastTaskAt: new Date() },
  });
}

module.exports = router;
