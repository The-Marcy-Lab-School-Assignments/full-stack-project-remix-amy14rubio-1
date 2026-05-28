// figure out if the database is appropriately importing the pdfs
import { useState, useEffect } from 'react';
// import { uploadPieceFile, createPiece } from '../../adapters/piece-adapters';

import PieceForm from './PieceForm';
import PieceList from './PieceList';
import Navbar from '../Navbar';
import PieceDisplayPage from './PieceDisplayPage';

function PiecePage({ currentUser, pieces, loadPieces, isLoading, error, instruments }) {
  const [formReveal, setFormReveal] = useState(false);
  // const [selectedPiece, setSelectedPiece] = useState(null);

  const handleCreate = () => {
    setFormReveal(true);
  };

  const handleCancel = () => {
    setFormReveal(false);
  };

  return (
    <main>
      <Navbar />
      <section>
        {!formReveal && (
          <div className='piece-header'>
            <h1>PIECES</h1>
            <div>
              <button onClick={handleCreate} className={`create-entry`}>
                +
              </button>
            </div>
          </div>
        )}
        {formReveal && (
          <div className='milestone-container'>
            <PieceForm
              instruments={instruments}
              loadPieces={loadPieces}
              handleCancel={handleCancel}
            />
            <button onClick={handleCancel} className={`cancel-entry`}>
              x
            </button>
          </div>
        )}
        {isLoading && <p>Loading notes...</p>}
        {error && <p className='error'>Something went wrong: {error}</p>}
        {!formReveal && (
          <div>
            <PieceList pieces={pieces} loadPieces={loadPieces} instruments={instruments} />
          </div>
        )}
        {/* {selectedPiece ? (
          <PieceModal piece={selectedPiece} onBack={() => setSelectedPiece(null)} />
        ) : (
          <div>
            
          </div>
        )} */}
      </section>
    </main>
  );
}

export default PiecePage;
