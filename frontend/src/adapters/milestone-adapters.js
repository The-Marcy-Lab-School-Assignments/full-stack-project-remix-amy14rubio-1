import { handleFetch } from './handleFetch.js';

export const fetchAllMilestones = async () => {
  return handleFetch('/api/milestones');
};

export const createMilestone = async (title, date, instrument_id, entry_id, piece_id) => {
  return handleFetch('/api/milestones', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, date, instrument_id, entry_id, piece_id }),
  });
};

export const updateMilestone = async (title, milestone_id) => {
  return handleFetch(`/api/milestones/${milestone_id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
};

export const deleteMilestone = async (milestone_id) => {
  return handleFetch(`/api/milestones/${milestone_id}`, { method: 'DELETE' });
};
