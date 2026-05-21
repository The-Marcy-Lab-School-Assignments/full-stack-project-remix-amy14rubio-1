import EntryInstrumentManager from './EntryInstrumentManager';
import EntryPieceManager from './EntryPieceManager';

const MOODS = ['😢', '😠', '😐', '😊', '😂'];

const EntryEditForm = ({
  formData,
  handleChange,
  handleUpdate,
  onCancel,
  entry,
  instruments,
  onInstrumentsChange,
  pieces,
  onPiecesChange,
}) => {
  return (
    <div className='entry-card'>
      <form onSubmit={handleUpdate}>
        <label>Title</label>
        <input name='title' value={formData.title} onChange={handleChange} />

        <label>Entry</label>
        <textarea name='body' value={formData.body} onChange={handleChange} rows={4} />

        <label>Date</label>
        <input name='date' type='date' value={formData.date} onChange={handleChange} />

        <div className='form-group'>
          <div>
            <label>Practice Minutes</label>
            <input
              name='practice_minutes'
              type='number'
              value={formData.practice_minutes}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Mood</label>
            <select
              className='mood-select'
              name='mood'
              value={formData.mood}
              onChange={handleChange}
            >
              {MOODS.map((emoji, i) => (
                <option key={i} value={i + 1}>
                  {emoji}
                </option>
              ))}
            </select>
          </div>
        </div>

        <EntryInstrumentManager
          entryId={entry.entry_id}
          entryInstruments={entry.instruments}
          instruments={instruments}
          onInstrumentsChange={onInstrumentsChange}
        />

        <EntryPieceManager
          entryId={entry.entry_id}
          entryPieces={entry.pieces}
          pieces={pieces}
          onPiecesChange={onPiecesChange}
        />

        <div className='entry-controls'>
          <button type='submit'>Save</button>

          <button type='button' onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EntryEditForm;
