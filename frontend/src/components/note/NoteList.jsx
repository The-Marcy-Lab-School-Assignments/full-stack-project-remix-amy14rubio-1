import NoteCard from './NoteCard';

const NoteList = ({ notes, loadNotes, instruments, showControls }) => {
  if (!notes.length) return <p>No notes yet.</p>;

  const pinned = notes.filter((note) => note.pinned);
  const unpinned = notes.filter((note) => !note.pinned);

  return (
    <div>
      {pinned.length > 0 && (
        <>
          {showControls && <h2>Pinned</h2>}
          <ul className='note-list'>
            {pinned.map((note) => (
              <NoteCard
                key={note.note_id}
                note={note}
                loadNotes={loadNotes}
                instruments={instruments}
                showControls={showControls}
              />
            ))}
          </ul>
        </>
      )}
      {showControls && <h2>All Notes</h2>}
      <ul className='note-list'>
        {unpinned.map((note) => (
          <NoteCard
            key={note.note_id}
            note={note}
            loadNotes={loadNotes}
            instruments={instruments}
            showControls={showControls}
          />
        ))}
      </ul>
    </div>
  );
};

export default NoteList;
