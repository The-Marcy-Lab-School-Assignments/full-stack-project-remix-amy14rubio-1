import { handleFetch } from './handleFetch.js';

export const fetchAllEntries = async () => {
  return handleFetch('/api/entries');
};

export const fetchEntry = async (entry_id) => {
  return handleFetch(`/api/entries/${entry_id}`);
};

export const createEntry = async (
  date,
  title,
  body,
  mood,
  practice_minutes,
  is_private,
  instrument_ids,
) => {
  return handleFetch('/api/entries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ date, title, body, mood, practice_minutes, is_private, instrument_ids }),
  });
};

export const updateEntry = async (entry_id, title, body, mood, date, practice_minutes) => {
  return handleFetch(`/api/entries/${entry_id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, body, mood, date, practice_minutes }),
  });
};

export const deleteEntry = async (entry_id) => {
  return handleFetch(`/api/entries/${entry_id}`, { method: 'DELETE' });
};
