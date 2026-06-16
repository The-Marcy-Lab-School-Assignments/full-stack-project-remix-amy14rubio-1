import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import EntryCard from './EntryCard';

const EntryList = ({
  entries,
  loadEntries,
  instruments,
  pieces,
  showControls,
  onVisibleEntriesChange,
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  //sets cover page
  const pages = [['front', 'front']];

  for (let i = 0; i < entries.length; i += 2) {
    pages.push([entries[i] || null, entries[i + 1] || null]);
  }

  //sets back of journal cover
  pages.push(['back', 'back']);

  const totalPages = pages.length + 1;

  const turnPage = (dir) => {
    setCurrentPage((prev) => {
      if (dir === 1) return prev + 1;
      if (dir === -1 && prev > 0) return prev - 1;
      return prev;
    });
  };

  const getValidEntry = (entry) => {
    return typeof entry === 'object' && entry !== null ? entry : null;
  };

  let leftEntry = null;
  let rightEntry = null;

  if (currentPage === 1) {
    rightEntry = getValidEntry(pages[1]?.[0]);
  } else if (currentPage === totalPages - 2) {
    leftEntry = getValidEntry(pages[pages.length - 2]?.[1]);
  } else if (currentPage !== 0) {
    leftEntry = getValidEntry(pages[currentPage - 1]?.[1]);
    rightEntry = getValidEntry(pages[currentPage]?.[0]);
  }

  useEffect(() => {
    if (onVisibleEntriesChange) {
      onVisibleEntriesChange({
        left: leftEntry,
        right: rightEntry,
      });
    }
  }, [currentPage]);

  if (!entries.length && !showControls) return <p>No entries yet.</p>;
  return !showControls ? (
    <ul className='entry-list home-view'>
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
  ) : (
    <div className='journal-view'>
      <motion.div
        className='book'
        animate={{
          x: currentPage === 0 ? 0 : currentPage === totalPages - 1 ? '100%' : '50%',
        }}
        transition={{
          type: 'tween',
          ease: 'easeInOut',
          duration: 0.5,
        }}
      >
        {/* <div className='book-spine'></div> */}
        {pages.map((pageEntries, pageIndex) => {
          // each page gets a z-index so unflipped pages sit on top
          const isFlipped = pageIndex < currentPage;
          const zIndex = isFlipped ? pageIndex : totalPages - pageIndex;

          return (
            <motion.div
              key={`page-${pageIndex}`}
              className='page'
              animate={{
                rotateY: isFlipped ? -180 : 0,
              }}
              transition={{
                type: 'spring',
                stiffness: 180,
                damping: 28,
                mass: 0.2,
              }}
              style={{ zIndex }}
            >
              <div className='page-face page-back'>
                <EntryCard
                  entry={pageEntries[0]}
                  loadEntries={loadEntries}
                  instruments={instruments}
                  pieces={pieces}
                  showControls={showControls}
                />
              </div>

              <div className='page-face page-front'>
                <EntryCard
                  entry={pageEntries[1]}
                  loadEntries={loadEntries}
                  instruments={instruments}
                  pieces={pieces}
                  showControls={showControls}
                />
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <div className='controls'>
        <input
          type='range'
          min={0}
          max={totalPages - 1}
          value={currentPage}
          onChange={(e) => setCurrentPage(Number(e.target.value))}
          className='page-slider'
        />

        {/* <span className='page-indicator'>
          {currentPage + 1} / {totalPages}
        </span> */}
      </div>
    </div>
  );
};

export default EntryList;
