import EntryInstrumentList from './EntryInstrumentList';
import EntryPieceList from './EntryPieceList';

const getEmojiName = (emojiChar) => {
  // Returns the standard Unicode block name for the emoji
  const charCode = emojiChar.codePointAt(0);
  return charCode;
};

//either change moods to urls or classnames
const MOODS = ['😢', '😠', '😐', '😊', '😂'];

const EntryDisplay = ({ entry, onEdit, loadEntries, showControls }) => {
  return (
    <div className='entry-card' onClick={onEdit}>
      <div className='entry-card-header'>
        <p className='entry-card-title'>{entry.title}</p>
      </div>
      {showControls && <p className='entry-card-meta'>{entry.date.split('T')[0]}</p>}
      {entry.body && <p className='entry-card-body'>{entry.body}</p>}

      {entry.practice_minutes && entry.mood ? (
        <p className='entry-card-practice'>
          Practiced for {entry.practice_minutes} minutes and felt {MOODS[entry.mood - 1]}{' '}
          {/* {getEmojiName(MOODS[entry.mood - 1])} */}
        </p>
      ) : entry.practice_minutes && !entry.mood ? (
        <p className='entry-card-practice'>Practiced for {entry.practice_minutes} minutes</p>
      ) : !entry.practice_minutes && entry.mood ? (
        <p className='entry-card-practice'>This practice session felt {MOODS[entry.mood - 1]}</p>
      ) : (
        <></>
      )}

      {showControls && (
        // <div className='entry-footer'>
        //   {showControls && (
        <div className='entry-tags'>
          <EntryInstrumentList entryInstruments={entry.instruments} />
          <EntryPieceList entryPieces={entry.pieces} />
        </div>
        //   )}
        // </div>
      )}
    </div>
  );
};

export default EntryDisplay;
