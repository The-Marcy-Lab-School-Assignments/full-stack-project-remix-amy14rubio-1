const pool = require('../db/pool');

// Returns all milestones for a specific user, ordered by creation time
module.exports.listByUser = async (user_id) => {
  const query = 'SELECT * FROM milestones WHERE user_id = $1 ORDER BY milestone_id ASC';
  const { rows } = await pool.query(query, [user_id]);
  return rows;
};

// Returns a single milestone row (used for ownership checks before update/delete)
module.exports.find = async (milestone_id) => {
  const query = 'SELECT * FROM milestones WHERE milestone_id = $1';
  const { rows } = await pool.query(query, [milestone_id]);
  return rows[0] || null;
};

// Creates a new milestone. Returns the full milestone row.
module.exports.create = async (user_id, instrument_id, entry_id, piece_id, title, date) => {
  const query =
    'INSERT INTO milestones (user_id, instrument_id, entry_id, piece_id, title, date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
  const { rows } = await pool.query(query, [
    user_id,
    instrument_id,
    entry_id,
    piece_id,
    title,
    date,
  ]);
  return rows[0];
};

// Updates an milestone. Returns the updated row.
module.exports.update = async (
  milestone_id,
  { user_id, instrument_id, entry_id, piece_id, title, date },
) => {
  const query =
    'UPDATE milestones SET user_id = $1, instrument_id = $2, entry_id = $3, piece_id = $4, title = $5, date = $6 WHERE milestone_id = $7 RETURNING *';
  const { rows } = await pool.query(query, [
    user_id,
    instrument_id,
    entry_id,
    piece_id,
    title,
    date,
    milestone_id,
  ]);
  return rows[0];
};

// Deletes an milestone by id
module.exports.destroy = async (milestone_id) => {
  const query = 'DELETE FROM milestones WHERE milestone_id = $1 RETURNING *';
  const { rows } = await pool.query(query, [milestone_id]);
  return rows[0] || null;
};
