const NoteDisplay = ({ note, instrument, onDelete, onEdit, showControls }) => {
  return (
    <li className='note-card'>
      {note.pinned && <span>📌</span>}
      <h3>{note.title}</h3>
      <p>{note.body}</p>
      {instrument && <p>{instrument.nickname || instrument.name}</p>}
      {showControls && (
        <div className='note-card-controls'>
          <button onClick={onEdit}>Edit</button>
          <button onClick={onDelete}>Delete</button>
        </div>
      )}
    </li>
  );
};

export default NoteDisplay;
