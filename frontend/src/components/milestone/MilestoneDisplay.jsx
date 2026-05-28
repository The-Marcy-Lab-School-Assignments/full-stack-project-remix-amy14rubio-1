import { useState } from 'react';
const MilestoneDisplay = ({ milestone, onDelete, onEdit, showControls }) => {
  const [hideControls, setHideControls] = useState(true);
  const handleCardFlip = () => {
    if (showControls) setHideControls((prev) => !prev);
  };
  return (
    <div className='milestone-card' onClick={() => handleCardFlip()}>
      <div className='milestone-card-header'>
        {hideControls && <span className='milestone-card-title'>{milestone.title}</span>}
        {hideControls && showControls && (
          <p className='milestone-card-meta'>{milestone.date.split('T')[0]}</p>
        )}
      </div>
      {!hideControls && showControls && (
        <div className='milestone-card-controls'>
          <button onClick={onDelete}>
            <img src='/recycle-bin-icon.png' className='milestone-icon' />
          </button>
          <button onClick={onEdit}>
            <img src='/pencil-icon.png' className='milestone-icon' />
          </button>
        </div>
      )}
      {/* <div className='milestone-tags'>
        <p
          className={
            milestone.instrument.nickname || milestone.instrument.name ? 'milestone-tag' : ''
          }
        >
          {milestone.instrument.nickname || milestone.instrument.name}
        </p>
        <p className={milestone.entry.title ? 'milestone-tag' : ''}>{milestone.entry.title}</p>
        <p className={milestone.piece.title ? 'milestone-tag' : ''}>{milestone.piece.title}</p>
      </div> */}
    </div>
  );
};

export default MilestoneDisplay;
