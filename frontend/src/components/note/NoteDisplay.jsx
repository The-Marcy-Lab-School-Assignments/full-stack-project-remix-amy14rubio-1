const NoteDisplay = ({ note, instrument, onDelete, onEdit, showControls }) => {
  return (
    <div className='note-card'>
      <div className='note-card-header'>
        <span className='note-card-title'>{note.title}</span>
        {showControls && (
          <div className='note-card-controls'>
            <button onClick={onDelete}>
              <img src='/recycle-bin-icon.png' className='milestone-icon' />
            </button>
            <button onClick={onEdit}>
              <img src='/pencil-icon.png' className='milestone-icon' />
            </button>
          </div>
        )}
      </div>
      <p>{note.body}</p>
      {instrument && (
        <p className={instrument.nickname || instrument.name ? 'milestone-tag' : ''}>
          {instrument.nickname || instrument.name}
        </p>
      )}
    </div>
  );
};

export default NoteDisplay;
