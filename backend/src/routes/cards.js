const express = require('express');
const prisma = require('../lib/prisma');
const authRequired = require('../middleware/auth');

const router = express.Router();
router.use(authRequired);

router.post('/', async (req, res) => {
  const { recipientHandle, message } = req.body;
  if (!recipientHandle || !message?.trim()) {
    return res.status(400).json({ message: 'recipientHandle and message required' });
  }
  const recipient = await prisma.user.findUnique({ where: { handle: recipientHandle.replace(/^@/, '') } });
  if (!recipient) return res.status(404).json({ message: 'Recipient not found' });

  const card = await prisma.card.create({
    data: { senderId: req.userId, recipientId: recipient.id, message },
  });

  // TODO: trigger push notification to recipient via your push provider (Expo Notifications / FCM / APNs)
  res.status(201).json(card);
});

router.get('/received', async (req, res) => {
  const cards = await prisma.card.findMany({
    where: { recipientId: req.userId },
    include: { sender: { select: { handle: true } } },
    orderBy: { createdAt: 'desc' },
  });
  res.json(cards.map((c) => ({ id: c.id, message: c.message, createdAt: c.createdAt, senderHandle: c.sender.handle })));
});

module.exports = router;
