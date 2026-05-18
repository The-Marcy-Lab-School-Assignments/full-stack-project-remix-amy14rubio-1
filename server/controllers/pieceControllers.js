const pieceModel = require('../models/pieceModel');

module.exports.listPieces = async (req, res, next) => {
  try {
    const pieces = await pieceModel.listByUser(req.session.user_id);
    res.send(pieces);
  } catch (err) {
    next(err);
  }
};

module.exports.showPiece = async (req, res, next) => {
  try {
    const piece = await pieceModel.find(req.params.piece_id);
    if (!piece) return res.status(404).send({ error: 'Piece not found.' });
    res.send(piece);
  } catch (err) {
    next(err);
  }
};

module.exports.createPiece = async (req, res, next) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).send({ error: 'Title is required.' });
    const piece = await pieceModel.create(title, req.session.user_id);
    res.status(201).send(piece);
  } catch (err) {
    next(err);
  }
};

module.exports.updatePiece = async (req, res, next) => {
  try {
    const { piece_id } = req.params;
    const piece = await pieceModel.find(piece_id);
    if (!piece) return res.status(404).send({ error: 'Piece not found.' });
    if (piece.user_id !== req.session.user_id) {
      return res.status(403).send({ error: 'Not authorized.' });
    }
    const updatedPiece = await pieceModel.update(piece_id, req.body);
    res.send(updatedPiece);
  } catch (err) {
    next(err);
  }
};

module.exports.deletePiece = async (req, res, next) => {
  try {
    const { piece_id } = req.params;

    // First find the piece to verify ownership
    const piece = await pieceModel.find(piece_id);
    if (!piece) return res.status(404).send({ error: 'Piece not found.' });
    if (piece.user_id !== req.session.user_id) {
      return res.status(403).send({ error: 'Not authorized.' });
    }

    // Destroy the piece only after ownership has been verified
    const destroyedPiece = await pieceModel.destroy(piece_id);
    res.send(destroyedPiece);
  } catch (err) {
    next(err);
  }
};
