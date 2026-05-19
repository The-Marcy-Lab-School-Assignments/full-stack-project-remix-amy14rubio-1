import { useState } from 'react';
import { createMilestone } from '../../adapters/milestone-adapters';

const MilestoneForm = ({ milestones, loadMilestones, entries, instruments, pieces }) => {
  const [selectedInstrumentIds, setSelectedInstrumentIds] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const title = form.elements.title.value;
    const date = form.elements.date.value;
    const instrument_id = form.elements.instrument_id.value || null;
    const entry_id = form.elements.entry_id.value || null;
    const piece_id = form.elements.piece_id.value || null;

    const { error } = await createMilestone(instrument_id, entry_id, piece_id, title, date);
    if (error) return console.error(error);

    await loadMilestones();

    form.reset();
  };

  return (
    <form onSubmit={handleSubmit} className='entry-form'>
      <h2>New Milestone</h2>

      <label htmlFor='title-input'>Title</label>
      <input id='title-input' name='title' type='text' required />

      <label htmlFor='date-input'>Date</label>
      <input id='date-input' name='date' type='date' required />

      <label htmlFor='instrument-select'>Instruments</label>
      <select id='instrument-select' name='instrument_id'>
        <option value=''>-- select --</option>
        {instruments.map((instrument) => (
          <option key={instrument.instrument_id} value={Number(instrument.instrument_id)}>
            {instrument.nickname || instrument.name}
          </option>
        ))}
      </select>

      <label htmlFor='entry-select'>Entries</label>
      <select id='entry-select' name='entry_id'>
        <option value=''>-- select --</option>
        {entries.map((entry) => (
          <option key={entry.entry_id} value={Number(entry.entry_id)}>
            {entry.title}
          </option>
        ))}
      </select>

      <label htmlFor='piece-select'>Pieces</label>
      <select id='piece-select' name='piece_id'>
        <option value=''>-- select --</option>
        {pieces.map((piece) => (
          <option key={piece.piece_id} value={Number(piece.piece_id)}>
            {piece.title}
          </option>
        ))}
      </select>

      <button type='submit'>Save Milestone</button>
    </form>
  );
};

export default MilestoneForm;
