const EntryInstrumentItem = ({ entryId, instrument, loadEntries }) => {
  return <li>{instrument.nickname || instrument.name}</li>;
};
export default EntryInstrumentItem;
