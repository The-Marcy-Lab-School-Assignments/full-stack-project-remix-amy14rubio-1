const bcrypt = require('bcrypt');
const pool = require('./pool');

const SALT_ROUNDS = 8;

const seed = async () => {
  // Drop tables in reverse dependency order
  await pool.query('DROP TABLE IF EXISTS entry_pieces');
  await pool.query('DROP TABLE IF EXISTS entry_instruments');
  await pool.query('DROP TABLE IF EXISTS milestones');
  await pool.query('DROP TABLE IF EXISTS notes');
  await pool.query('DROP TABLE IF EXISTS entries');
  await pool.query('DROP TABLE IF EXISTS pieces');
  await pool.query('DROP TABLE IF EXISTS instruments');
  await pool.query('DROP TABLE IF EXISTS users');

  await pool.query(`
    CREATE TABLE users (
      user_id       SERIAL PRIMARY KEY,
      username      TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL
    )
  `);

  await pool.query(`
    CREATE TABLE instruments (
      instrument_id  SERIAL PRIMARY KEY,
      user_id        INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
      name           TEXT NOT NULL,
      type           TEXT,
      nickname	     TEXT
    )
  `);

  await pool.query(`
    CREATE TABLE pieces (
      piece_id        SERIAL PRIMARY KEY,
      user_id         INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
      instrument_id   INTEGER REFERENCES instruments(instrument_id) ON DELETE SET NULL,
      title           TEXT NOT NULL,
      composer        TEXT,
      status          TEXT CHECK (status IN ('learning','polishing','performance_ready','archived')),
      url      		    TEXT,
      added_at        TIMESTAMP DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE entries (
      entry_id                  SERIAL PRIMARY KEY,
      user_id                   INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
      date                      DATE NOT NULL,
      title                     TEXT,
      body                      TEXT,
      mood                      INTEGER CHECK (mood BETWEEN 1 AND 5),
      practice_minutes          INTEGER,
      is_private                BOOLEAN DEFAULT TRUE,
      created_at                TIMESTAMP DEFAULT NOW(),
      updated_at                TIMESTAMP DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE notes (
      note_id       SERIAL PRIMARY KEY,
      user_id       INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
      instrument_id INTEGER REFERENCES instruments(instrument_id) ON DELETE SET NULL,
      title         TEXT NOT NULL,
      body          TEXT,
      pinned        BOOLEAN DEFAULT FALSE,
      created_at    TIMESTAMP DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE milestones (
      milestone_id   SERIAL PRIMARY KEY,
      user_id        INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
      instrument_id  INTEGER REFERENCES instruments(instrument_id) ON DELETE SET NULL,
      entry_id       INTEGER REFERENCES entries(entry_id) ON DELETE SET NULL,
      piece_id       INTEGER REFERENCES pieces(piece_id) ON DELETE SET NULL,
      title          TEXT NOT NULL,
      date           DATE NOT NULL,
      created_at     TIMESTAMP DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE entry_instruments (
      entry_instrument_id      SERIAL PRIMARY KEY,
      entry_id                 INTEGER REFERENCES entries(entry_id) ON DELETE CASCADE,
      instrument_id            INTEGER REFERENCES instruments(instrument_id) ON DELETE CASCADE,
      UNIQUE (entry_id, instrument_id)
    )
  `);
  await pool.query(`
    CREATE TABLE entry_pieces (
      entry_piece_id      SERIAL PRIMARY KEY,
      entry_id  INTEGER REFERENCES entries(entry_id) ON DELETE CASCADE,
      piece_id  INTEGER REFERENCES pieces(piece_id) ON DELETE CASCADE,
      UNIQUE (entry_id, piece_id)
    )
  `);

  // Hash passwords in parallel — bcrypt is slow by design (CPU-bound hashing)
  const [aliceHash, bobHash] = await Promise.all([
    bcrypt.hash('password123', SALT_ROUNDS),
    bcrypt.hash('password123', SALT_ROUNDS),
  ]);

  // RETURNING captures inserted user_ids so we don't hardcode them
  const { rows: users } = await pool.query(
    `
    INSERT INTO users (username, password_hash) VALUES
      ('alice', $1),
      ('bob',   $2)
    RETURNING user_id, username
    `,
    [aliceHash, bobHash],
  );

  const [alice, bob] = users;

  // Insert instruments
  const { rows: instruments } = await pool.query(
    `
    INSERT INTO instruments (user_id, name, type, nickname) VALUES
      ($1, 'Guitar',  'string',   'my Fender'),
      ($1, 'Piano',   'keys',      null),
      ($2, 'Violin',  'string',   'my baby'),
      ($2, 'Guitar',  'string',    null)
    RETURNING instrument_id, name, user_id
    `,
    [alice.user_id, bob.user_id],
  );

  const [aliceGuitar, alicePiano, bobViolin, bobGuitar] = instruments;

  // Insert pieces
  const { rows: pieces } = await pool.query(
    `
    INSERT INTO pieces (user_id, instrument_id, title, composer, status, url) VALUES
      ($1, $3, 'Clair de Lune',         'Debussy',  'polishing',         'https://example.com/clair-de-lune.pdf'),
      ($1, $4, 'Eruption',              'Van Halen', 'learning',         'https://example.com/eruption.pdf'),
      ($2, $5, 'Partita No. 2',         'Bach',      'learning',         'https://example.com/partita.pdf'),
      ($2, $6, 'Blackbird',             'Beatles',   'performance_ready', 'https://example.com/blackbird.pdf')
    RETURNING piece_id, title, user_id
    `,
    [
      alice.user_id,
      bob.user_id,
      alicePiano.instrument_id,
      aliceGuitar.instrument_id,
      bobViolin.instrument_id,
      bobGuitar.instrument_id,
    ],
  );

  const [clairDeLune, eruption, partita, blackbird] = pieces;

  // Insert entries
  const { rows: entries } = await pool.query(
    `
    INSERT INTO entries (user_id, date, title, body, mood, practice_minutes, is_private) VALUES
      ($1, '2025-01-01', 'First practice of the year', 'Warmed up with scales then worked on Clair de Lune. Left hand is still sloppy on the arpeggios.', 4, 45, false),
      ($1, '2025-01-03', 'Guitar day',                 'Spent most of the session on the Eruption intro. My right hand picking is getting more consistent.', 3, 60, false),
      ($1, '2025-01-05', 'Rough session',              'Could not focus today. Ran through Clair de Lune once and called it.', 2, 20, true),
      ($2, '2025-01-02', 'Bach is humbling',           'Partita No. 2 is absolutely brutal. Intonation on the higher positions needs a lot of work.', 3, 90, false),
      ($2, '2025-01-04', 'Blackbird milestone!',       'Finally played Blackbird all the way through without stopping. Huge moment.', 5, 50, false)
    RETURNING entry_id, title, user_id
    `,
    [alice.user_id, bob.user_id],
  );

  const [aliceEntry1, aliceEntry2, aliceEntry3, bobEntry1, bobEntry2] = entries;

  // Insert entry_instruments
  await pool.query(
    `
    INSERT INTO entry_instruments (entry_id, instrument_id) VALUES
      ($1, $5),
      ($2, $6),
      ($3, $7),
      ($4, $8)
    `,
    [
      aliceEntry1.entry_id,
      aliceEntry2.entry_id,
      bobEntry1.entry_id,
      bobEntry2.entry_id,
      alicePiano.instrument_id,
      aliceGuitar.instrument_id,
      bobViolin.instrument_id,
      bobGuitar.instrument_id,
    ],
  );

  // Insert entry_pieces
  await pool.query(
    `
    INSERT INTO entry_pieces (entry_id, piece_id) VALUES
      ($1, $5),
      ($2, $6),
      ($3, $7),
      ($4, $8)
    `,
    [
      aliceEntry1.entry_id,
      aliceEntry2.entry_id,
      bobEntry1.entry_id,
      bobEntry2.entry_id,
      clairDeLune.piece_id,
      eruption.piece_id,
      partita.piece_id,
      blackbird.piece_id,
    ],
  );

  // Insert notes
  await pool.query(
    `
    INSERT INTO notes (user_id, instrument_id, title, body, pinned) VALUES
      ($1, $3, 'Arpeggio fingering reminder', 'Use 1-2-3-5 on the left hand for the opening of Clair de Lune.', true),
      ($1, $4, 'Eruption picking pattern',    'Alternate pick the tremolo section, do not sweep.', false),
      ($2, $5, 'Intonation tips',             'Record yourself and listen back. Adjust first finger position before shifting.', true),
      ($2, $6, 'Blackbird fingerpicking',     'Ring finger stays anchored on the G string throughout the verse.', false)
    `,
    [
      alice.user_id,
      bob.user_id,
      alicePiano.instrument_id,
      aliceGuitar.instrument_id,
      bobViolin.instrument_id,
      bobGuitar.instrument_id,
    ],
  );

  // Insert milestones
  await pool.query(
    `
    INSERT INTO milestones (user_id, instrument_id, entry_id, piece_id, title, date) VALUES
      ($1, $2, $3,   $4, 'Played Clair de Lune hands together for the first time', '2025-01-01'),
      ($5, $6, $7,   $8, 'Played Blackbird start to finish without stopping',       '2025-01-04')
    `,
    [
      alice.user_id,
      alicePiano.instrument_id,
      aliceEntry1.entry_id,
      clairDeLune.piece_id,
      bob.user_id,
      bobGuitar.instrument_id,
      bobEntry2.entry_id,
      blackbird.piece_id,
    ],
  );

  return users;
};

seed()
  .then((users) => {
    console.log('Database seeded successfully.');
    console.log(`  Users: ${users.map((u) => u.username).join(', ')}`);
  })
  .catch((err) => {
    console.error('Error seeding database:', err);
    process.exit(1);
  })
  .finally(() => pool.end());
