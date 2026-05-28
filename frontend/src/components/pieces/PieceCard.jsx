import { useNavigate } from 'react-router-dom';
const PieceCard = ({ piece, instruments, handleFileUpload, onClick }) => {
  const navigate = useNavigate();
  const STATUSES = [
    { value: 'learning', label: 'Learning' },
    { value: 'polishing', label: 'Polishing' },
    { value: 'performance_ready', label: 'Performance Ready' },
    { value: 'archived', label: 'Archived' },
  ];
  return (
    <div className='piece-card' onClick={() => navigate(`/pieces/${piece.piece_id}`)}>
      {/* <div className='piece-media'>
        {piece.image_url ? (
          // <a href={piece.image_url} target='_blank' rel='noreferrer'>
          <img className='piece-media-img' src={piece.image_url} alt={piece.title} />
        ) : // </a>
        piece.sheet_music_thumbnail_url ? (
          // <a href={piece.sheet_music_url} target='_blank' rel='noreferrer'>
          <img
            className='piece-media-img'
            src={piece.sheet_music_thumbnail_url}
            alt={piece.title}
          />
        ) : // </a>
        piece.pdf_url ? (
          // <a href={piece.pdf_url} target='_blank' rel='noreferrer'>
          <img
            src='https://www.shutterstock.com/image-vector/business-meeting-outlined-line-vector-260nw-526556023.jpg'
            alt='pdf'
          />
        ) : (
          // </a>
          <img
            src='https://s3.eu-central-2.wasabisys.com/bub/wp-media-folder-british-university-of-bahrain-uk-bachelor-degree-courses/wp-content/uploads/2018/02/image-placeholder.jpg'
            alt='image placeholder'
          />
        )}
      </div> */}

      <div className='piece-card-info'>
        <div className='piece-card-header'>
          <h3>{piece.title}</h3>
          <p>{piece.composer}</p>
        </div>
        {/* <div className='piece-tags'>
          <p>{STATUSES.find((status) => status.value === piece.status).label}</p>
          {(piece.instruments.nickname || piece.instruments.name) && (
            <p>{piece.instruments.nickname || piece.instruments.name}</p>
          )}
        </div> */}
      </div>
    </div>
  );
};

export default PieceCard;
