const EntryInstrumentList = ({ entryInstruments }) => {
  return (
    <ul className='entry-list'>
      {entryInstruments.map((instrument) => (
        <li key={instrument.entry_instrument_id} className='entry-list-item'>
          {instrument.nickname || instrument.name}
        </li>
      ))}
    </ul>
  );
};

export default EntryInstrumentList;
