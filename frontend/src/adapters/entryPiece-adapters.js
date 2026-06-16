import { handleFetch } from './handleFetch.js';

export const createEntryPiece = async (entry_id, piece_id) => {
  return handleFetch(`/api/entries/${entry_id}/pieces`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ piece_id }),
  });
};

export const deleteEntryPiece = async (entry_id, piece_id) => {
  return handleFetch(`/api/entries/${entry_id}/pieces/${piece_id}`, { method: 'DELETE' });
};
