# Music Journal App

A full-stack music journaling app built with React, Express, and Postgres. Built for musicians who want to track practice sessions, organize their music, and share their journey with a supportive community. Demonstrates session-based authentication, session rehydration, auth-dependent data fetching, and conditional rendering.

This project prioritizes core music journaling features (entries, instruments, notes, milestones, and pieces), with social features (posts, comments, feed interactions) included as extended scope.

## User Stories

**Auth**

- A user can register for an account with a username and password
- A user can log in to an existing account
- A user can log out
- A returning user who has an active session is automatically logged in when they revisit the app

**Entries**

- A logged-in user can see all of their journal entries
- A logged-in user can create a new entry by entering a title, body, mood, date and practice minutes
- A logged-in user can register an entry with one or more of their instruments
- A logged-in user can link one or more pieces to an entry
- A logged-in user can edit an entry
- A logged-in user can delete an entry

**Posts**
Posts may either be standalone community posts or published journal entries.

- A user can view all posts on the public feed
- A logged-in user can publish an entry to the public feed
- A logged-in user can create a standalone post in the public feed
- A logged-in user can mark a post as seeking advice
- A logged-in user can add a recording link to a post
- A logged-in user can remove a recording link from one of their posts
- A logged-in user can filter the public feed by tag
- A logged-in user can save a post from the public feed
- A logged-in user can view all of their saved posts
- A logged-in user can delete one of their own posts
- A logged-in user can edit one of their own posts

**Instruments**

- A logged-in user can add an instrument to their profile
- A logged-in user can give an instrument a nickname
- A logged-in user can view all of their instruments
- A logged-in user can edit their instruments
- A logged-in user can delete an instrument from their profile

**Tags**

- A logged-in user can view all available tags
- A logged-in user can add one or more tags to a post
- A post must have at least one tag before it can be published to the
  public feed

**Pieces**

- A logged-in user can add a piece to their library with a title, composer,
  and instrument
- A logged-in user can upload a URL to a piece
- A logged-in user can update the status of a piece
  (learning, polishing, performance ready, archived)
- A logged-in user can view all of their pieces, organized by instrument
- A logged-in user can delete a piece from their library

**Notes**

- A logged-in user can create a note with a title and body
- A logged-in user can optionally associate a note with an instrument
- A logged-in user can pin a note
- A logged-in user can edit a note
- A logged-in user can delete a note

**Milestones**

- A logged-in user can create a milestone with a title and date
- A logged-in user can edit a milestone's title
- A logged-in user can optionally link a milestone to an entry or piece
- A logged-in user can view all of their milestones
- A logged-in user can delete a milestone

**Comments**

- A logged-in user can comment on a post in the public feed
- A logged-in user can view all comments on a post
- A logged-in user can edit their own comments on a post
- A logged-in user can delete one of their own comments

## Schema

