import { useState } from 'react';
import { deleteEntry, updateEntry } from '../../adapters/entry-adapters';
import {
  createEntryInstrument,
  deleteEntryInstrument,
} from '../../adapters/entryInstrument-adapters';
import { createEntryPiece, deleteEntryPiece } from '../../adapters/entryPiece-adapters';

import EntryDisplay from './EntryDisplay';
import EntryEditForm from './EntryEditForm';

const EntryCard = ({ entry, loadEntries, instruments, pieces, showControls }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentInstruments, setCurrentInstruments] = useState(entry.instruments);
  const [currentPieces, setCurrentPieces] = useState(entry.pieces);

  const [formData, setFormData] = useState({
    title: entry.title,
    body: entry.body,
    mood: entry.mood,
    date: entry.date.split('T')[0],
    practice_minutes: entry.practice_minutes,
  });

  const handleDelete = async () => {
    const { error } = await deleteEntry(entry.entry_id);
    if (error) return console.error(error);
    await loadEntries();
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCancel = () => {
    setCurrentInstruments(entry.instruments);
    setCurrentPieces(entry.pieces);
    setFormData({
      title: entry.title,
      body: entry.body,
      mood: entry.mood,
      date: entry.date.split('T')[0],
      practice_minutes: entry.practice_minutes,
    });
    setIsEditing(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const { error } = await updateEntry(
      entry.entry_id,
      formData.title,
      formData.body,
      formData.mood,
      formData.date,
      formData.practice_minutes,
    );

    if (error) return console.error(error);

    const originalInstIds = entry.instruments.map((instrument) => instrument.instrument_id);
    const currentInstIds = currentInstruments.map((instrument) => instrument.instrument_id);
    const addedInstruments = currentInstIds.filter((id) => !originalInstIds.includes(id));
    const removedInstruments = originalInstIds.filter((id) => !currentInstIds.includes(id));

    const originalPieceIds = entry.pieces.map((piece) => piece.piece_id);
    const currentPieceIds = currentPieces.map((piece) => piece.piece_id);
    const addedPieces = currentPieceIds.filter((id) => !originalPieceIds.includes(id));
    const removedPieces = originalPieceIds.filter((id) => !currentPieceIds.includes(id));

    await Promise.all([
      ...addedInstruments.map((instrument_id) =>
        createEntryInstrument(entry.entry_id, instrument_id),
      ),
      ...removedInstruments.map((instrument_id) =>
        deleteEntryInstrument(entry.entry_id, instrument_id),
      ),
      ...addedPieces.map((piece_id) => createEntryPiece(entry.entry_id, piece_id)),
      ...removedPieces.map((piece_id) => deleteEntryPiece(entry.entry_id, piece_id)),
    ]);

    setIsEditing(false);
    await loadEntries();
  };

  return isEditing ? (
    <EntryEditForm
      formData={formData}
      handleChange={handleChange}
      handleUpdate={handleUpdate}
      onCancel={handleCancel}
      entry={entry}
      instruments={instruments}
      onInstrumentsChange={setCurrentInstruments}
      pieces={pieces}
      onPiecesChange={setCurrentPieces}
    />
  ) : (
    <EntryDisplay
      entry={entry}
      onDelete={handleDelete}
      onEdit={() => setIsEditing(true)}
      loadEntries={loadEntries}
      showControls={showControls}
    />
  );
};

export default EntryCard;
