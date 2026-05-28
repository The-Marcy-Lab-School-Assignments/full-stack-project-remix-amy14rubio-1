import { handleFetch } from './handleFetch.js';

export const fetchAllPieces = async () => {
  return handleFetch('/api/pieces');
};

export const fetchPiece = async (piece_id) => {
  return handleFetch(`/api/pieces/${piece_id}`);
};

export const createPiece = async (
  instrument_id,
  title,
  composer,
  status,
  recording_url,
  sheet_music_url,
) => {
  return handleFetch('/api/pieces', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      instrument_id,
      title,
      composer,
      status,
      recording_url,
      sheet_music_url,
    }),
  });
};

export const updatePiece = async (
  instrument_id,
  title,
  composer,
  status,
  recording_url,
  piece_id,
) => {
  return handleFetch(`/api/pieces/${piece_id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ instrument_id, title, composer, status, recording_url }),
  });
};

export const deletePiece = async (piece_id) => {
  return handleFetch(`/api/pieces/${piece_id}`, { method: 'DELETE' });
};

export const uploadPieceFile = async (pieceId, file) => {
  const formData = new FormData();
  formData.append('file', file); // matches upload.single('file') in the route

  const res = await fetch(`/api/pieces/${pieceId}/upload`, {
    method: 'POST',
    body: formData,
  });

  return res.json();
};

export const fetchPieceLinkPreview = async (url) => {
  return handleFetch(`/api/pieces/link-preview?url=${encodeURIComponent(url)}`);
};
