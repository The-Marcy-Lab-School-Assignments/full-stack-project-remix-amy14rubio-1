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
  if (entry === 'front') {
    return <div className='entry-card front-cover' />;
  } else if (entry === 'back') {
    return <div className='entry-card back-cover' />;
  } else if (!entry) {
    return <div className='entry-card empty-card' />;
  }
  const [isEditing, setIsEditing] = useState(false);

  const [selectedTags, setSelectedTags] = useState([
    ...(entry.instruments || []).map((instrument) => ({
      type: 'instrument',
      id: instrument.instrument_id,
      label: instrument.nickname || instrument.name,
    })),

    ...(entry.pieces || []).map((piece) => ({
      type: 'piece',
      id: piece.piece_id,
      label: piece.title,
    })),
  ]);

  const tagItems = [
    ...(instruments || []).map((instrument) => ({
      type: 'instrument',
      id: instrument.instrument_id,
      label: instrument.nickname || instrument.name,
    })),

    ...(pieces || []).map((piece) => ({
      type: 'piece',
      id: piece.piece_id,
      label: piece.title,
    })),
  ];

  const [formData, setFormData] = useState({
    title: entry.title,
    body: entry.body,
    mood: entry.mood,
    date: entry.date.split('T')[0],
    practice_minutes: entry.practice_minutes,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCancel = () => {
    setSelectedTags([
      ...entry.instruments.map((instrument) => ({
        type: 'instrument',
        id: instrument.instrument_id,
        label: instrument.nickname || instrument.name,
      })),

      ...entry.pieces.map((piece) => ({
        type: 'piece',
        id: piece.piece_id,
        label: piece.title,
      })),
    ]);
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

    const originalInstrumentIds = entry.instruments.map((instrument) => instrument.instrument_id);
    const currentInstrumentIds = selectedTags
      .filter((tag) => tag.type === 'instrument')
      .map((tag) => tag.id);
    const addedInstruments = currentInstrumentIds.filter(
      (id) => !originalInstrumentIds.includes(id),
    );
    const removedInstruments = originalInstrumentIds.filter(
      (id) => !currentInstrumentIds.includes(id),
    );

    const originalPieceIds = entry.pieces.map((piece) => piece.piece_id);
    const currentPieceIds = selectedTags.filter((tag) => tag.type === 'piece').map((tag) => tag.id);
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
      tagItems={tagItems}
      selectedTags={selectedTags}
      onTagsChange={setSelectedTags}
    />
  ) : (
    <EntryDisplay
      entry={entry}
      onEdit={() => setIsEditing(true)}
      loadEntries={loadEntries}
      showControls={showControls}
    />
  );
};

export default EntryCard;
