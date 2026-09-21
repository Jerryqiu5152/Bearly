require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const journalRoutes = require('./routes/journal');
const cardsRoutes = require('./routes/cards');
const checkinsRoutes = require('./routes/checkins');
const companionRoutes = require('./routes/companion');
const therapistsRoutes = require('./routes/therapists');
const crisisRoutes = require('./routes/crisis');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300 })); // basic abuse protection

app.get('/health', (req, res) => res.json({ ok: true }));

// Crisis resources are never rate-limited more strictly and never require auth —
// always reachable even for a logged-out or newly installed app.
app.use('/crisis', crisisRoutes);

app.use('/auth', authRoutes);
app.use('/journal', journalRoutes);
app.use('/cards', cardsRoutes);
app.use('/checkins', checkinsRoutes);
app.use('/companion', companionRoutes);
app.use('/therapists', therapistsRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Bearly API listening on :${PORT}`));
