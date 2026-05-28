import { useState, useEffect } from 'react';
import EntryForm from './EntryForm';
import EntryList from './EntryList';
import Navbar from '../Navbar';
import DeleteDropUp from './DeleteDropUp';

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
  const [open, setOpen] = useState(false);
  const [visibleEntries, setVisibleEntries] = useState({
    left: null,
    right: null,
  });
  const handleCreate = () => {
    setFormReveal(true);
  };
  const handleCancel = () => {
    setFormReveal(false);
  };

  return (
    <main>
      <Navbar />
      <section
        onClick={() => {
          if (open) setOpen(false);
        }}
      >
        {!formReveal && (
          <h1>{currentUser.username[0].toUpperCase() + currentUser.username.slice(1)}'s Journal</h1>
        )}

        {formReveal && (
          <div className='entry-container'>
            <EntryForm
              loadEntries={loadEntries}
              instruments={instruments}
              pieces={pieces}
              handleCancel={handleCancel}
            />
            <button onClick={handleCancel} className={`cancel-entry`}>
              x
            </button>
          </div>
        )}

        {isLoading && <p>Loading entries...</p>}
        {error && <p className='error'>Something went wrong: {error}</p>}

        {!formReveal && (
          <EntryList
            entries={entries}
            loadEntries={loadEntries}
            instruments={instruments}
            pieces={pieces}
            showControls={showControls}
            onVisibleEntriesChange={(visibleEntries) => {
              setVisibleEntries(visibleEntries);
            }}
          />
        )}
        {!formReveal && (
          <div className='entry-card-controls'>
            <DeleteDropUp
              leftEntry={visibleEntries.left}
              rightEntry={visibleEntries.right}
              loadEntries={loadEntries}
              setOpen={setOpen}
              open={open}
            />
            <button onClick={handleCreate} className={`create-entry`}>
              +
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

export default EntryPage;
