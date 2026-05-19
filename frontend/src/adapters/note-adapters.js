import { handleFetch } from './handleFetch.js';

export const fetchAllNotes = async () => {
  return handleFetch('/api/notes');
};

export const createNote = async (title, body, instrument_id, pinned) => {
  return handleFetch('/api/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, body, instrument_id, pinned }),
  });
};

export const updateNote = async (instrument_id, title, body, pinned, note_id) => {
  return handleFetch(`/api/notes/${note_id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ instrument_id, title, body, pinned }),
  });
};

export const deleteNote = async (note_id) => {
  return handleFetch(`/api/notes/${note_id}`, { method: 'DELETE' });
};
