const MilestoneDisplay = ({ milestone, onDelete, onEdit, showControls }) => {
  return (
    <li className='milestone-card'>
      <div className='milestone-card-header'>
        <span className='milestone-card-title'>{milestone.title}</span>
      </div>
      <p className='milestone-card-meta'>{milestone.date.split('T')[0]}</p>
      <p className='milestone-card-meta'>
        {milestone.instrument.nickname || milestone.instrument.name}
      </p>
      <p className='milestone-card-meta'>{milestone.entry.title}</p>
      <p className='milestone-card-meta'>{milestone.piece.title}</p>

      {showControls && (
        <div className='milestone-card-controls'>
          <button onClick={onDelete}>Delete</button>
          <button onClick={onEdit}>Edit</button>
        </div>
      )}
    </li>
  );
};

export default MilestoneDisplay;
