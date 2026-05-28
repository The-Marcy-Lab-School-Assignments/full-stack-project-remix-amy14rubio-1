import { useState } from 'react';
const TagSelector = ({ items, selectedItems, onChange }) => {
  const handleAdd = (e) => {
    const value = e.target.value;
    const item = items.find((item) => `${item.type}-${item.id}` === value);
    onChange([...selectedItems, item]);
  };

  const handleRemove = (itemToRemove) => {
    onChange(
      selectedItems.filter(
        (item) => !(item.type === itemToRemove.type && item.id === itemToRemove.id),
      ),
    );
  };

  const availableItems = items.filter(
    (item) =>
      !selectedItems.some((selected) => selected.type === item.type && selected.id === item.id),
  );

  return (
    <div className='entry-list-controls'>
      {selectedItems.map((item) => (
        <button
          key={`${item.type}-${item.id}`}
          type='button'
          className={`entry-list-form-item ${item.type === 'instrument' ? 'instrument-tag' : 'piece-tag'}`}
          onClick={() => handleRemove(item)}
        >
          {item.label}
          <span>×</span>
        </button>
      ))}

      {availableItems.length > 0 && (
        <select onChange={handleAdd} value=''>
          <option value=''>+</option>
          {availableItems.map((item) => (
            <option key={`${item.type}-${item.id}`} value={`${item.type}-${item.id}`}>
              {item.type === 'instrument' ? `${item.label}` : `${item.label}`}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default TagSelector;
