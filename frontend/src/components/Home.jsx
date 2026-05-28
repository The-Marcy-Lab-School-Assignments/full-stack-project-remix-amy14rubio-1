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
        <div id='home-header'>
          <h1 className='home-title'>
            {'Welcome '.toUpperCase()}
            {currentUser.username.toUpperCase()}
          </h1>
          <h2>
            {/* maybe have user at initialization specify if they have any goals, like practicing 10mins - 30mins per day */}
            {/* if user accomplished their daily goal for 'yesterday', then they should see their minutes practiced to give a sense of celebration */}
            {/* a month is too long and the message shouldn't be rare but it also shouldn't be too common */}
            Congrats You Practiced{' '}
            {entries.reduce((sum, entry) => sum + entry.practice_minutes, 0) || 0} Minutes Total
          </h2>
        </div>
        <div className='home-layout'>
          <div className='home-entries'>
            <h2>{'Recent Entries'.toUpperCase()}</h2>
            <div className='table'>
              <EntryList
                entries={[...entries].reverse().slice(0, 10)}
                loadEntries={loadEntries}
                instruments={instruments}
              />
            </div>
          </div>
          <div className='home-milestones'>
            <h2>{'Recent Milestones'.toUpperCase()} </h2>
            <div className='corkboard'>
              <MilestoneList
                milestones={[...milestones].reverse().slice(0, 3)}
                loadMilestones={loadMilestones}
                entries={entries}
                instruments={instruments}
              />
            </div>
          </div>
          <div className='home-notes'>
            <h2>{'Pinned Notes'.toUpperCase()} </h2>
            <div className='home-note-container'>
              <NoteList
                notes={notes.filter((note) => note.pinned)}
                loadNotes={loadNotes}
                instruments={instruments}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
