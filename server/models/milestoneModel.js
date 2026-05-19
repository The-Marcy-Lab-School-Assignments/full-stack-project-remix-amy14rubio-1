const pool = require('../db/pool');

// Returns all milestones for a specific user, ordered by creation time
module.exports.listByUser = async (user_id) => {
  const query = `
  SELECT
      milestones.*,

      jsonb_build_object(
            'name', instruments.name,
            'nickname', instruments.nickname
      ) AS instrument,

      jsonb_build_object(
            'title', pieces.title,
            'composer', pieces.composer,
            'status', pieces.status
      ) AS piece,

      jsonb_build_object(
            'title', entries.title
      ) AS entry

    FROM milestones

    LEFT JOIN instruments ON milestones.instrument_id = instruments.instrument_id
    LEFT JOIN pieces ON milestones.piece_id = pieces.piece_id
    LEFT JOIN entries ON milestones.entry_id = entries.entry_id

    WHERE milestones.user_id = $1 
    ORDER BY milestones.milestone_id ASC`;
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
  title,
  // { user_id, instrument_id, entry_id, piece_id, title, date },
) => {
  const query = 'UPDATE milestones SET title = $1 WHERE milestone_id = $2 RETURNING *';
  const { rows } = await pool.query(query, [title, milestone_id]);
  return rows[0];
};

// Deletes an milestone by id
module.exports.destroy = async (milestone_id) => {
  const query = 'DELETE FROM milestones WHERE milestone_id = $1 RETURNING *';
  const { rows } = await pool.query(query, [milestone_id]);
  return rows[0] || null;
};
