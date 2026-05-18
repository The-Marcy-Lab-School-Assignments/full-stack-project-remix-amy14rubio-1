import { handleFetch } from './handleFetch.js';

export const fetchAllNotes = async () => {
  return handleFetch('/api/notes');
};

export const createNote = async (title, body, instrument_id) => {
  return handleFetch('/api/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, body, instrument_id }),
  });
};

export const updateNote = async (title, body, pinned, note_id) => {
  return handleFetch(`/api/notes/${note_id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, body, pinned }),
  });
};

export const deleteNote = async (note_id) => {
  return handleFetch(`/api/notes/${note_id}`, { method: 'DELETE' });
};
