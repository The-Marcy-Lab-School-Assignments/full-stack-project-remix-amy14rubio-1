import NoteForm from './NoteForm';
import NoteList from './NoteList';
import Navbar from '../Navbar';

function NotePage({ currentUser, instruments, notes, loadNotes, isLoading, error, showControls }) {
  return (
    <main>
      <Navbar />
      <section>
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
      </section>
    </main>
  );
}

export default NotePage;
