import { useState } from 'react';
const NoteDisplay = ({ note, instrument, onDelete, onEdit, showControls }) => {
  const [hideControls, setHideControls] = useState(true);
  const handleCardFlip = () => {
    if (showControls) setHideControls((prev) => !prev);
  };
  return (
    <div className='note-card' onClick={() => handleCardFlip()}>
      {hideControls && (
        <div className='note-card-header'>
          <span className='note-card-title'>{note.title}</span>
          <p>{note.body}</p>
        </div>
      )}
      
      {!hideControls && showControls && (
        <div className='note-card-controls'>
          <button onClick={onDelete}>
            <img src='/recycle-bin-icon.png' className='milestone-icon' />
          </button>
          <button onClick={onEdit}>
            <img src='/pencil-icon.png' className='milestone-icon' />
          </button>
        </div>
      )}
      {/* {instrument && (
        <p className={instrument.nickname || instrument.name ? 'milestone-tag' : ''}>
          {instrument.nickname || instrument.name}
        </p>
      )} */}
    </div>
  );
};

export default NoteDisplay;
