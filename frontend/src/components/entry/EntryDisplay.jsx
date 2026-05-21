import EntryInstrumentList from './EntryInstrumentList';
import EntryPieceList from './EntryPieceList';

//either change moods to urls or classnames
const MOODS = ['sad', 'angry', 'eh', 'happy', 'funny'];

const EntryDisplay = ({ entry, onDelete, onEdit, loadEntries, showControls }) => {
  return (
    <div className='entry-card'>
      <div className='entry-card-header'>
        <p className='entry-card-title'>{entry.title}</p>
        <p className='entry-card-meta'>{entry.date.split('T')[0]}</p>
      </div>
      {/* <span className='entry-card-mood'>{MOODS[entry.mood - 1]}</span> */}
      <p className='entry-card-body'>{entry.body}</p>
      <div className='entry-tags'>
        <EntryInstrumentList entryInstruments={entry.instruments} />
        <EntryPieceList entryPieces={entry.pieces} />
      </div>
      {showControls && (
        <div className='entry-footer'>
          <div className='entry-card-controls'>
            <button onClick={onDelete}>
              <img src='/recycle-bin-icon.png' className='entry-icon' />
            </button>

            <button onClick={onEdit}>
              <img src='/pencil-icon.png' className='entry-icon' />
            </button>
          </div>
          <p className='entry-card-practice-minutes'>Practiced: {entry.practice_minutes} mins</p>
        </div>
      )}
    </div>
  );
};

export default EntryDisplay;
