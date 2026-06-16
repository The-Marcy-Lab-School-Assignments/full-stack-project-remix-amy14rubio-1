const { Pool } = require('pg');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// A pool maintains a set of connections to the database that remain open and
// can be dynamically allocated each time we send a query. This is more efficient
// than opening and closing a new connection on every request.
// The pg library reads PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE from the
// environment automatically — no explicit config needed for local development.
// In production, PG_CONNECTION_STRING overrides all of them.
module.exports.pool = new Pool(
  process.env.PG_CONNECTION_STRING
    ? { connectionString: process.env.PG_CONNECTION_STRING, ssl: { rejectUnauthorized: false } }
    : {},
);

module.exports.supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);
