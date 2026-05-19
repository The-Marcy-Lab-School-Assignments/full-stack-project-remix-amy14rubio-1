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
    <div>
      <ul>
        {localInstruments.map((instrument) => (
          <li key={instrument.instrument_id}>
            {instrument.nickname || instrument.name}
            <button type='button' onClick={() => handleRemove(instrument.instrument_id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      {availableInstruments.length >= 1 && (
        <select onChange={handleAdd} value=''>
          <option value=''>Add instrument</option>
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