```
users
─────────────────────────────────────────
user_id           SERIAL PRIMARY KEY
username          TEXT UNIQUE NOT NULL
display_name      TEXT
password_hash     TEXT NOT NULL
bio               TEXT
created_at        TIMESTAMP DEFAULT NOW()


instruments
─────────────────────────────────────────
instrument_id  SERIAL PRIMARY KEY
user_id        INTEGER REFERENCES users(user_id) ON DELETE CASCADE
name           TEXT NOT NULL
type           TEXT
nickname	     TEXT


tags
─────────────────────────────────────────
tag_id        SERIAL PRIMARY KEY
name          TEXT UNIQUE NOT NULL
created_at     TIMESTAMP DEFAULT NOW()


pieces
─────────────────────────────────────────
piece_id        SERIAL PRIMARY KEY
user_id         INTEGER REFERENCES users(user_id) ON DELETE CASCADE
instrument_id   INTEGER REFERENCES instruments(instrument_id) ON DELETE SET NULL
title           TEXT NOT NULL
composer        TEXT
status          TEXT CHECK (status IN ('learning','polishing','performance_ready','archived'))
url      		    TEXT
added_at        TIMESTAMP DEFAULT NOW()


entries
─────────────────────────────────────────
entry_id                  SERIAL PRIMARY KEY
user_id                   INTEGER REFERENCES users(user_id) ON DELETE CASCADE
date                      DATE NOT NULL
title                     TEXT
body                      TEXT
mood                      INTEGER CHECK (mood BETWEEN 1 AND 5)
practice_minutes          INTEGER
is_private                BOOLEAN DEFAULT TRUE
created_at                TIMESTAMP DEFAULT NOW()
updated_at                TIMESTAMP DEFAULT NOW()


notes
─────────────────────────────────────────
note_id       SERIAL PRIMARY KEY
user_id       INTEGER REFERENCES users(user_id) ON DELETE CASCADE
instrument_id INTEGER REFERENCES instruments(instrument_id) ON DELETE SET NULL
title         TEXT NOT NULL
body          TEXT
pinned        BOOLEAN DEFAULT FALSE
created_at    TIMESTAMP DEFAULT NOW()


milestones
─────────────────────────────────────────
milestone_id   SERIAL PRIMARY KEY
user_id        INTEGER REFERENCES users(user_id) ON DELETE CASCADE
instrument_id  INTEGER REFERENCES instruments(instrument_id) ON DELETE SET NULL
entry_id       INTEGER REFERENCES entries(entry_id) ON DELETE SET NULL
piece_id       INTEGER REFERENCES pieces(piece_id) ON DELETE SET NULL
title          TEXT NOT NULL
date           DATE NOT NULL
created_at     TIMESTAMP DEFAULT NOW()


entry_instruments
─────────────────────────────────────────
entry_instrument_id      SERIAL PRIMARY KEY
entry_id                 INTEGER REFERENCES entries(entry_id) ON DELETE CASCADE
instrument_id            INTEGER REFERENCES instruments(instrument_id) ON DELETE CASCADE
UNIQUE (entry_id, instrument_id)


entry_pieces
─────────────────────────────────────────
entry_piece_id      SERIAL PRIMARY KEY
entry_id  INTEGER REFERENCES entries(entry_id) ON DELETE CASCADE
piece_id  INTEGER REFERENCES pieces(piece_id) ON DELETE CASCADE
UNIQUE (entry_id, piece_id)


posts
─────────────────────────────────────────
post_id           SERIAL PRIMARY KEY
user_id           INTEGER REFERENCES users(user_id) ON DELETE CASCADE
entry_id          INTEGER REFERENCES entries(entry_id) ON DELETE SET NULL
body              TEXT NOT NULL
is_seeking_advice BOOLEAN DEFAULT FALSE
posted_at         TIMESTAMP DEFAULT NOW()
updated_at        TIMESTAMP DEFAULT NOW()


post_tags
─────────────────────────────────────────
post_tag_id      SERIAL PRIMARY KEY
post_id	    INTEGER REFERENCES posts(post_id) ON DELETE CASCADE
tag_id		    INTEGER REFERENCES tags(tag_id) ON DELETE CASCADE
UNIQUE (post_id, tag_id)


post_recordings
─────────────────────────────────────────
recording_id     SERIAL PRIMARY KEY
post_id          INTEGER REFERENCES posts(post_id) ON DELETE CASCADE
url              TEXT NOT NULL
duration_seconds INTEGER
title            TEXT
uploaded_at      TIMESTAMP DEFAULT NOW()


comments
─────────────────────────────────────────
comment_id  SERIAL PRIMARY KEY
post_id     INTEGER REFERENCES posts(post_id) ON DELETE CASCADE
user_id     INTEGER REFERENCES users(user_id) ON DELETE CASCADE
body        TEXT NOT NULL
created_at  TIMESTAMP DEFAULT NOW()
updated_at  TIMESTAMP DEFAULT NOW()


saved_posts
─────────────────────────────────────────
saved_id    SERIAL PRIMARY KEY
user_id     INTEGER REFERENCES users(user_id) ON DELETE CASCADE
post_id     INTEGER REFERENCES posts(post_id) ON DELETE CASCADE
saved_at    TIMESTAMP DEFAULT NOW()
UNIQUE (user_id, post_id)
```

