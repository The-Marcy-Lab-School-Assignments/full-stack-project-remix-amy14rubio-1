const { pool } = require('../db/pool');

// Returns a single entry row (used for ownership checks before update/delete)
module.exports.find = async (entry_id) => {
  const query = 'SELECT * FROM entries WHERE entry_id = $1';
  const { rows } = await pool.query(query, [entry_id]);
  return rows[0] || null;
};

// Creates a new entry. Returns the full entry row.
module.exports.create = async (entry_id, piece_id) => {
  const query =
    'INSERT INTO entry_pieces (entry_id, piece_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *';
  const { rows } = await pool.query(query, [entry_id, piece_id]);
  return rows[0] || null;
};

// Deletes an entry by id
module.exports.destroy = async (entry_id, piece_id) => {
  const query = 'DELETE FROM entry_pieces WHERE entry_id = $1 AND piece_id = $2 RETURNING *';
  const { rows } = await pool.query(query, [entry_id, piece_id]);
  return rows[0] || null;
};
