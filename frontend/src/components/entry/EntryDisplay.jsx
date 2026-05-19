import EntryInstrumentList from './EntryInstrumentList';

const MOODS = ['😢', '😠', '😐', '😊', '😂'];

const EntryDisplay = ({ entry, onDelete, onEdit, loadEntries, showControls }) => {
  return (
    <li className='entry-card'>
      <div className='entry-card-header'>
        <span className='entry-card-title'>{entry.title}</span>

        <span className='entry-card-mood'>{MOODS[entry.mood - 1]}</span>
      </div>
      <p className='entry-card-meta'>{entry.date.split('T')[0]}</p>
      <p className='entry-card-body'>{entry.body}</p>
      <p className='entry-card-practice-minutes'>Practiced: {entry.practice_minutes} mins</p>
      <EntryInstrumentList
        entryId={entry.entry_id}
        entryInstruments={entry.instruments}
        loadEntries={loadEntries}
      />
      <ul className='entry-list'>
        {entry.pieces.map((piece) => (
          <li key={piece.entry_piece_id}>{piece.title}</li>
        ))}
      </ul>
      {showControls && (
        <div className='entry-card-controls'>
          <button onClick={onDelete}>Delete</button>

          <button onClick={onEdit}>Edit</button>
        </div>
      )}
    </li>
  );
};

export default EntryDisplay;
