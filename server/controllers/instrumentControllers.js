const instrumentModel = require('../models/instrumentModel');

module.exports.listInstruments = async (req, res, next) => {
  try {
    const instruments = await instrumentModel.listByUser(req.session.user_id);
    res.send(instruments);
  } catch (err) {
    next(err);
  }
};

// module.exports.showInstrument = async (req, res, next) => {
//   try {
//     const instrument = await instrumentModel.find(req.params.id);
//     if (!instrument) return res.status(404).send({ error: 'Instrument not found.' });
//     res.send(instrument);
//   } catch (err) {
//     next(err);
//   }
// };

module.exports.createInstrument = async (req, res, next) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).send({ error: 'Title is required.' });
    const instrument = await instrumentModel.create(title, req.session.user_id);
    res.status(201).send(instrument);
  } catch (err) {
    next(err);
  }
};

module.exports.updateInstrument = async (req, res, next) => {
  try {
    const { instrument_id } = req.params;
    const instrument = await instrumentModel.find(instrument_id);
    if (!instrument) return res.status(404).send({ error: 'Instrument not found.' });
    if (instrument.user_id !== req.session.user_id) {
      return res.status(403).send({ error: 'Not authorized.' });
    }
    const updatedInstrument = await instrumentModel.update(instrument_id, req.body);
    res.send(updatedInstrument);
  } catch (err) {
    next(err);
  }
};

module.exports.deleteInstrument = async (req, res, next) => {
  try {
    const { instrument_id } = req.params;

    // First find the instrument to verify ownership
    const instrument = await instrumentModel.find(instrument_id);
    if (!instrument) return res.status(404).send({ error: 'Instrument not found.' });
    if (instrument.user_id !== req.session.user_id) {
      return res.status(403).send({ error: 'Not authorized.' });
    }

    // Destroy the instrument only after ownership has been verified
    const destroyedInstrument = await instrumentModel.destroy(instrument_id);
    res.send(destroyedInstrument);
  } catch (err) {
    next(err);
  }
};
