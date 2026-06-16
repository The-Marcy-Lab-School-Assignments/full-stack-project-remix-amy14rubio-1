import PieceCard from './PieceCard';

const PieceList = ({ pieces, loadPieces, instruments }) => {
  if (!pieces.length) return <p>No pieces yet.</p>;
  return (
    <ul className='piece-list'>
      {pieces.map((piece) => (
        <PieceCard key={piece.piece_id} piece={piece} instruments={instruments} />
      ))}
    </ul>
  );
};

export default PieceList;
