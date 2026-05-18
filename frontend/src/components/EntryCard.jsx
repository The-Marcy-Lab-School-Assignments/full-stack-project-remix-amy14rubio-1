import { useState } from 'react';
import { deleteEntry, updateEntry } from '../adapters/entry-adapters';

const MOODS = ['😢', '😠', '😐', '😊', '😂'];

const EntryCard = ({
  id,
  title,
  body,
  mood,
  date,
  practice_minutes,
  is_private,
  loadEntries,
  instruments,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title,
    body,
    mood,
    date: date.split('T')[0],
    practice_minutes,
  });

  const handleDelete = async (e) => {
    const { error } = await deleteEntry(id);
    if (error) return console.error(error);
    await loadEntries();
  };

  const handleChange = async (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const { error } = await updateEntry(
      id,
      formData.title,
      formData.body,
      formData.mood,
      formData.date,
      formData.practice_minutes,
    );
    if (error) return console.error(error);
    setIsEditing(false);
    await loadEntries();
  };

  if (isEditing) {
    return (
      <li className='entry-card'>
        <form onSubmit={handleUpdate}>
          <label htmlFor='title-input'>Title</label>
          <input name='title' value={formData.title} onChange={handleChange} placeholder='Title' />

          <label htmlFor='body-input'>Entry</label>
          <textarea
            name='body'
            value={formData.body}
            onChange={handleChange}
            placeholder='Write your entry here...'
            rows={4}
          />

          <label htmlFor='mood-select'>Mood</label>
          <select name='mood'>
            <option value={formData.mood} onChange={handleChange}>
              {MOODS[formData.mood - 1]}
            </option>
            {MOODS.map((emoji, i) => (
              <option key={i} value={i + 1}>
                {emoji}
              </option>
            )).filter((emoji, i) => i !== formData.mood - 1)}
          </select>

          <label htmlFor='date-input'>Date</label>
          <input name='date' type='date' value={formData.date} onChange={handleChange} />

          <label htmlFor='practiceMinutes-input'>Practice minutes</label>
          <input
            name='practice_minutes'
            type='number'
            value={formData.practice_minutes}
            onChange={handleChange}
            placeholder='Practice minutes'
          />
          <button type='submit'>Save</button>
          <button type='button' onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </form>
      </li>
    );
  }

  return (
    <li className='entry-card'>
      <div className='entry-card-header'>
        <span className='entry-card-title'>{title}</span>
        <span className='entry-card-mood'>{MOODS[mood - 1]}</span>
      </div>
      <p className='entry-card-meta'>{date.split('T')[0]}</p>
      <p className='entry-card-body'>{body}</p>
      <p className='entry-card-practice-minutes'>Practiced: {practice_minutes} mins</p>
      <p className='entry-card-practice-minutes'>{is_private ? 'private' : 'public'}</p>
      <div className='entry-card-controls'>
        <button onClick={handleDelete}>Delete</button>
        <button onClick={() => setIsEditing(true)}>Edit</button>
      </div>
    </li>
  );
};

export default EntryCard;
