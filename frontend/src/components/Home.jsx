import { useState, useEffect } from 'react';
import EntryList from './entry/EntryList';
import Navbar from './Navbar';
import MilestoneList from './milestone/MilestoneList';
import NoteList from './note/NoteList';

function Home({
  currentUser,
  handleLogout,
  entries,
  loadEntries,
  instruments,
  milestones,
  loadMilestones,
  notes,
  loadNotes,
}) {
  return (
    <main>
      <Navbar />
      <section>
        <div id='user-controls'>
          <span>
            Welcome, <strong>{currentUser.username}</strong>!
          </span>
          <button onClick={handleLogout}>Log Out</button>
        </div>
        {/* add total practice minutes */}
        {/* add recent entries */}
        <h2>Recent Entries </h2>

        <EntryList
          entries={entries.slice(0, 3)}
          loadEntries={loadEntries}
          instruments={instruments}
        />

        {/* add recent milestones */}
        <h2>Recent Milestones </h2>
        <MilestoneList
          milestones={milestones.slice(0, 3)}
          loadMilestones={loadMilestones}
          entries={entries}
          instruments={instruments}
        />

        {/* add recent notes */}
        <h2>Pinned Notes </h2>
        <NoteList
          notes={notes.filter((note) => note.pinned).slice(0, 3)}
          loadNotes={loadNotes}
          instruments={instruments}
        />

        {/* <EntryForm loadEntries={loadEntries} instruments={instruments} />
      {isLoading && <p>Loading entries...</p>}
      {error && <p className='error'>Something went wrong: {error}</p>}
      <EntryList entries={entries} loadEntries={loadEntries} instruments={instruments} /> */}
      </section>
    </main>
  );
}

export default Home;