## API Contract

Unless otherwise noted, all endpoints require authentication.

### Auth endpoints

| Method | Endpoint             | Request Body             | Response                          |
| ------ | -------------------- | ------------------------ | --------------------------------- |
| POST   | `/api/auth/register` | `{ username, password }` | `{ user_id, username }`           |
| POST   | `/api/auth/login`    | `{ username, password }` | `{ user_id, username }`           |
| DELETE | `/api/auth/logout`   | —                        | `{ message }`                     |
| GET    | `/api/auth/me`       | —                        | `{ user_id, username }` or `null` |

### Entry endpoints

| Method | Endpoint                 | Request Body                                                      | Response                                                                                       |
| ------ | ------------------------ | ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| GET    | `/api/entries`           | —                                                                 | `[{ entry_id, title, body, mood, date, practice_minutes, is_private, created_at }]`            |
| GET    | `/api/entries/:entry_id` | —                                                                 | `{ entry_id, title, body, mood, date, practice_minutes, is_private, instruments[], pieces[] }` |
| POST   | `/api/entries`           | `{ title, body, mood, date, practice_minutes, instrument_ids[] }` | `{ entry_id, title, body, mood, date, practice_minutes, is_private, created_at }`              |
| PATCH  | `/api/entries/:entry_id` | `{ title, body, mood, date, practice_minutes }`                   | `{ entry_id, title, body, mood, date, practice_minutes, updated_at }`                          |
| DELETE | `/api/entries/:entry_id` | —                                                                 | `{ message }`                                                                                  |

### Entry instruments endpoints

| Method | Endpoint                                            | Request Body        | Response                                           |
| ------ | --------------------------------------------------- | ------------------- | -------------------------------------------------- |
| POST   | `/api/entries/:entry_id/instruments`                | `{ instrument_id }` | `{ entry_instrument_id, entry_id, instrument_id }` |
| DELETE | `/api/entries/:entry_id/instruments/:instrument_id` | —                   | `{ message }`                                      |

### Entry pieces endpoints

| Method | Endpoint                                  | Request Body   | Response                                 |
| ------ | ----------------------------------------- | -------------- | ---------------------------------------- |
| POST   | `/api/entries/:entry_id/pieces`           | `{ piece_id }` | `{ entry_piece_id, entry_id, piece_id }` |
| DELETE | `/api/entries/:entry_id/pieces/:piece_id` | —              | `{ message }`                            |

### Instrument endpoints

| Method | Endpoint                          | Request Body               | Response                                    |
| ------ | --------------------------------- | -------------------------- | ------------------------------------------- |
| GET    | `/api/instruments`                | —                          | `[{ instrument_id, name, type, nickname }]` |
| POST   | `/api/instruments`                | `{ name, type, nickname }` | `{ instrument_id, name, type, nickname }`   |
| PATCH  | `/api/instruments/:instrument_id` | `{ name, type, nickname }` | `{ instrument_id, name, type, nickname }`   |
| DELETE | `/api/instruments/:instrument_id` | —                          | `{ message }`                               |

### Tag endpoints

| Method | Endpoint            | Request Body | Response             |
| ------ | ------------------- | ------------ | -------------------- |
| GET    | `/api/tags`         | —            | `[{ tag_id, name }]` |
| POST   | `/api/tags`         | { name }     | `{ tag_id, name }`   |
| DELETE | `/api/tags/:tag_id` | —            | `{ message }`        |

### Piece endpoints

