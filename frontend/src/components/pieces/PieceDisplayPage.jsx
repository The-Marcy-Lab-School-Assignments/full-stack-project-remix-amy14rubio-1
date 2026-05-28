// import { useParams } from 'react-router-dom';
import PieceSection from './PieceSection';
const PieceDisplayPage = ({ pieces, loadPieces, entries, loadEntries, instruments }) => {
  // const { pieceId } = useParams();
  // const piece = pieces.find((p) => p.piece_id === Number(pieceId));
  // console.log(piece, pieceId);

  return (
    <div className='piece-scroll-container'>
      {pieces.map((piece) => (
        <PieceSection
          key={piece.piece_id}
          piece={piece}
          loadPieces={loadPieces}
          entries={entries}
          loadEntries={loadEntries}
          instruments={instruments}
        />
      ))}
    </div>
  );
};

export default PieceDisplayPage;
