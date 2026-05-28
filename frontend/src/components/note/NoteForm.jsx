import { useState } from 'react';
import { createNote } from '../../adapters/note-adapters';

const NoteForm = ({ instruments, loadNotes, handleCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    instrument_id: '',
    pinned: false,
  });

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await createNote(
      formData.title,
      formData.body,
      formData.instrument_id || null,
      formData.pinned,
    );
    if (error) return console.error(error);
    setFormData({ title: '', body: '', instrument_id: '', pinned: false });
    await loadNotes();
    handleCancel();
  };

  return (
    <form onSubmit={handleSubmit} className='entry-form'>
      <label htmlFor='title-input' style={{ display: 'none' }}>
        Title
      </label>
      <input
        id='title-input'
        name='title'
        type='text'
        placeholder='New Note'
        value={formData.title}
        onChange={handleChange}
        required
      />

      {/* <label>Body</label>
      <textarea
        name='body'
        value={formData.body}
        onChange={handleChange}
        placeholder='Write your note...'
        rows={4}
      /> */}
      <label htmlFor='body-input' style={{ display: 'none' }}>
        Note body
      </label>
      <textarea
        id='body-input'
        name='body'
        rows={4}
        value={formData.body}
        onChange={handleChange}
        placeholder='Write your note here...'
      />
      <div className='note-checkbox'>
        <label>
          <input name='pinned' type='checkbox' checked={formData.pinned} onChange={handleChange} />
          Pinned
        </label>
      </div>
      <label>Instrument (optional)</label>
      <select name='instrument_id' value={formData.instrument_id} onChange={handleChange}>
        <option value=''>No instrument</option>
        {instruments.map((instrument) => (
          <option key={instrument.instrument_id} value={instrument.instrument_id}>
            {instrument.nickname || instrument.name}
          </option>
        ))}
      </select>
      <button type='submit'>Save</button>
    </form>
  );
};

export default NoteForm;
