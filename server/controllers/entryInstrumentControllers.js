const entryInstrumentModel = require('../models/entryInstrumentModel');

// module.exports.listEntryInstruments = async (req, res, next) => {
//   try {
//     const { entry_id } = req.params;
//     console.log(entry_id);
//     const entries = await entryInstrumentModel.listByUser(entry_id);
//     console.log(entries);
//     res.send(entries);
//   } catch (err) {
//     next(err);
//   }
// };

module.exports.createEntryInstrument = async (req, res, next) => {
  try {
    const { entry_id } = req.params;
    const { instrument_id } = req.body;
    // First find the entryInstrument to verify ownership
    const entry = await entryInstrumentModel.find(entry_id);
    if (!entry) return res.status(404).send({ error: 'Entry not found.' });
    if (entry.user_id !== req.session.user_id) {
      return res.status(403).send({ error: 'Not authorized.' });
    }
    const entryInstrument = await entryInstrumentModel.create(entry_id, instrument_id);
    res.status(201).send(entryInstrument);
  } catch (err) {
    next(err);
  }
};

module.exports.deleteEntryInstrument = async (req, res, next) => {
  try {
    const { entry_id, instrument_id } = req.params;
    // First find the entryInstrument to verify ownership
    const entry = await entryInstrumentModel.find(entry_id);
    if (!entry) return res.status(404).send({ error: 'Entry not found.' });
    if (entry.user_id !== req.session.user_id) {
      return res.status(403).send({ error: 'Not authorized.' });
    }
    // Destroy the entryInstrument only after ownership has been verified
    const destroyedEntry = await entryInstrumentModel.destroy(entry_id, instrument_id);
    res.send({ message: 'Instrument removed from entry.' });
  } catch (err) {
    next(err);
  }
};
