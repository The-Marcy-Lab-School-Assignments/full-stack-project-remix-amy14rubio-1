const { pool } = require('../db/pool');

// Returns all notes for a specific user, ordered by creation time
module.exports.listByUser = async (user_id) => {
  const query = 'SELECT * FROM notes WHERE user_id = $1 ORDER BY note_id ASC';
  const { rows } = await pool.query(query, [user_id]);
  return rows;
};

// Returns a single note row (used for ownership checks before update/delete)
module.exports.find = async (note_id) => {
  const query = 'SELECT * FROM notes WHERE note_id = $1';
  const { rows } = await pool.query(query, [note_id]);
  return rows[0] || null;
};

// Creates a new note. Returns the full note row.
module.exports.create = async (user_id, instrument_id, title, body, pinned) => {
  const query =
    'INSERT INTO notes (user_id, instrument_id, title, body, pinned) VALUES ($1, $2, $3, $4, $5) RETURNING *';
  const { rows } = await pool.query(query, [user_id, instrument_id, title, body, pinned]);
  return rows[0];
};

// Updates an note. Returns the updated row.
module.exports.update = async (note_id, user_id, instrument_id, title, body, pinned) => {
  const query =
    'UPDATE notes SET user_id = $1, instrument_id = $2, title = $3, body = $4, pinned = $5 WHERE note_id = $6 RETURNING *';
  const { rows } = await pool.query(query, [user_id, instrument_id, title, body, pinned, note_id]);
  return rows[0];
};

// Deletes an note by id
module.exports.destroy = async (note_id) => {
  const query = 'DELETE FROM notes WHERE note_id = $1 RETURNING *';
  const { rows } = await pool.query(query, [note_id]);
  return rows[0] || null;
};
