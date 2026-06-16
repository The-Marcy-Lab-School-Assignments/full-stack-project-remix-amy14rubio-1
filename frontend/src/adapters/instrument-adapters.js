import { handleFetch } from './handleFetch.js';

export const fetchAllInstruments = async () => {
  return handleFetch('/api/instruments');
};

export const createInstrument = async (name, type, nickname) => {
  return handleFetch('/api/instruments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, type, nickname }),
  });
};

export const updateInstrument = async (name, type, nickname, instrument_id) => {
  return handleFetch(`/api/instruments/${instrument_id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, type, nickname }),
  });
};

export const deleteInstrument = async (instrument_id) => {
  return handleFetch(`/api/instruments/${instrument_id}`, { method: 'DELETE' });
};
