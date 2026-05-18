import { useState, useEffect } from 'react';
import { fetchAllEntries } from '../adapters/entry-adapters';
import { fetchAllInstruments } from '../adapters/instrument-adapters';
import EntryForm from './EntryForm';
import EntryList from './EntryList';

function Home({ currentUser, handleLogout }) {
  const [entries, setEntries] = useState([]);
  const [instruments, setInstruments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadEntries = async () => {
    setIsLoading(true);
    setError(null);
    const { data, error: fetchError } = await fetchAllEntries();
    if (fetchError) {
      setError(fetchError.message);
    } else {
      setEntries(data);
    }
    setIsLoading(false);
  };

  const loadInstruments = async () => {
    setIsLoading(true);
    setError(null);
    const { data, error: fetchError } = await fetchAllInstruments();
    if (fetchError) {
      setError(fetchError.message);
    } else {
      setInstruments(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadEntries();
    loadInstruments();
  }, []);

  return (
    <section>
      <div id='user-controls'>
        <span>
          Welcome, <strong>{currentUser.username}</strong>!
        </span>
        <button onClick={handleLogout}>Log Out</button>
      </div>
      <EntryForm loadEntries={loadEntries} instruments={instruments} />
      {isLoading && <p>Loading entries...</p>}
      {error && <p className='error'>Something went wrong: {error}</p>}
      <EntryList entries={entries} loadEntries={loadEntries} instruments={instruments} />
    </section>
  );
}

export default Home;
