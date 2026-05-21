import { useState } from 'react';

const EntryPieceManager = ({ entryId, entryPieces, pieces, onPiecesChange }) => {
  const [localPieces, setLocalPieces] = useState(entryPieces);

  const handleAdd = async (e) => {
    const pieceId = Number(e.target.value);
    const newPiece = pieces.find((piece) => piece.piece_id === pieceId);
    const updated = [...localPieces, newPiece];
    setLocalPieces(updated);
    onPiecesChange(updated);
  };

  const handleRemove = async (pieceId) => {
    const updated = localPieces.filter((piece) => piece.piece_id !== pieceId);
    setLocalPieces(updated);
    onPiecesChange(updated);
  };

  const availablePieces = pieces.filter(
    (piece) => !localPieces.some((local) => local.piece_id === piece.piece_id),
  );

  return (
    <div className='entry-list-controls'>
      <ul className='entry-list-form'>
        {localPieces.map((piece) => (
          <button
            key={piece.piece_id}
            className='entry-list-form-item'
            type='button'
            onClick={() => handleRemove(piece.piece_id)}
          >
            <li>{piece.title}</li>x
          </button>
        ))}
      </ul>
      {availablePieces.length >= 1 && (
        <select onChange={handleAdd} value=''>
          <option value=''>+</option>
          {availablePieces.map((piece) => (
            <option key={piece.piece_id} value={piece.piece_id}>
              {piece.title}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default EntryPieceManager;
