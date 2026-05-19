import EntryCard from './EntryCard';

const EntryList = ({ entries, loadEntries, instruments, pieces, showControls }) => {
  return (
    <section>
      <ul className='entry-list'>
        {entries.map((entry) => (
          <EntryCard
            key={entry.entry_id}
            entry={entry}
            loadEntries={loadEntries}
            instruments={instruments}
            pieces={pieces}
            showControls={showControls}
          />
        ))}
      </ul>
    </section>
  );
};

export default EntryList;
