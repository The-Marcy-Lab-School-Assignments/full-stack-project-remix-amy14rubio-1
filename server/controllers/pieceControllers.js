const pieceModel = require('../models/pieceModel');
const { scrapeLinkPreview } = require('../services/linkPreviewService.js');
const { getProvider } = require('../services/getProvider.js');
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
    const { title, instrument_id, composer, status, recording_url, sheet_music_url } = req.body;
    if (!title) return res.status(400).send({ error: 'Title is required.' });
    let preview = {
      title: null,
      thumbnail: null,
    };
    if (sheet_music_url) {
      preview = await scrapeLinkPreview(sheet_music_url);
    }
    const provider = sheet_music_url ? getProvider(sheet_music_url) : null;

    const piece = await pieceModel.create(
      req.session.user_id,
      instrument_id,
      title,
      composer,
      status,
      recording_url,
      sheet_music_url,
      preview.title,
      preview.thumbnail,
      provider,
    );
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

module.exports.uploadFile = async (req, res, next) => {
  try {
    const pieceId = req.params.piece_id;
    const userId = req.session.user_id;
    const { buffer, originalname, mimetype } = req.file;

    const piece = await pieceModel.uploadPieceFile(pieceId, buffer, originalname, mimetype, userId);

    res.json(piece);
  } catch (err) {
    next(err);
  }
};

module.exports.getPieceLinkPreview = async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({
        error: 'URL required',
      });
    }

    try {
      new URL(url);
    } catch {
      return res.status(400).json({
        error: 'Invalid URL',
      });
    }

    const preview = await scrapeLinkPreview(url);

    res.json(preview);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: 'Failed to fetch preview',
    });
  }
};
