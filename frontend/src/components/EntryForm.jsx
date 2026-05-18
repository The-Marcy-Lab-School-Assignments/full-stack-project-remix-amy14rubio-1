import { useState } from 'react';
import { createEntry } from '../adapters/entry-adapters';
import { createEntryInstrument } from '../adapters/entryInstrument-adapters';

const MOODS = ['😢', '😠', '😐', '😊', '😂'];

const EntryForm = ({ loadEntries, instruments }) => {
  const [selectedInstrumentIds, setSelectedInstrumentIds] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const title = form.elements.title.value;
    const body = form.elements.body.value;
    const mood = form.elements.mood.value;
    const date = form.elements.date.value;
    const practiceMinutes = form.elements.practiceMinutes.value;

    const { error } = await createEntry(
      date,
      title,
      body,
      mood,
      practiceMinutes,
      true,
      selectedInstrumentIds,
    );
    if (error) return console.error(error);

    await loadEntries();

    form.reset();
  };

  const handleInstrumentToggle = (instrument_id) => {
    setSelectedInstrumentIds((prev) =>
      prev.includes(instrument_id)
        ? prev.filter((id) => id !== instrument_id)
        : [...prev, instrument_id],
    );
  };

  return (
    <form onSubmit={handleSubmit} className='entry-form'>
      <h2>New Entry</h2>

      <label htmlFor='title-input'>Title</label>
      <input id='title-input' name='title' type='text' required />

      <label htmlFor='date-input'>Date</label>
      <input id='date-input' name='date' type='date' required />

      <label htmlFor='mood-select'>Mood</label>
      <select id='mood-select' name='mood' required>
        <option value=''>-- select --</option>
        {MOODS.map((emoji, i) => (
          <option key={i} value={i + 1}>
            {emoji}
          </option>
        ))}
      </select>

      <label htmlFor='body-input'>Entry</label>
      <textarea id='body-input' name='body' rows={4} placeholder='Write your entry here...' />

      <label htmlFor='practiceMinutes-input'>Practice minutes</label>
      <input id='practiceMinutes-input' name='practiceMinutes' type='number' required />

      {/* <input type='checkbox' checked={entry.is_complete} onChange={handleChange} />
      <span className={todo.is_complete ? 'completed' : ''}>{todo.title}</span> */}

      <fieldset>
        <legend>Instruments practiced</legend>
        {instruments.map((instrument) => (
          <label key={instrument.instrument_id}>
            <input
              type='checkbox'
              checked={selectedInstrumentIds.includes(instrument.instrument_id)}
              onChange={() => handleInstrumentToggle(instrument.instrument_id)}
            />
            {instrument.nickname || instrument.name}
          </label>
        ))}
      </fieldset>

      <button type='submit'>Save Entry</button>
    </form>
  );
};

export default EntryForm;
