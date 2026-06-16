import { useState, useEffect } from 'react';

import NoteForm from './NoteForm';
import NoteList from './NoteList';
import Navbar from '../Navbar';

function NotePage({ currentUser, instruments, notes, loadNotes, isLoading, error, showControls }) {
  const [formReveal, setFormReveal] = useState(false);
  const handleCreate = () => {
    setFormReveal(true);
  };
  const handleCancel = () => {
    setFormReveal(false);
  };
  return (
    <main>
      <Navbar />
      <section>
        {!formReveal && (
          <div className='milestone-header'>
            <h1>NOTES</h1>
            <div>
              <button onClick={handleCreate} className={`create-entry`}>
                +
              </button>
            </div>
          </div>
        )}
        {formReveal && (
          <div className='milestone-container'>
            <NoteForm instruments={instruments} loadNotes={loadNotes} handleCancel={handleCancel} />

            <button onClick={handleCancel} className={`cancel-entry`}>
              x
            </button>
          </div>
        )}
        {isLoading && <p>Loading notes...</p>}
        {error && <p className='error'>Something went wrong: {error}</p>}
        {!formReveal && (
          <div className='note-list-container'>
            <NoteList
              notes={notes}
              loadNotes={loadNotes}
              instruments={instruments}
              showControls={showControls}
            />
          </div>
        )}
      </section>
      {/* <section>
          <div id='user-controls'>
            <span>
              Welcome, <strong>{currentUser.username}</strong>!
            </span>
          </div>
          <NoteForm instruments={instruments} loadNotes={loadNotes} />
          {isLoading && <p>Loading notes...</p>}
          {error && <p className='error'>Something went wrong: {error}</p>}
          <h2>My Notes</h2>
          <NoteList
            notes={notes}
            loadNotes={loadNotes}
            instruments={instruments}
            showControls={showControls}
          />
        </section> */}
    </main>
  );
}

export default NotePage;
