const pool = require('../db/pool');

// Returns all entries for a specific user, ordered by creation time
module.exports.listByUser = async (user_id) => {
  const query = 'SELECT * FROM entries WHERE user_id = $1 ORDER BY entry_id ASC';
  const { rows } = await pool.query(query, [user_id]);
  return rows;
};

// Returns a single entry row (used for ownership checks before update/delete)
module.exports.find = async (entry_id) => {
  const query = 'SELECT * FROM entries WHERE entry_id = $1';
  const { rows } = await pool.query(query, [entry_id]);
  return rows[0] || null;
};

// Creates a new entry. Returns the full entry row.
module.exports.create = async (user_id, date, title, body, mood, practice_minutes, is_private) => {
  const query =
    'INSERT INTO entries (user_id, date, title, body, mood, practice_minutes, is_private) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';
  const { rows } = await pool.query(query, [
    user_id,
    date,
    title,
    body,
    mood,
    practice_minutes,
    is_private,
  ]);
  return rows[0];
};

// Updates an entry. Returns the updated row.
module.exports.update = async (
  entry_id,
  user_id,
  { date, title, body, mood, practice_minutes, is_private },
) => {
  const query =
    'UPDATE entries SET user_id = $1, date = $2, title = $3, body = $4, mood = $5, practice_minutes = $6, is_private = $7 WHERE entry_id = $8 RETURNING *';
  const { rows } = await pool.query(query, [
    user_id,
    date,
    title,
    body,
    mood,
    practice_minutes,
    is_private,
    entry_id,
  ]);
  return rows[0];
};

// Deletes an entry by id
module.exports.destroy = async (entry_id) => {
  const query = 'DELETE FROM entries WHERE entry_id = $1 RETURNING *';
  const { rows } = await pool.query(query, [entry_id]);
  return rows[0] || null;
};