| Method | Endpoint                | Request Body                                      | Response                                                              |
| ------ | ----------------------- | ------------------------------------------------- | --------------------------------------------------------------------- |
| GET    | `/api/pieces`           | —                                                 | `[{ piece_id, title, composer, status, url, instrument_id }]`         |
| GET    | `/api/pieces/:piece_id` | —                                                 | `{ piece_id, title, composer, status, url, instrument_id, added_at }` |
| POST   | `/api/pieces`           | `{ title, composer, status, url, instrument_id }` | `{ piece_id, title, composer, status, url, instrument_id, added_at }` |
| PATCH  | `/api/pieces/:piece_id` | `{ title, composer, status, url, instrument_id }` | `{ piece_id, title, composer, status, url, instrument_id }`           |
| DELETE | `/api/pieces/:piece_id` | —                                                 | `{ message }`                                                         |

### Note endpoints

| Method | Endpoint              | Request Body                     | Response                                                     |
| ------ | --------------------- | -------------------------------- | ------------------------------------------------------------ |
| GET    | `/api/notes`          | —                                | `[{ note_id, title, body, pinned, instrument_id }]`          |
| POST   | `/api/notes`          | `{ title, body, instrument_id }` | `{ note_id, title, body, pinned, instrument_id, created_at}` |
| PATCH  | `/api/notes/:note_id` | `{ title, body, pinned }`        | `{ note_id, title, body, pinned, instrument_id }`            |
| DELETE | `/api/notes/:note_id` | —                                | `{ message }`                                                |

### Milestone endpoints

| Method | Endpoint                        | Request Body                                        | Response                                                                       |
| ------ | ------------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------ |
| GET    | `/api/milestones`               | —                                                   | `[{ milestone_id, title, date, instrument_id, entry_id, piece_id }]`           |
| POST   | `/api/milestones`               | `{ title, date, instrument_id, entry_id, piece_id}` | `{ milestone_id, title, date, instrument_id, entry_id, piece_id, created_at }` |
| PATCH  | `/api/milestones/:milestone_id` | `{ title }`                                         | `{ milestone_id, title, date, instrument_id, entry_id, piece_id }`             |
| DELETE | `/api/milestones/:milestone_id` | —                                                   | `{ message }`                                                                  |

### Post endpoints (does not require authentication)

| Method | Endpoint              | Request Body | Response                                                                                                                     |
| ------ | --------------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| GET    | `/api/posts`          | —            | `[{ post_id, user_id, username, display_name, entry_id, body, is_seeking_advice, posted_at, updated_at, tags[] }]`           |
| GET    | `/api/posts/:post_id` | —            | `{ post_id, user_id, username, display_name, entry_id, body, is_seeking_advice, posted_at, updated_at, tags[], comments[] }` |

### Post endpoints

| Method | Endpoint              | Request Body                                       | Response                                                                                                         |
| ------ | --------------------- | -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| POST   | `/api/posts`          | `{ body, entry_id, is_seeking_advice, tag_ids[] }` | `{ post_id, user_id, username, display_name, entry_id, body, is_seeking_advice, posted_at, updated_at, tags[] }` |
| PATCH  | `/api/posts/:post_id` | `{ body, is_seeking_advice, tag_ids[] }`           | `{ post_id, user_id, username, display_name, entry_id, body, is_seeking_advice, posted_at, updated_at, tags[] }` |
| DELETE | `/api/posts/:post_id` | —                                                  | `{ message }`                                                                                                    |

### Post tag endpoints

| Method | Endpoint                           | Request Body | Response                           |
| ------ | ---------------------------------- | ------------ | ---------------------------------- |
| POST   | `/api/posts/:post_id/tags`         | `{ tag_id }` | `{ post_tag_id, post_id, tag_id }` |
| DELETE | `/api/posts/:post_id/tags/:tag_id` | —            | `{ message }`                      |

### Post recording endpoints

