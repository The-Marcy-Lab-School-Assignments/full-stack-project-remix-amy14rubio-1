import { useState } from 'react';
import { createEntry } from '../../adapters/entry-adapters';
import TagSelector from './TagSelector';

const MOODS = ['😢', '😠', '😐', '😊', '😂'];

const EntryForm = ({ loadEntries, instruments, pieces, handleCancel }) => {
  const [selectedTags, setSelectedTags] = useState([]);
  const tagItems = [
    ...instruments.map((instrument) => ({
      type: 'instrument',
      id: instrument.instrument_id,
      label: instrument.nickname || instrument.name,
    })),

    ...pieces.map((piece) => ({
      type: 'piece',
      id: piece.piece_id,
      label: piece.title,
    })),
  ];

  const selectedInstrumentIds = selectedTags
    .filter((tag) => tag.type === 'instrument')
    .map((tag) => tag.id);

  const selectedPieceIds = selectedTags.filter((tag) => tag.type === 'piece').map((tag) => tag.id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const title = form.elements.title.value;
    const body = form.elements.body.value;
    const mood = form.elements.mood.value;
    const date = new Date().toISOString().split('T')[0];
    const practiceMinutes = form.elements.practiceMinutes.value;

    const { error } = await createEntry(
      date,
      title,
      body,
      mood || null,
      practiceMinutes || null,
      true,
      selectedInstrumentIds,
      selectedPieceIds,
    );
    if (error) return console.error(error);

    await loadEntries();
    form.reset();
    handleCancel();
  };

  return (
    <form onSubmit={handleSubmit} className='entry-form'>
      <label htmlFor='title-input' style={{ display: 'none' }}>
        Title
      </label>
      <input id='title-input' name='title' type='text' placeholder='New Entry' required />

      <label htmlFor='body-input' style={{ display: 'none' }}>
        Entry body
      </label>
      <textarea id='body-input' name='body' rows={4} placeholder='Write your entry here...' />
      <div className='tag-group'>
        <label htmlFor='tags-input'>Tags:</label>
        <TagSelector items={tagItems} selectedItems={selectedTags} onChange={setSelectedTags} />
      </div>
      <div className='form-group'>
        <div>
          <label htmlFor='practiceMinutes-input' placeholder='10 mins' style={{ display: 'none' }}>
            Practice minutes
          </label>
          <p>Practiced for</p>
          <input id='practiceMinutes-input' name='practiceMinutes' type='number' placeholder='10' />
        </div>
        <div>
          <label htmlFor='mood-select' style={{ display: 'none' }}>
            Mood
          </label>
          <p>minutes and felt</p>
          <select id='mood-select' name='mood'>
            {MOODS.map((emoji, i) => (
              <option key={i} value={i + 1}>
                {emoji}
              </option>
            ))}
          </select>
        </div>
      </div>
      <button type='submit'>Save</button>
    </form>
  );
};

export default EntryForm;
