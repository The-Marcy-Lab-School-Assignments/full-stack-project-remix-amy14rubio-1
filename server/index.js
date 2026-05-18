const path = require('path');
const express = require('express');
const cookieSession = require('cookie-session');
require('dotenv').config();

const logRoutes = require('./middleware/logRoutes');
const checkAuthentication = require('./middleware/checkAuthentication');

const authControllers = require('./controllers/authControllers');
const entryControllers = require('./controllers/entryControllers');
const entryInstrumentControllers = require('./controllers/entryInstrumentControllers');
const entryPieceControllers = require('./controllers/entryPieceControllers');
const instrumentControllers = require('./controllers/instrumentControllers');
const milestoneControllers = require('./controllers/milestoneControllers');
const noteControllers = require('./controllers/noteControllers');
const pieceControllers = require('./controllers/pieceControllers');

const app = express();

const PORT = process.env.PORT || 8080;

const pathToFrontend = process.env.NODE_ENV === 'production' ? '../frontend/dist' : '../frontend';

// ====================================
// Middleware
// ====================================

app.use(logRoutes);
app.use(
  cookieSession({
    name: 'session',
    secret: process.env.SESSION_SECRET,
    maxAge: 24 * 60 * 60 * 1000,
  }),
);
app.use(express.json());
app.use(express.static(path.join(__dirname, pathToFrontend)));

// ====================================
// Auth routes
// ====================================
app.post('/api/auth/register', authControllers.register);
app.post('/api/auth/login', authControllers.login);
app.get('/api/auth/me', authControllers.getMe);
app.delete('/api/auth/logout', authControllers.logout);

// ====================================
// Entry routes
// ====================================
app.get('/api/entries', checkAuthentication, entryControllers.listEntries);
app.get('/api/entries/:entry_id', checkAuthentication, entryControllers.showEntry);
app.post('/api/entries', checkAuthentication, entryControllers.createEntry);
app.patch('/api/entries/:entry_id', checkAuthentication, entryControllers.updateEntry);
app.delete('/api/entries/:entry_id', checkAuthentication, entryControllers.deleteEntry);

// ====================================
// Entry instrument routes
// ====================================
app.post(
  '/api/entries/:entry_id/instruments',
  checkAuthentication,
  entryInstrumentControllers.createInstrument,
);
app.delete(
  '/api/entries/:entry_id/instruments/:instrument_id',
  checkAuthentication,
  entryInstrumentControllers.deleteInstrument,
);

// ====================================
// Entry piece routes
// ====================================
app.post('/api/entries/:entry_id/pieces', checkAuthentication, entryPieceControllers.createPiece);
app.delete(
  '/api/entries/:entry_id/pieces/:piece_id',
  checkAuthentication,
  entryPieceControllers.deletePiece,
);

// ====================================
// Instrument routes
// ====================================
app.get('/api/instruments', checkAuthentication, instrumentControllers.listInstruments);
app.post('/api/instruments', checkAuthentication, instrumentControllers.createInstrument);
app.patch(
  '/api/instruments/:instrument_id',
  checkAuthentication,
  instrumentControllers.updateInstrument,
);
app.delete(
  '/api/instruments/:instrument_id',
  checkAuthentication,
  instrumentControllers.deleteInstrument,
);

// ====================================
// Piece routes
// ====================================
app.get('/api/pieces', checkAuthentication, pieceControllers.listPieces);
app.get('/api/pieces/:piece_id', checkAuthentication, pieceControllers.showPiece);
app.post('/api/pieces', checkAuthentication, pieceControllers.createPiece);
app.patch('/api/pieces/:piece_id', checkAuthentication, pieceControllers.updatePiece);
app.delete('/api/pieces/:piece_id', checkAuthentication, pieceControllers.deletePiece);

// ====================================
// Note routes
// ====================================
app.get('/api/notes', checkAuthentication, noteControllers.listNotes);
app.post('/api/notes', checkAuthentication, noteControllers.createNote);
app.patch('/api/notes/:note_id', checkAuthentication, noteControllers.updateNote);
app.delete('/api/notes/:note_id', checkAuthentication, noteControllers.deleteNote);

// ====================================
// Milestone routes
// ====================================
app.get('/api/milestones', checkAuthentication, milestoneControllers.listMilestones);
app.post('/api/milestones', checkAuthentication, milestoneControllers.createMilestone);
app.patch(
  '/api/milestones/:milestone_id',
  checkAuthentication,
  milestoneControllers.updateMilestone,
);
app.delete(
  '/api/milestones/:milestone_id',
  checkAuthentication,
  milestoneControllers.deleteMilestone,
);

// ====================================
// Global Error Handler
// ====================================

const handleError = (err, req, res, next) => {
  console.error(err);
  res.status(500).send({ message: 'Internal Server Error' });
};
app.use(handleError);

// ====================================
// Listen
// ====================================

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
