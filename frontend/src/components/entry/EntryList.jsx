import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import EntryCard from './EntryCard';

const EntryList = ({ entries, loadEntries, instruments, pieces, showControls }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const pages = [];

  for (let i = 0; i < entries.length; i += 2) {
    pages.push([entries[i] || null, entries[i + 1] || null]);
  }

  const totalPages = pages.length + 1;

  const turnPage = (dir) => {
    setCurrentPage((prev) => {
      if (dir === 1) return prev + 1;
      if (dir === -1 && prev > 0) return prev - 1;
      return prev;
    });
  };

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
        <div className='book-spine'></div>
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
        <button className='ctrl-btn' onClick={() => turnPage(-1)} disabled={currentPage === 0}>
          ← Prev
        </button>
        <span className='page-indicator'>
          {currentPage + 1} / {totalPages}
        </span>
        <button
          className='ctrl-btn'
          onClick={() => turnPage(1)}
          disabled={currentPage === totalPages - 1}
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default EntryList;
