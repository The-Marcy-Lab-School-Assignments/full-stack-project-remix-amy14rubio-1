import { useState } from 'react';

const EntryInstrumentManager = ({
  entryId,
  entryInstruments,
  instruments,
  onInstrumentsChange,
}) => {
  const [localInstruments, setLocalInstruments] = useState(entryInstruments);

  const handleAdd = async (e) => {
    const instrumentId = Number(e.target.value);
    const newInstrument = instruments.find(
      (instrument) => instrument.instrument_id === instrumentId,
    );
    const updated = [...localInstruments, newInstrument];
    setLocalInstruments(updated);
    onInstrumentsChange(updated);
  };

  const handleRemove = async (instrumentId) => {
    const updated = localInstruments.filter(
      (instrument) => instrument.instrument_id !== instrumentId,
    );
    setLocalInstruments(updated);
    onInstrumentsChange(updated);
  };

  const availableInstruments = instruments.filter(
    (instrument) =>
      !localInstruments.some((local) => local.instrument_id === instrument.instrument_id),
  );

  return (
    <div className='entry-list-controls'>
      <ul className='entry-list-form'>
        {localInstruments.map((instrument) => (
          <button
            key={instrument.instrument_id}
            className='entry-list-form-item'
            type='button'
            onClick={() => handleRemove(instrument.instrument_id)}
          >
            <li>{instrument.nickname || instrument.name}</li>x
          </button>
        ))}
      </ul>
      {availableInstruments.length >= 1 && (
        <select onChange={handleAdd} value=''>
          <option value=''>+</option>
          {availableInstruments.map((instrument) => (
            <option key={instrument.instrument_id} value={instrument.instrument_id}>
              {instrument.nickname || instrument.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default EntryInstrumentManager;
