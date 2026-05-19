import EntryInstrumentItem from './EntryInstrumentItem';

const EntryInstrumentList = ({ entryId, entryInstruments, loadEntries }) => {
  return (
    <section>
      <ul className='entry-list'>
        {entryInstruments.map((instrument) => (
          <EntryInstrumentItem
            key={instrument.entry_instrument_id}
            entryId={entryId}
            instrument={instrument}
            loadEntries={loadEntries}
          />
        ))}
      </ul>
    </section>
  );
};

export default EntryInstrumentList;
