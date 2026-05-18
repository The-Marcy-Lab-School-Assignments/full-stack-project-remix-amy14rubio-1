import EntryCard from './EntryCard';

const EntryList = ({ entries, loadEntries, instruments }) => {
  return (
    <section>
      <h2>Past Entries </h2>
      <ul className='entry-list'>
        {entries.map((entry) => (
          <EntryCard
            key={entry.entry_id}
            id={entry.entry_id}
            title={entry.title}
            body={entry.body}
            mood={entry.mood}
            date={entry.date}
            practice_minutes={entry.practice_minutes}
            is_private={entry.is_private}
            loadEntries={loadEntries}
            instruments={instruments}
          />
        ))}
      </ul>
    </section>
  );
};

export default EntryList;
