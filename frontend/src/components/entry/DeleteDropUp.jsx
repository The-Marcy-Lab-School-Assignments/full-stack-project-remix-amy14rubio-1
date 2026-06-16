import { useState, useEffect } from 'react';
import { deleteEntry } from '../../adapters/entry-adapters';

const DeleteDropUp = ({ leftEntry, rightEntry, loadEntries, setOpen, open }) => {
  const handleDelete = async (entry) => {
    const { error } = await deleteEntry(entry.entry_id);
    if (error) return console.error(error);
    await loadEntries();
  };
  return (
    <div className='delete-dropup' onClick={(e) => e.stopPropagation()}>
      {(leftEntry || rightEntry) && (
        <button type='button' className='delete-trigger' onClick={() => setOpen((prev) => !prev)}>
          <img src='/recycle-bin-icon.png' className='entry-icon' />
        </button>
      )}
      {open && (
        <div className='dropup-menu'>
          {leftEntry && (
            <button
              type='button'
              className='dropup-item delete'
              onClick={() => handleDelete(leftEntry)}
            >
              Delete Page Left
            </button>
          )}

          {rightEntry && (
            <button
              type='button'
              className='dropup-item delete'
              onClick={() => handleDelete(rightEntry)}
            >
              Delete Page Right
            </button>
          )}
        </div>
      )}
    </div>
  );
};
export default DeleteDropUp;
