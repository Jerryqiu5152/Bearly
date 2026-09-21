const express = require('express');
const router = express.Router();

// Static, curated resource list — deliberately NOT user-editable content.
// Keep this reviewed/updated periodically; numbers/services can change.
const RESOURCES = {
  US: {
    country: 'US',
    lifeline: { name: '988 Suicide & Crisis Lifeline', phone: '988', note: 'Call or text 988, 24/7.' },
    textLine: { name: 'Crisis Text Line', sms: '741741', smsBody: 'HOME', note: 'Text HOME to 741741, 24/7.' },
    emergency: { name: 'Emergency Services', phone: '911' },
  },
  UK: {
    country: 'UK',
    lifeline: { name: 'Samaritans', phone: '116123', note: 'Free, 24/7.' },
    textLine: { name: 'SHOUT', sms: '85258', smsBody: 'SHOUT', note: 'Text SHOUT to 85258, 24/7.' },
    emergency: { name: 'Emergency Services', phone: '999' },
  },
  CA: {
    country: 'CA',
    lifeline: { name: 'Talk Suicide Canada', phone: '988', note: 'Call or text 988, 24/7.' },
    textLine: null,
    emergency: { name: 'Emergency Services', phone: '911' },
  },
};

router.get('/resources', (req, res) => {
  const country = (req.query.country || 'US').toUpperCase();
  res.json(RESOURCES[country] || RESOURCES.US);
});

module.exports = router;
