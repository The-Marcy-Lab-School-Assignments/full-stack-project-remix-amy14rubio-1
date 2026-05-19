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
  return (
    <main>
      <Navbar />
      <section>
        <div id='user-controls'>
          <span>
            Welcome, <strong>{currentUser.username}</strong>!
          </span>
        </div>
        <EntryForm loadEntries={loadEntries} instruments={instruments} pieces={pieces} />
        {isLoading && <p>Loading entries...</p>}
        {error && <p className='error'>Something went wrong: {error}</p>}
        <h2>Past Entries </h2>
        <EntryList
          entries={entries}
          loadEntries={loadEntries}
          instruments={instruments}
          pieces={pieces}
          showControls={showControls}
        />
      </section>
    </main>
  );
}

export default EntryPage;
