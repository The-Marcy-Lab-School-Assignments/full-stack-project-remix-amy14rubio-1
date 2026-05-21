import { useState, useEffect } from 'react';
import EntryForm from './EntryForm';
import EntryList from './EntryList';
import Navbar from '../Navbar';

function EntryPage({
  currentUser,
  entries,
  loadEntries,
  instruments,
  pieces,
  isLoading,
  error,
  showControls,
}) {
  const [formReveal, setFormReveal] = useState(false);
  const handleForm = () => {
    setFormReveal((prev) => !prev);
  };
  return (
    <main>
      <Navbar />
      <section>
        {!formReveal && (
          <h1>{currentUser.username[0].toUpperCase() + currentUser.username.slice(1)}'s Journal</h1>
        )}

        <div className='entry-container'>
          {formReveal && (
            <EntryForm
              loadEntries={loadEntries}
              instruments={instruments}
              pieces={pieces}
              handleForm={handleForm}
            />
          )}

          <button
            onClick={handleForm}
            className={`create-entry ${formReveal ? 'cancel-entry' : ''}`}
          >
            {formReveal ? 'x' : 'Create Entry'}
          </button>
        </div>

        {isLoading && <p>Loading entries...</p>}
        {error && <p className='error'>Something went wrong: {error}</p>}

        {!formReveal && (
          <EntryList
            entries={entries}
            loadEntries={loadEntries}
            instruments={instruments}
            pieces={pieces}
            showControls={showControls}
          />
        )}
      </section>
    </main>
  );
}

export default EntryPage;
