const InstrumentItem = ({ milestone, onDelete, onEdit, showControls }) => {
  return (
    <div className='instrument-item'>
      {/* <div className='milestone-card-header'>
        <span className='milestone-card-title'>{milestone.title}</span>
        {showControls && (
          <div className='milestone-card-controls'>
            <button onClick={onDelete}>
              <img src='/recycle-bin-icon.png' className='milestone-icon' />
            </button>
            <button onClick={onEdit}>
              <img src='/pencil-icon.png' className='milestone-icon' />
            </button>
          </div>
        )}
      </div>
      <p className='milestone-card-meta'>{milestone.date.split('T')[0]}</p>
      <div className='milestone-tags'>
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

export default InstrumentItem;
