const NoteEditForm = ({ formData, handleChange, handleUpdate, onCancel }) => {
  return (
    <div className='note-card'>
      <form onSubmit={handleUpdate}>
        <label>Title</label>
        <input name='title' value={formData.title} onChange={handleChange} />

        <label>Body</label>
        <textarea name='body' value={formData.body} onChange={handleChange} rows={4} />

        <div className='note-checkbox'>
          <label>
            <input
              name='pinned'
              type='checkbox'
              checked={formData.pinned}
              onChange={handleChange}
            />
            Pinned
          </label>
        </div>

        <div className='note-controls'>
          <button type='submit'>Save</button>
          <button type='button' onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default NoteEditForm;
