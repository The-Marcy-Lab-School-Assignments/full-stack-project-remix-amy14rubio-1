const entryModel = require('../models/entryModel');
const entryInstrumentModel = require('../models/entryInstrumentModel');

module.exports.listEntries = async (req, res, next) => {
  try {
    const entries = await entryModel.listByUser(req.session.user_id);
    res.send(entries);
  } catch (err) {
    next(err);
  }
};

module.exports.showEntry = async (req, res, next) => {
  try {
    const entry = await entryModel.find(req.params.entry_id);
    if (!entry) return res.status(404).send({ error: 'Entry not found.' });
    res.send(entry);
  } catch (err) {
    next(err);
  }
};

module.exports.createEntry = async (req, res, next) => {
  try {
    const { date, title, body, mood, practice_minutes, is_private, instrument_ids } = req.body;
    if (!title || !date) return res.status(400).send({ error: 'Title and date are required.' });

    const entry = await entryModel.create(
      req.session.user_id,
      date,
      title,
      body,
      mood,
      practice_minutes,
      is_private,
    );

    if (instrument_ids && instrument_ids.length > 0) {
      await Promise.all(
        instrument_ids.map((instrument_id) =>
          entryInstrumentModel.create(entry.entry_id, instrument_id),
        ),
      );
    }

    res.status(201).send(entry);
  } catch (err) {
    console.log('error here');
    next(err);
  }
};

module.exports.updateEntry = async (req, res, next) => {
  try {
    const { entry_id } = req.params;
    const entry = await entryModel.find(entry_id);
    if (!entry) return res.status(404).send({ error: 'Entry not found.' });
    if (entry.user_id !== req.session.user_id) {
      return res.status(403).send({ error: 'Not authorized.' });
    }
    const updatedEntry = await entryModel.update(entry_id, req.session.user_id, req.body);
    res.send(updatedEntry);
  } catch (err) {
    next(err);
  }
};

module.exports.deleteEntry = async (req, res, next) => {
  try {
    const { entry_id } = req.params;

    // First find the entry to verify ownership
    const entry = await entryModel.find(entry_id);
    if (!entry) return res.status(404).send({ error: 'Entry not found.' });
    if (entry.user_id !== req.session.user_id) {
      return res.status(403).send({ error: 'Not authorized.' });
    }

    // Destroy the entry only after ownership has been verified
    const destroyedEntry = await entryModel.destroy(entry_id);
    res.send(destroyedEntry);
  } catch (err) {
    next(err);
  }
};
