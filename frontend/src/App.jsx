import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';

import AuthPage from './components/AuthPage';
import EntryPage from './components/entry/EntryPage';
import MilestonePage from './components/milestone/MilestonePage';
import NotePage from './components/note/NotePage';
import Home from './components/Home';

import { getMe, login, register, logout } from './adapters/auth-adapters';
import { fetchAllEntries } from './adapters/entry-adapters';
import { fetchAllInstruments } from './adapters/instrument-adapters';
import { fetchAllPieces } from './adapters/piece-adapters';
import { fetchAllMilestones } from './adapters/milestone-adapters';
import { fetchAllNotes } from './adapters/note-adapters';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [entries, setEntries] = useState([]);
  const [instruments, setInstruments] = useState([]);
  const [pieces, setPieces] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [notes, setNotes] = useState([]);
  const [showControls, setShowControls] = useState(false);
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

  const loadMilestones = async () => {
    setIsLoading(true);
    setError(null);
    const { data, error: fetchError } = await fetchAllMilestones();
    if (fetchError) {
      setError(fetchError.message);
    } else {
      setMilestones(data);
    }
    setIsLoading(false);
  };

  const loadPieces = async () => {
    setIsLoading(true);
    setError(null);
    const { data, error: fetchError } = await fetchAllPieces();
    if (fetchError) {
      setError(fetchError.message);
    } else {
      setPieces(data);
    }
    setIsLoading(false);
  };

  const loadNotes = async () => {
    setIsLoading(true);
    setError(null);
    const { data, error: fetchError } = await fetchAllNotes();
    if (fetchError) {
      setError(fetchError.message);
    } else {
      setNotes(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadEntries();
    loadInstruments();
    loadPieces();
    loadMilestones();
    loadNotes();
  }, []);

  // On every page load, check the server for an active session cookie.
  // React state doesn't survive a refresh; session cookies do.
  useEffect(() => {
    const checkForSession = async () => {
      const { data: user } = await getMe();
      setCurrentUser(user);
    };
    checkForSession();
  }, []);

  // Handlers that manage updating the current user.
  // Defined in App to ensure that child components only
  // update the current user in a controlled manner.
  const handleLogin = async (username, password) => {
    const { data: user, error } = await login(username, password);
    if (error) return error;
    setCurrentUser(user);
  };

  const handleRegister = async (username, password) => {
    const { data: user, error } = await register(username, password);
    if (error) return error;
    setCurrentUser(user);
  };

  const handleLogout = async () => {
    await logout();
    setCurrentUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route
          path='/'
          element={
            currentUser ? (
              <Home
                currentUser={currentUser}
                handleLogout={handleLogout}
                entries={entries}
                loadEntries={loadEntries}
                instruments={instruments}
                milestones={milestones}
                loadMilestones={loadMilestones}
                notes={notes}
                loadNotes={loadNotes}
                showControls={false}
              />
            ) : (
              <AuthPage handleLogin={handleLogin} handleRegister={handleRegister} />
            )
          }
        />
        <Route
          path='/entries'
          element={
            currentUser ? (
              <EntryPage
                currentUser={currentUser}
                entries={entries}
                loadEntries={loadEntries}
                instruments={instruments}
                pieces={pieces}
                isLoading={isLoading}
                error={error}
                showControls={true}
              />
            ) : (
              <AuthPage handleLogin={handleLogin} handleRegister={handleRegister} />
            )
          }
        />
        <Route
          path='/milestones'
          element={
            currentUser ? (
              <MilestonePage
                currentUser={currentUser}
                entries={entries}
                instruments={instruments}
                pieces={pieces}
                milestones={milestones}
                loadMilestones={loadMilestones}
                isLoading={isLoading}
                error={error}
                showControls={true}
              />
            ) : (
              <AuthPage handleLogin={handleLogin} handleRegister={handleRegister} />
            )
          }
        />

        <Route
          path='/notes'
          element={
            currentUser ? (
              <NotePage
                currentUser={currentUser}
                instruments={instruments}
                notes={notes}
                loadNotes={loadNotes}
                isLoading={isLoading}
                error={error}
                showControls={true}
              />
            ) : (
              <AuthPage handleLogin={handleLogin} handleRegister={handleRegister} />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
