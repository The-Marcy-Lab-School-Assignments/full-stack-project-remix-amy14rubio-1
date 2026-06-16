const MilestoneEditForm = ({ formData, handleChange, handleUpdate, onCancel }) => {
  return (
    <div className='milestone-card'>
      <form onSubmit={handleUpdate}>
        <label>Title</label>
        <input name='title' value={formData.title} onChange={handleChange} />

        <div className='milestone-controls'>
          <button type='submit'>Save</button>

          <button type='button' onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default MilestoneEditForm;
