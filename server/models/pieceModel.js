const pool = require('../db/pool');

// Returns all pieces for a specific user, ordered by creation time
module.exports.listByUser = async (user_id) => {
  const query = 'SELECT * FROM pieces WHERE user_id = $1 ORDER BY piece_id ASC';
  const { rows } = await pool.query(query, [user_id]);
  return rows;
};

// Returns a single piece row (used for ownership checks before update/delete)
module.exports.find = async (piece_id) => {
  const query = 'SELECT * FROM pieces WHERE piece_id = $1';
  const { rows } = await pool.query(query, [piece_id]);
  return rows[0] || null;
};

// Creates a new piece. Returns the full piece row.
module.exports.create = async (user_id, instrument_id, title, composer, status, url) => {
  const query =
    'INSERT INTO pieces (user_id, instrument_id, title, composer, status, url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
  const { rows } = await pool.query(query, [user_id, instrument_id, title, composer, status, url]);
  return rows[0];
};

// Updates an piece. Returns the updated row.
module.exports.update = async (
  piece_id,
  { user_id, instrument_id, title, composer, status, url },
) => {
  const query =
    'UPDATE pieces SET user_id = $1, instrument_id = $2, title = $3, composer = $4, status = $5, url = $6 WHERE piece_id = $7 RETURNING *';
  const { rows } = await pool.query(query, [
    user_id,
    instrument_id,
    title,
    composer,
    status,
    url,
    piece_id,
  ]);
  return rows[0];
};

// Deletes an piece by id
module.exports.destroy = async (piece_id) => {
  const query = 'DELETE FROM pieces WHERE piece_id = $1 RETURNING *';
  const { rows } = await pool.query(query, [piece_id]);
  return rows[0] || null;
};
