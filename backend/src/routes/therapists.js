const express = require('express');
const prisma = require('../lib/prisma');
const authRequired = require('../middleware/auth');

const router = express.Router();

// Only verified providers (verifiedAt set by an admin/back-office process after
// checking license number + state against the relevant licensing board) are exposed.
router.get('/', async (req, res) => {
  const therapists = await prisma.therapist.findMany({
    where: { verifiedAt: { not: null } },
    select: { id: true, name: true, credentials: true, specialty: true, bio: true },
  });
  res.json(therapists);
});

router.post('/:id/request', authRequired, async (req, res) => {
  const therapist = await prisma.therapist.findUnique({ where: { id: req.params.id } });
  if (!therapist || !therapist.verifiedAt) return res.status(404).json({ message: 'Provider not found' });

  const request = await prisma.sessionRequest.create({
    data: { userId: req.userId, therapistId: therapist.id },
  });
  // TODO: notify the provider (email/SMS) and/or hand off to a telehealth platform
  // (e.g. a BAA-covered video provider) rather than building video calling from scratch.
  res.status(201).json(request);
});

module.exports = router;
