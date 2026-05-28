const { pool } = require('../db/pool');

// Returns all instruments for a specific user, ordered by creation time
module.exports.listByUser = async (user_id) => {
  const query = 'SELECT * FROM instruments WHERE user_id = $1 ORDER BY instrument_id ASC';
  const { rows } = await pool.query(query, [user_id]);
  return rows;
};

// Returns a single instrument row (used for ownership checks before update/delete)
module.exports.find = async (instrument_id) => {
  const query = 'SELECT * FROM instruments WHERE instrument_id = $1';
  const { rows } = await pool.query(query, [instrument_id]);
  return rows[0] || null;
};

// Creates a new instrument. Returns the full instrument row.
module.exports.create = async (user_id, name, type, nickname) => {
  const query =
    'INSERT INTO instruments (user_id, name, type, nickname) VALUES ($1, $2, $3, $4) RETURNING *';
  const { rows } = await pool.query(query, [user_id, name, type, nickname]);
  return rows[0];
};

// Updates an instrument. Returns the updated row.
module.exports.update = async (instrument_id, { user_id, name, type, nickname }) => {
  const query =
    'UPDATE instruments SET user_id = $1, name = $2, type = $3, nickname = $4 WHERE instrument_id = $5 RETURNING *';
  const { rows } = await pool.query(query, [user_id, name, type, nickname, instrument_id]);
  return rows[0];
};

// Deletes an instrument by id
module.exports.destroy = async (instrument_id) => {
  const query = 'DELETE FROM instruments WHERE instrument_id = $1 RETURNING *';
  const { rows } = await pool.query(query, [instrument_id]);
  return rows[0] || null;
};
