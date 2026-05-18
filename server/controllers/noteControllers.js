const noteModel = require('../models/noteModel');

module.exports.listNotes = async (req, res, next) => {
  try {
    const notes = await noteModel.listByUser(req.session.user_id);
    res.send(notes);
  } catch (err) {
    next(err);
  }
};

module.exports.createNote = async (req, res, next) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).send({ error: 'Title is required.' });
    const note = await noteModel.create(title, req.session.user_id);
    res.status(201).send(note);
  } catch (err) {
    next(err);
  }
};

module.exports.updateNote = async (req, res, next) => {
  try {
    const { note_id } = req.params;
    const note = await noteModel.find(note_id);
    if (!note) return res.status(404).send({ error: 'Note not found.' });
    if (note.user_id !== req.session.user_id) {
      return res.status(403).send({ error: 'Not authorized.' });
    }
    const updatedNote = await noteModel.update(note_id, req.body);
    res.send(updatedNote);
  } catch (err) {
    next(err);
  }
};

module.exports.deleteNote = async (req, res, next) => {
  try {
    const { note_id } = req.params;

    // First find the note to verify ownership
    const note = await noteModel.find(note_id);
    if (!note) return res.status(404).send({ error: 'Note not found.' });
    if (note.user_id !== req.session.user_id) {
      return res.status(403).send({ error: 'Not authorized.' });
    }

    // Destroy the note only after ownership has been verified
    const destroyedNote = await noteModel.destroy(note_id);
    res.send(destroyedNote);
  } catch (err) {
    next(err);
  }
};
