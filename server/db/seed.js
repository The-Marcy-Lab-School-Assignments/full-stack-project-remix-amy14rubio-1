const bcrypt = require('bcrypt');
const { pool } = require('./pool');

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
      password_hash TEXT NOT NULL,
      google_id     TEXT UNIQUE
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
      piece_id                  SERIAL PRIMARY KEY,
      user_id                   INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
      instrument_id             INTEGER REFERENCES instruments(instrument_id) ON DELETE SET NULL,
      title                     TEXT NOT NULL,
      composer                  TEXT,
      status                    TEXT CHECK (status IN ('learning','polishing','performance_ready','archived')),
      recording_url             TEXT,
      pdf_url                   TEXT,
      image_url                 TEXT,
      sheet_music_url           TEXT,
      sheet_music_title         TEXT,
      sheet_music_thumbnail_url TEXT,
      sheet_music_provider      TEXT,
      added_at                  TIMESTAMP DEFAULT NOW()
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

  // // Insert pieces
  // const { rows: pieces } = await pool.query(
  //   `
  //   INSERT INTO pieces (user_id, instrument_id, title, composer, status, recording_url) VALUES
  //     ($1, $3, 'Clair de Lune',         'Debussy',  'polishing',         'https://example.com/clair-de-lune.mp3'),
  //     ($1, $4, 'Eruption',              'Van Halen', 'learning',         'https://example.com/eruption.mp3'),
  //     ($2, $5, 'Partita No. 2',         'Bach',      'learning',         'https://example.com/partita.mp3'),
  //     ($2, $6, 'Blackbird',             'Beatles',   'performance_ready', 'https://example.com/blackbird.mp3')
  //   RETURNING piece_id, title, user_id
  //   `,
  //   [
  //     alice.user_id,
  //     bob.user_id,
  //     alicePiano.instrument_id,
  //     aliceGuitar.instrument_id,
  //     bobViolin.instrument_id,
  //     bobGuitar.instrument_id,
  //   ],
  // );

  // const [clairDeLune, eruption, partita, blackbird] = pieces;

  // // Insert entries
  // const { rows: entries } = await pool.query(
  //   `
  //   INSERT INTO entries (user_id, date, title, body, mood, practice_minutes, is_private) VALUES
  //     ($1, '2025-01-01', 'First practice of the year', 'Warmed up with scales then worked on Clair de Lune. Left hand is still sloppy on the arpeggios.', 4, 45, false),
  //     ($1, '2025-01-03', 'Guitar day',                 'Spent most of the session on the Eruption intro. My right hand picking is getting more consistent.', 3, 60, false),
  //     ($1, '2025-01-05', 'Rough session',              'Could not focus today. Ran through Clair de Lune once and called it.', 2, 20, true),
  //     ($2, '2025-01-02', 'Bach is humbling',           'Partita No. 2 is absolutely brutal. Intonation on the higher positions needs a lot of work.', 3, 90, false),
  //     ($2, '2025-01-04', 'Blackbird milestone!',       'Finally played Blackbird all the way through without stopping. Huge moment.', 5, 50, false)
  //   RETURNING entry_id, title, user_id
  //   `,
  //   [alice.user_id, bob.user_id],
  // );

  // const [aliceEntry1, aliceEntry2, aliceEntry3, bobEntry1, bobEntry2] = entries;

  // // Insert entry_instruments
  // await pool.query(
  //   `
  //   INSERT INTO entry_instruments (entry_id, instrument_id) VALUES
  //     ($1, $5),
  //     ($2, $6),
  //     ($3, $7),
  //     ($4, $8)
  //   `,
  //   [
  //     aliceEntry1.entry_id,
  //     aliceEntry2.entry_id,
  //     bobEntry1.entry_id,
  //     bobEntry2.entry_id,
  //     alicePiano.instrument_id,
  //     aliceGuitar.instrument_id,
  //     bobViolin.instrument_id,
  //     bobGuitar.instrument_id,
  //   ],
  // );

  // // Insert entry_pieces
  // await pool.query(
  //   `
  //   INSERT INTO entry_pieces (entry_id, piece_id) VALUES
  //     ($1, $5),
  //     ($2, $6),
  //     ($3, $7),
  //     ($4, $8)
  //   `,
  //   [
  //     aliceEntry1.entry_id,
  //     aliceEntry2.entry_id,
  //     bobEntry1.entry_id,
  //     bobEntry2.entry_id,
  //     clairDeLune.piece_id,
  //     eruption.piece_id,
  //     partita.piece_id,
  //     blackbird.piece_id,
  //   ],
  // );

  // // Insert notes
  // await pool.query(
  //   `
  //   INSERT INTO notes (user_id, instrument_id, title, body, pinned) VALUES
  //     ($1, $3, 'Arpeggio fingering reminder', 'Use 1-2-3-5 on the left hand for the opening of Clair de Lune.', true),
  //     ($1, $4, 'Eruption picking pattern',    'Alternate pick the tremolo section, do not sweep.', false),
  //     ($2, $5, 'Intonation tips',             'Record yourself and listen back. Adjust first finger position before shifting.', true),
  //     ($2, $6, 'Blackbird fingerpicking',     'Ring finger stays anchored on the G string throughout the verse.', false)
  //   `,
  //   [
  //     alice.user_id,
  //     bob.user_id,
  //     alicePiano.instrument_id,
  //     aliceGuitar.instrument_id,
  //     bobViolin.instrument_id,
  //     bobGuitar.instrument_id,
  //   ],
  // );

  // // Insert milestones
  // await pool.query(
  //   `
  //   INSERT INTO milestones (user_id, instrument_id, entry_id, piece_id, title, date) VALUES
  //     ($1, $2, $3,   $4, 'Played Clair de Lune hands together for the first time', '2025-01-01'),
  //     ($5, $6, $7,   $8, 'Played Blackbird start to finish without stopping',       '2025-01-04')
  //   `,
  //   [
  //     alice.user_id,
  //     alicePiano.instrument_id,
  //     aliceEntry1.entry_id,
  //     clairDeLune.piece_id,
  //     bob.user_id,
  //     bobGuitar.instrument_id,
  //     bobEntry2.entry_id,
  //     blackbird.piece_id,
  //   ],
  // );

  // Insert pieces
  const { rows: pieces } = await pool.query(
    `
  INSERT INTO pieces (
    user_id,
    instrument_id,
    title,
    composer,
    status,
    recording_url,
    pdf_url,
    image_url,
    sheet_music_url,
    sheet_music_title,
    sheet_music_thumbnail_url,
    sheet_music_provider
  ) VALUES
    ($1, $3,  'Clair de Lune',               'Claude Debussy',      'polishing',
      'https://example.com/audio/clair-de-lune.mp3',
      'https://example.com/pdfs/clair-de-lune.pdf',
      'https://example.com/images/clair-de-lune.jpg',
      'https://imslp.org/wiki/Clair_de_Lune_(Debussy,_Claude)',
      'Clair de Lune',
      'https://example.com/thumbs/clair-de-lune.jpg',
      'IMSLP'),

    ($1, $3,  'Gymnopédie No. 1',            'Erik Satie',          'performance_ready',
      'https://example.com/audio/gymnopedie.mp3',
      'https://example.com/pdfs/gymnopedie.pdf',
      'https://example.com/images/gymnopedie.jpg',
      'https://imslp.org/wiki/Gymnop%C3%A9dies_(Satie,_Erik)',
      'Gymnopédie No. 1',
      'https://example.com/thumbs/gymnopedie.jpg',
      'IMSLP'),

    ($1, $4,  'Eruption',                    'Van Halen',           'learning',
      'https://example.com/audio/eruption.mp3',
      'https://example.com/pdfs/eruption.pdf',
      'https://example.com/images/eruption.jpg',
      'https://www.songsterr.com/a/wsa/van-halen-eruption-tab-s24413',
      'Eruption Guitar Tab',
      'https://example.com/thumbs/eruption.jpg',
      'Songsterr'),

    ($1, $4,  'Little Wing',                 'Jimi Hendrix',        'polishing',
      'https://example.com/audio/little-wing.mp3',
      'https://example.com/pdfs/little-wing.pdf',
      'https://example.com/images/little-wing.jpg',
      'https://www.songsterr.com/a/wsa/jimi-hendrix-little-wing-tab-s2696',
      'Little Wing Guitar Tab',
      'https://example.com/thumbs/little-wing.jpg',
      'Songsterr'),

    ($1, $4,  'Black Dog',                   'Led Zeppelin',        'learning',
      'https://example.com/audio/black-dog.mp3',
      'https://example.com/pdfs/black-dog.pdf',
      'https://example.com/images/black-dog.jpg',
      'https://www.songsterr.com/a/wsa/led-zeppelin-black-dog-tab-s3040',
      'Black Dog Guitar Tab',
      'https://example.com/thumbs/black-dog.jpg',
      'Songsterr'),

    ($2, $5,  'Partita No. 2',               'J.S. Bach',           'learning',
      'https://example.com/audio/partita.mp3',
      'https://example.com/pdfs/partita.pdf',
      'https://example.com/images/partita.jpg',
      'https://imslp.org/wiki/Violin_Partita_No.2,_BWV_1004_(Bach,_Johann_Sebastian)',
      'Violin Partita No. 2',
      'https://example.com/thumbs/partita.jpg',
      'IMSLP'),

    ($2, $5,  'Meditation from Thaïs',       'Jules Massenet',      'polishing',
      'https://example.com/audio/thais.mp3',
      'https://example.com/pdfs/thais.pdf',
      'https://example.com/images/thais.jpg',
      'https://imslp.org/wiki/Tha%C3%AFs_(Massenet,_Jules)',
      'Meditation from Thaïs',
      'https://example.com/thumbs/thais.jpg',
      'IMSLP'),

    ($2, $6,  'Blackbird',                   'The Beatles',         'performance_ready',
      'https://example.com/audio/blackbird.mp3',
      'https://example.com/pdfs/blackbird.pdf',
      'https://example.com/images/blackbird-piece.jpg',
      'https://www.songsterr.com/a/wsa/the-beatles-blackbird-tab-s65',
      'Blackbird Guitar Tab',
      'https://example.com/thumbs/blackbird.jpg',
      'Songsterr'),

    ($2, $6,  'Dust in the Wind',            'Kansas',              'learning',
      'https://example.com/audio/dust.mp3',
      'https://example.com/pdfs/dust.pdf',
      'https://example.com/images/dust.jpg',
      'https://www.songsterr.com/a/wsa/kansas-dust-in-the-wind-tab-s17291',
      'Dust in the Wind Guitar Tab',
      'https://example.com/thumbs/dust.jpg',
      'Songsterr'),

    ($2, $6,  'Tears in Heaven',             'Eric Clapton',        'polishing',
      'https://example.com/audio/tears.mp3',
      'https://example.com/pdfs/tears.pdf',
      'https://example.com/images/tears.jpg',
      'https://www.songsterr.com/a/wsa/eric-clapton-tears-in-heaven-tab-s12345',
      'Tears in Heaven Guitar Tab',
      'https://example.com/thumbs/tears.jpg',
      'Songsterr')
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

  const pieceMap = Object.fromEntries(pieces.map((p) => [p.title, p]));

  // Insert entries
  const { rows: entries } = await pool.query(
    `
  INSERT INTO entries (
    user_id,
    date,
    title,
    body,
    mood,
    practice_minutes,
    is_private
  ) VALUES
    ($1, '2025-01-01', 'Debussy focus',
      'Worked on voicing in Clair de Lune and improved left-hand control.',
      4, 50, false),

    ($1, '2025-01-03', 'Fast picking day',
      'Practiced alternate picking patterns for Eruption.',
      3, 65, false),

    ($1, '2025-01-05', 'Late night piano session',
      'Ran Gymnopédie slowly with metronome at 60 BPM.',
      5, 40, true),

    ($1, '2025-01-07', 'Hendrix phrasing',
      'Focused on vibrato and chord embellishments in Little Wing.',
      4, 70, false),

    ($1, '2025-01-09', 'Led Zeppelin riffs',
      'Black Dog rhythm transitions are finally cleaner.',
      3, 45, false),

    ($2, '2025-01-02', 'Bach frustration',
      'Higher positions in Partita still need cleaner intonation.',
      2, 90, false),

    ($2, '2025-01-04', 'Blackbird breakthrough',
      'Played through Blackbird without stopping for the first time.',
      5, 55, false),

    ($2, '2025-01-06', 'Fingerpicking practice',
      'Worked slowly through Dust in the Wind intro.',
      4, 60, false),

    ($2, '2025-01-08', 'Massenet session',
      'Focused on expressive bow control in Meditation from Thaïs.',
      5, 80, true),

    ($2, '2025-01-10', 'Clapton acoustic tone',
      'Experimented with softer dynamics in Tears in Heaven.',
      4, 50, false)
  RETURNING entry_id, title, user_id
  `,
    [alice.user_id, bob.user_id],
  );

  const entryMap = Object.fromEntries(entries.map((e) => [e.title, e]));

  // Insert entry_instruments
  await pool.query(
    `
  INSERT INTO entry_instruments (entry_id, instrument_id) VALUES
    ($1, $11),
    ($2, $12),
    ($3, $11),
    ($4, $12),
    ($5, $12),
    ($6, $13),
    ($7, $14),
    ($8, $14),
    ($9, $13),
    ($10, $14)
  `,
    [
      entryMap['Debussy focus'].entry_id,
      entryMap['Fast picking day'].entry_id,
      entryMap['Late night piano session'].entry_id,
      entryMap['Hendrix phrasing'].entry_id,
      entryMap['Led Zeppelin riffs'].entry_id,
      entryMap['Bach frustration'].entry_id,
      entryMap['Blackbird breakthrough'].entry_id,
      entryMap['Fingerpicking practice'].entry_id,
      entryMap['Massenet session'].entry_id,
      entryMap['Clapton acoustic tone'].entry_id,

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
    ($1,  $11),
    ($2,  $12),
    ($3,  $13),
    ($4,  $14),
    ($5,  $15),
    ($6,  $16),
    ($7,  $17),
    ($8,  $18),
    ($9,  $19),
    ($10, $20)
  `,
    [
      entryMap['Debussy focus'].entry_id,
      entryMap['Fast picking day'].entry_id,
      entryMap['Late night piano session'].entry_id,
      entryMap['Hendrix phrasing'].entry_id,
      entryMap['Led Zeppelin riffs'].entry_id,
      entryMap['Bach frustration'].entry_id,
      entryMap['Blackbird breakthrough'].entry_id,
      entryMap['Fingerpicking practice'].entry_id,
      entryMap['Massenet session'].entry_id,
      entryMap['Clapton acoustic tone'].entry_id,

      pieceMap['Clair de Lune'].piece_id,
      pieceMap['Eruption'].piece_id,
      pieceMap['Gymnopédie No. 1'].piece_id,
      pieceMap['Little Wing'].piece_id,
      pieceMap['Black Dog'].piece_id,
      pieceMap['Partita No. 2'].piece_id,
      pieceMap['Blackbird'].piece_id,
      pieceMap['Dust in the Wind'].piece_id,
      pieceMap['Meditation from Thaïs'].piece_id,
      pieceMap['Tears in Heaven'].piece_id,
    ],
  );

  // Insert notes
  await pool.query(
    `
  INSERT INTO notes (
    user_id,
    instrument_id,
    title,
    body,
    pinned
  ) VALUES
    ($1, $3,  'Debussy pedaling',
      'Half pedal during transitions to avoid muddy harmonies.',
      true),

    ($1, $4,  'Tremolo reminder',
      'Relax picking hand during fast tremolo runs.',
      false),

    ($1, $3,  'Gymnopédie tempo',
      'Keep tempo steady and avoid rushing rubato.',
      false),

    ($1, $4,  'Little Wing bends',
      'Pitch bends are slightly sharp after the 7th fret.',
      true),

    ($1, $4,  'Black Dog riff timing',
      'Practice with drum backing track at slower BPM.',
      false),

    ($2, $5,  'Bach shifting',
      'Lead shifts with elbow movement instead of wrist.',
      true),

    ($2, $6,  'Blackbird thumb independence',
      'Keep bass line steady while melody moves.',
      false),

    ($2, $6,  'Dust pattern',
      'Anchor pinky lightly during Travis picking.',
      false),

    ($2, $5,  'Bow pressure',
      'Reduce pressure near bridge during soft passages.',
      true),

    ($2, $6,  'Clapton phrasing',
      'Leave more space between vocal-style phrases.',
      false)
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
  INSERT INTO milestones (
    user_id,
    instrument_id,
    entry_id,
    piece_id,
    title,
    date
  ) VALUES
    ($1,  $3,  $7,  $17,
      'Played Clair de Lune hands together cleanly',
      '2025-01-01'),

    ($1,  $4,  $8,  $18,
      'Reached full speed on Eruption intro',
      '2025-01-03'),

    ($1,  $3,  $9,  $19,
      'Memorized Gymnopédie first page',
      '2025-01-05'),

    ($1,  $4,  $10, $20,
      'Improvised confidently over Little Wing backing track',
      '2025-01-07'),

    ($1,  $4,  $11, $21,
      'Played Black Dog riff in time with metronome',
      '2025-01-09'),

    ($2,  $5,  $12, $22,
      'Completed first full run of Partita Allemande',
      '2025-01-02'),

    ($2,  $6,  $13, $23,
      'Performed Blackbird without stopping',
      '2025-01-04'),

    ($2,  $6,  $14, $24,
      'Maintained Travis picking pattern consistently',
      '2025-01-06'),

    ($2,  $5,  $15, $25,
      'Improved bow consistency across long phrases',
      '2025-01-08'),

    ($2,  $6,  $16, $26,
      'Performed Tears in Heaven from memory',
      '2025-01-10')
  `,
    [
      alice.user_id, // $1
      bob.user_id, // $2

      alicePiano.instrument_id, // $3
      aliceGuitar.instrument_id, // $4
      bobViolin.instrument_id, // $5
      bobGuitar.instrument_id, // $6

      entryMap['Debussy focus'].entry_id, // $7
      entryMap['Fast picking day'].entry_id, // $8
      entryMap['Late night piano session'].entry_id, // $9
      entryMap['Hendrix phrasing'].entry_id, // $10
      entryMap['Led Zeppelin riffs'].entry_id, // $11
      entryMap['Bach frustration'].entry_id, // $12
      entryMap['Blackbird breakthrough'].entry_id, // $13
      entryMap['Fingerpicking practice'].entry_id, // $14
      entryMap['Massenet session'].entry_id, // $15
      entryMap['Clapton acoustic tone'].entry_id, // $16

      pieceMap['Clair de Lune'].piece_id, // $17
      pieceMap['Eruption'].piece_id, // $18
      pieceMap['Gymnopédie No. 1'].piece_id, // $19
      pieceMap['Little Wing'].piece_id, // $20
      pieceMap['Black Dog'].piece_id, // $21
      pieceMap['Partita No. 2'].piece_id, // $22
      pieceMap['Blackbird'].piece_id, // $23
      pieceMap['Dust in the Wind'].piece_id, // $24
      pieceMap['Meditation from Thaïs'].piece_id, // $25
      pieceMap['Tears in Heaven'].piece_id, // $26
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
