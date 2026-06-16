const { pool } = require('../db/pool');

// Returns all entries for a specific user, ordered by creation time
module.exports.listByUser = async (user_id) => {
  const query = ` SELECT
      entries.entry_id,
      entries.title,
      entries.body,
      entries.mood,
      entries.date,
      entries.practice_minutes,
      entries.is_private,

      COALESCE(
        json_agg(
          DISTINCT jsonb_build_object(
            'name', instruments.name,
            'type', instruments.type,
            'nickname', instruments.nickname,
            'instrument_id', instruments.instrument_id,
            'entry_instrument_id', entry_instruments.entry_instrument_id
            
          )
        ) FILTER (WHERE instruments.instrument_id IS NOT NULL),
        '[]'
      ) AS instruments,

      COALESCE(
        json_agg(
          DISTINCT jsonb_build_object(
            'entry_piece_id', entry_pieces.entry_piece_id,
            'piece_id', pieces.piece_id,
            'title', pieces.title,
            'composer', pieces.composer,
            'status', pieces.status
          )
        ) FILTER (WHERE pieces.piece_id IS NOT NULL),
        '[]'
      ) AS pieces

    FROM entries

    LEFT JOIN entry_instruments
      ON entry_instruments.entry_id = entries.entry_id

    LEFT JOIN instruments
      ON instruments.instrument_id = entry_instruments.instrument_id

    LEFT JOIN entry_pieces
      ON entry_pieces.entry_id = entries.entry_id

    LEFT JOIN pieces
      ON pieces.piece_id = entry_pieces.piece_id

    WHERE entries.user_id = $1

    GROUP BY entries.entry_id`;
  const { rows } = await pool.query(query, [user_id]);
  return rows;
};

// Returns a single entry row (used for ownership checks before update/delete)
module.exports.find = async (entry_id) => {
  const query = `SELECT
      entries.entry_id,
      entries.user_id,
      entries.title,
      entries.body,
      entries.mood,
      entries.date,
      entries.practice_minutes,
      entries.is_private,

      COALESCE(
        json_agg(
          DISTINCT jsonb_build_object(
            'name', instruments.name,
            'type', instruments.type,
            'nickname', instruments.nickname,
            'instrument_id', instruments.instrument_id,
            'entry_instrument_id', entry_instruments.entry_instrument_id
            
          )
        ) FILTER (WHERE instruments.instrument_id IS NOT NULL),
        '[]'
      ) AS instruments,

      COALESCE(
        json_agg(
          DISTINCT jsonb_build_object(
            'entry_piece_id', entry_pieces.entry_piece_id,
            'piece_id', pieces.piece_id,
            'title', pieces.title,
            'composer', pieces.composer,
            'status', pieces.status
          )
        ) FILTER (WHERE pieces.piece_id IS NOT NULL),
        '[]'
      ) AS pieces

    FROM entries

    LEFT JOIN entry_instruments
      ON entry_instruments.entry_id = entries.entry_id

    LEFT JOIN instruments
      ON instruments.instrument_id = entry_instruments.instrument_id

    LEFT JOIN entry_pieces
      ON entry_pieces.entry_id = entries.entry_id

    LEFT JOIN pieces
      ON pieces.piece_id = entry_pieces.piece_id

    WHERE entries.entry_id = $1

    GROUP BY entries.entry_id`;
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
