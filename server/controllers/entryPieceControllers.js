const entryPieceModel = require('../models/entryPieceModel');

module.exports.createPiece = async (req, res, next) => {
  try {
    const { entry_id } = req.params;
    const { piece_id } = req.body;

    // First find the entryPiece to verify ownership
    const entry = await entryPieceModel.find(entry_id);
    if (!entry) return res.status(404).send({ error: 'Entry not found.' });
    if (entry.user_id !== req.session.user_id) {
      return res.status(403).send({ error: 'Not authorized.' });
    }

    const entryPiece = await entryPieceModel.create(entry_id, piece_id);
    res.status(201).send(entryPiece);
  } catch (err) {
    next(err);
  }
};

module.exports.deletePiece = async (req, res, next) => {
  try {
    const { entry_id, piece_id } = req.params;

    // First find the entryPiece to verify ownership
    const entry = await entryPieceModel.find(entry_id);
    if (!entry) return res.status(404).send({ error: 'Entry not found.' });
    if (entry.user_id !== req.session.user_id) {
      return res.status(403).send({ error: 'Not authorized.' });
    }

    // Destroy the entryPiece only after ownership has been verified
    const destroyedEntry = await entryPieceModel.destroy(entry_id, piece_id);
    res.send({ message: 'Piece removed from entry.' });
  } catch (err) {
    next(err);
  }
};
