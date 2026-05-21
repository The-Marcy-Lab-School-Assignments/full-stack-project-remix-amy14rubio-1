import { useState, useEffect } from 'react';

import NoteForm from './NoteForm';
import NoteList from './NoteList';
import Navbar from '../Navbar';

function NotePage({ currentUser, instruments, notes, loadNotes, isLoading, error, showControls }) {
  const [formReveal, setFormReveal] = useState(false);
  const handleForm = () => {
    setFormReveal((prev) => !prev);
  };
  return (
    <main>
      <Navbar />
      <section>
        <div className='milestone-container'>
          {formReveal && (
            <NoteForm instruments={instruments} loadNotes={loadNotes} handleForm={handleForm} />
          )}
          <button
            onClick={handleForm}
            className={`create-milestone ${formReveal ? 'cancel-milestone' : ''}`}
          >
            {formReveal ? 'x' : 'Create Note'}
          </button>
        </div>
        {isLoading && <p>Loading notes...</p>}
        {error && <p className='error'>Something went wrong: {error}</p>}
        {!formReveal && (
          <div>
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
