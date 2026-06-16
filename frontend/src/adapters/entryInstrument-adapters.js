import { handleFetch } from './handleFetch.js';

export const createEntryInstrument = async (entry_id, instrument_id) => {
  return handleFetch(`/api/entries/${entry_id}/instruments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ instrument_id }),
  });
};

export const deleteEntryInstrument = async (entry_id, instrument_id) => {
  return handleFetch(`/api/entries/${entry_id}/instruments/${instrument_id}`, { method: 'DELETE' });
};