| Method | Endpoint                                       | Request Body                       | Response                                                  |
| ------ | ---------------------------------------------- | ---------------------------------- | --------------------------------------------------------- |
| GET    | `/api/posts/:post_id/recordings`               | —                                  | `[{ recording_id, url, duration_seconds, title }]`        |
| POST   | `/api/posts/:post_id/recordings`               | `{ url, duration_seconds, title }` | `{ recording_id, post_id, url, duration_seconds, title }` |
| DELETE | `/api/posts/:post_id/recordings/:recording_id` | —                                  | `{ message }`                                             |

### Saved post endpoints

| Method | Endpoint                    | Request Body  | Response                                     |
| ------ | --------------------------- | ------------- | -------------------------------------------- |
| GET    | `/api/saved-posts`          | —             | `[{ saved_id, post_id, posted_at, tags[] }]` |
| POST   | `/api/saved-posts`          | `{ post_id }` | `{ saved_id, user_id, post_id, saved_at }`   |
| DELETE | `/api/saved-posts/:post_id` | —             | `{ message }`                                |

### Comment endpoints

| Method | Endpoint                                   | Request Body | Response                                                                                 |
| ------ | ------------------------------------------ | ------------ | ---------------------------------------------------------------------------------------- |
| GET    | `/api/posts/:post_id/comments`             | —            | `[{ comment_id, user_id, username, display_name, body, created_at, updated_at }]`        |
| POST   | `/api/posts/:post_id/comments`             | `{ body }`   | `{ comment_id, post_id, user_id, username, display_name, body, created_at, updated_at }` |
| PATCH  | `/api/posts/:post_id/comments/:comment_id` | `{ body }`   | `{ comment_id, post_id, user_id, username, display_name, body, created_at, updated_at }` |
| DELETE | `/api/posts/:post_id/comments/:comment_id` | —            | `{ message }`                                                                            |

## Setup

### 1. Database

Create a local Postgres database:

```sh
createdb todos_casestudy
```

### 2. Server

```sh
cd server
npm install
cp .env.template .env
```

Open `.env` and fill in your Postgres credentials and a session secret. Then seed the database:

```sh
npm run db:seed
```

Start the server:

```sh
npm run dev
```

The server runs on `http://localhost:8080`.

### 3. Frontend

In a second terminal:

```sh
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173`. The Vite dev proxy forwards all `/api` requests to the Express server so session cookies work correctly.

## Seed Users

After running `npm run db:seed`, these accounts are available:

| Username | Password    |
| -------- | ----------- |
| alice    | password123 |
| bob      | password123 |

## Application Structure

```
swe-casestudy-7-todo-app/
├── frontend/               # React app (Vite)
│   ├── src/
│   │   ├── App.jsx         # Root component: currentUser state, session rehydration, auth handlers
│   │   ├── adapters/
│   │   │   ├── auth-adapters.js  # Fetch adapters for /api/auth/* endpoints
│   │   │   └── todo-adapters.js  # Fetch adapters for /api/todos/* endpoints
│   │   └── components/
│   │       ├── AuthPage.jsx    # Login + Register forms (shown when logged out)
│   │       ├── TodoPage.jsx    # Main app container (shown when logged in)
│   │       ├── AddTodoForm.jsx # Form to create a new todo
│   │       ├── TodoList.jsx    # Renders a list of TodoItems
│   │       └── TodoItem.jsx    # Single todo: checkbox, title, delete button
│   └── vite.config.js      # Proxies /api requests to Express in development
└── server/                 # Express + Postgres API
    ├── index.js            # App entry point, route definitions
    ├── controllers/
    │   ├── authControllers.js  # register, login, logout, getMe
    │   └── todoControllers.js  # list, create, update, delete todos
    ├── models/
    │   ├── userModel.js    # SQL queries for the users table
    │   └── todoModel.js    # SQL queries for the todos table
    ├── middleware/
    │   ├── checkAuthentication.js  # Blocks unauthenticated requests
    │   └── logRoutes.js            # Logs each incoming request
    └── db/
        ├── pool.js         # Postgres connection pool
        └── seed.js         # Creates tables and inserts sample data
```
