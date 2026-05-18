import { handleFetch } from './handleFetch.js';

export const fetchAllPieces = async () => {
  return handleFetch('/api/pieces');
};

export const fetchPiece = async (piece_id) => {
  return handleFetch(`/api/pieces/${piece_id}`);
};

export const createPiece = async (title, composer, status, url, instrument_id) => {
  return handleFetch('/api/pieces', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, type, nickname }),
  });
};

export const updatePiece = async (title, composer, status, url, instrument_id, piece_id) => {
  return handleFetch(`/api/pieces/${piece_id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, type, nickname }),
  });
};

export const deletePiece = async (piece_id) => {
  return handleFetch(`/api/pieces/${piece_id}`, { method: 'DELETE' });
};
