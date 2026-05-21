const EntryPieceList = ({ entryPieces }) => {
  return (
    <ul className='entry-list'>
      {entryPieces.map((piece) => (
        <li key={piece.entry_piece_id} className='entry-list-item'>
          {piece.title}
        </li>
      ))}
    </ul>
  );
};

export default EntryPieceList;
