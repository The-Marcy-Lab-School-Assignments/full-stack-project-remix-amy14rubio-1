const { pool, supabase } = require('../db/pool');

// Returns all pieces for a specific user, ordered by creation time
module.exports.listByUser = async (user_id) => {
  const query = `SELECT pieces.*,

    jsonb_build_object(
      'name', instruments.name,
      'type', instruments.type,
      'nickname', instruments.nickname
    ) AS instruments
  
  FROM pieces 
  
  LEFT JOIN instruments
      ON instruments.instrument_id = pieces.instrument_id
  
  WHERE pieces.user_id = $1 
  
  ORDER BY pieces.piece_id ASC`;
  const { rows } = await pool.query(query, [user_id]);
  return rows;
};

// Returns a single piece row (used for ownership checks before update/delete)
module.exports.find = async (piece_id) => {
  const query = `SELECT pieces.*,
  
  jsonb_build_object(
    'name', instruments.name,
    'type', instruments.type,
    'nickname', instruments.nickname
  ) AS instruments
  
  
  FROM pieces 
  
  LEFT JOIN instruments
      ON instruments.instrument_id = pieces.instrument_id
  
  
  WHERE piece_id = $1`;
  const { rows } = await pool.query(query, [piece_id]);
  return rows[0] || null;
};

// Creates a new piece. Returns the full piece row.
module.exports.create = async (
  user_id,
  instrument_id,
  title,
  composer,
  status,
  recording_url,
  sheet_music_url,
  sheet_music_title,
  sheet_music_thumbnail_url,
  sheet_music_provider,
) => {
  const query = `INSERT INTO pieces (user_id, instrument_id, title, composer, status, recording_url, 
    sheet_music_url, sheet_music_title, sheet_music_thumbnail_url, sheet_music_provider) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`;
  const { rows } = await pool.query(query, [
    user_id,
    instrument_id,
    title,
    composer,
    status,
    recording_url,
    sheet_music_url,
    sheet_music_title,
    sheet_music_thumbnail_url,
    sheet_music_provider,
  ]);
  return rows[0];
};

// Updates an piece. Returns the updated row.
module.exports.update = async (
  piece_id,
  { user_id, instrument_id, title, composer, status, recording_url },
) => {
  const query =
    'UPDATE pieces SET user_id = $1, instrument_id = $2, title = $3, composer = $4, status = $5, recording_url = $6 WHERE piece_id = $7 RETURNING *';
  const { rows } = await pool.query(query, [
    user_id,
    instrument_id,
    title,
    composer,
    status,
    recording_url,
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

//upload file
module.exports.uploadPieceFile = async (pieceId, fileBuffer, fileName, mimeType, userId) => {
  // Figure out file type
  const isImage = mimeType.startsWith('image/');
  const folder = isImage ? 'images' : 'pdfs';
  const storagePath = `${userId}/${folder}/${pieceId}_${fileName}`;
  // const urlColumn = isImage ? 'image_url' : 'pdf_url';

  // 1. Upload to Supabase Storage
  const { error } = await supabase.storage.from('pieces').upload(storagePath, fileBuffer, {
    contentType: mimeType,
    upsert: true, // overwrites if file already exists
  });

  if (error) throw error;

  // 2. Get the public URL
  const { data } = supabase.storage.from('pieces').getPublicUrl(storagePath);

  if (isImage) {
    const result = await pool.query(
      `UPDATE pieces SET image_url = $1 WHERE piece_id = $2 AND user_id = $3 RETURNING *`,
      [data.publicUrl, pieceId, userId],
    );
    return result.rows[0];
  } else {
    const result = await pool.query(
      `UPDATE pieces SET pdf_url = $1 WHERE piece_id = $2 AND user_id = $3 RETURNING *`,
      [data.publicUrl, pieceId, userId],
    );
    return result.rows[0];
  }
};
