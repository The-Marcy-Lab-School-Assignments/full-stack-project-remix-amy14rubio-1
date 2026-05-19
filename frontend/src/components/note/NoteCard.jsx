import { useState } from 'react';
import { deleteNote, updateNote } from '../../adapters/note-adapters';
import NoteDisplay from './NoteDisplay';
import NoteEditForm from './NoteEditForm';

const NoteCard = ({ note, loadNotes, instruments, showControls }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: note.title || '',
    body: note.body || '',
    pinned: note.pinned || false,
  });

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleDelete = async () => {
    const { error } = await deleteNote(note.note_id);
    if (error) return console.error(error);
    await loadNotes();
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const { error } = await updateNote(
      null,
      formData.title,
      formData.body,
      formData.pinned,
      note.note_id,
    );
    if (error) return console.error(error);
    setIsEditing(false);
    await loadNotes();
  };

  const handleCancel = () => {
    setFormData({ title: note.title, body: note.body, pinned: note.pinned });
    setIsEditing(false);
  };

  const instrument = instruments.find((i) => i.instrument_id === note.instrument_id);

  return isEditing ? (
    <NoteEditForm
      formData={formData}
      handleChange={handleChange}
      handleUpdate={handleUpdate}
      onCancel={handleCancel}
    />
  ) : (
    <NoteDisplay
      note={note}
      instrument={instrument}
      onDelete={handleDelete}
      onEdit={() => setIsEditing(true)}
      showControls={showControls}
    />
  );
};

export default NoteCard;
