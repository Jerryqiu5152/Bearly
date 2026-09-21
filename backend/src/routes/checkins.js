const express = require('express');
const prisma = require('../lib/prisma');
const authRequired = require('../middleware/auth');

const router = express.Router();
router.use(authRequired);

const VALID_MOODS = ['great', 'okay', 'meh', 'low', 'struggling'];

router.post('/', async (req, res) => {
  const { mood, note, circleId } = req.body;
  if (!VALID_MOODS.includes(mood)) return res.status(400).json({ message: 'Invalid mood' });

  const checkIn = await prisma.checkIn.create({
    data: { userId: req.userId, mood, note, circleId },
  });

  // A "struggling" check-in is a good moment to gently surface crisis resources
  // client-side, and optionally notify the user's circle — wire that up here.
  res.status(201).json(checkIn);
});

router.get('/feed', async (req, res) => {
  const memberships = await prisma.circleMember.findMany({ where: { userId: req.userId } });
  const circleIds = memberships.map((m) => m.circleId);

  const checkIns = await prisma.checkIn.findMany({
    where: { circleId: { in: circleIds } },
    include: { user: { select: { name: true, handle: true } } },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  res.json(checkIns.map((c) => ({
    id: c.id, mood: c.mood, createdAt: c.createdAt, userName: c.user.name || c.user.handle,
  })));
});

router.get('/friends', async (req, res) => {
  const memberships = await prisma.circleMember.findMany({
    where: { userId: req.userId },
    include: { circle: { include: { members: { include: { user: true } } } } },
  });
  res.json(memberships.flatMap((m) => m.circle.members.map((mem) => mem.user.handle)));
});

// Emergency-contact alert — separate from the crisis hotline, used from the Crisis screen.
router.post('/alert', async (req, res) => {
  const contacts = await prisma.emergencyContact.findMany({ where: { userId: req.userId } });
  // TODO: integrate an SMS provider (e.g. Twilio) to actually send the alert.
  res.json({ notified: contacts.length });
});

module.exports = router;
