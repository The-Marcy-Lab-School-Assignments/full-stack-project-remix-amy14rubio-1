const MilestoneEditForm = ({ formData, handleChange, handleUpdate, onCancel }) => {
  return (
    <li className='entry-card'>
      <form onSubmit={handleUpdate}>
        <label>Title</label>
        <input name='title' value={formData.title} onChange={handleChange} />

        <button type='submit'>Save</button>

        <button type='button' onClick={onCancel}>
          Cancel
        </button>
      </form>
    </li>
  );
};

export default MilestoneEditForm;
