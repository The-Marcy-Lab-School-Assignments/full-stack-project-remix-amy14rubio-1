import { useState } from 'react';
import { createNote } from '../../adapters/note-adapters';

const NoteForm = ({ instruments, loadNotes, handleForm }) => {
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    instrument_id: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await createNote(
      formData.title,
      formData.body,
      formData.instrument_id || null,
      false,
    );
    if (error) return console.error(error);
    setFormData({ title: '', body: '', instrument_id: '' });
    await loadNotes();
    handleForm();
  };

  return (
    <form onSubmit={handleSubmit} className='entry-form'>
      <h2>New Note</h2>

      <label>Title</label>
      <input
        name='title'
        value={formData.title}
        onChange={handleChange}
        placeholder='Note title'
        required
      />
      <label>Body</label>
      <textarea
        name='body'
        value={formData.body}
        onChange={handleChange}
        placeholder='Write your note...'
        rows={4}
      />
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
