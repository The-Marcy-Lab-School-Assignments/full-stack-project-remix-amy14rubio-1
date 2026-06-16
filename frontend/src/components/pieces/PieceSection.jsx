// import { useParams } from 'react-router-dom';
import EntryList from '../entry/EntryList';
const PieceSection = ({ piece, loadPieces, entries, loadEntries, instruments }) => {
  //   const { pieceId } = useParams();
  //   const piece = pieces.find((p) => p.piece_id === Number(pieceId));
  //   console.log(piece, pieceId);
  const STATUSES = [
    { value: 'learning', label: 'Learning' },
    { value: 'polishing', label: 'Polishing' },
    { value: 'performance_ready', label: 'Performance Ready' },
    { value: 'archived', label: 'Archived' },
  ];
  const cleanUrl = piece.pdf_url ? `${piece.pdf_url}#toolbar=0&navpanes=0&view=FitH` : '';
  const relatedEntries = [...entries]
    .filter((entry) => entry.pieces.some((p) => p.title === piece.title))
    .slice(0, 5);
  return (
    <section className='piece-section'>
      <div className='piece-grid'>
        <div className='piece-media'>
          {piece.image_url ? (
            <a href={piece.image_url} target='_blank' rel='noreferrer'>
              <img className='piece-media-img' src={piece.image_url} alt={piece.title} />
            </a>
          ) : piece.sheet_music_thumbnail_url ? (
            <a href={piece.sheet_music_url} target='_blank' rel='noreferrer'>
              <img
                className='piece-media-img'
                src={piece.sheet_music_thumbnail_url}
                alt={piece.title}
              />
            </a>
          ) : piece.pdf_url ? (
            <a href={piece.pdf_url} target='_blank' rel='noreferrer'>
              <object
                data={cleanUrl}
                type='application/pdf'
                width='100%'
                height='100%'
                //   src='https://www.shutterstock.com/image-vector/business-meeting-outlined-line-vector-260nw-526556023.jpg'
                //   alt='pdf'
              />
            </a>
          ) : (
            <img
              src='https://s3.eu-central-2.wasabisys.com/bub/wp-media-folder-british-university-of-bahrain-uk-bachelor-degree-courses/wp-content/uploads/2018/02/image-placeholder.jpg'
              alt='image placeholder'
            />
          )}
        </div>

        <div className='piece-info'>
          <div className='piece-title'>
            <h3>{piece.title}</h3>
            <p>{piece.composer}</p>
          </div>
          <div className='piece-tags'>
            <p>{STATUSES.find((status) => status.value === piece.status).label}</p>
            {(piece.instruments.nickname || piece.instruments.name) && (
              <p>{piece.instruments.nickname || piece.instruments.name}</p>
            )}
          </div>
          {relatedEntries.length > 0 && (
            <div className='piece-related-entries'>
              <h2>Related Entires</h2>
              <div>
                <EntryList
                  entries={relatedEntries}
                  loadEntries={loadEntries}
                  instruments={instruments}
                />
              </div>
            </div>
          )}

          {(piece.image_url || piece.sheet_music_thumbnail_url || piece.pdf_url) && (
            <div className='link-preview'>
              {piece.image_url ? (
                <a href={piece.image_url} target='_blank' rel='noreferrer'>
                  <img className='piece-media-img' src={piece.image_url} alt={piece.title} />
                  <p>{piece.image_url.split('_')[1]}</p>
                </a>
              ) : piece.sheet_music_thumbnail_url ? (
                <a href={piece.sheet_music_url} target='_blank' rel='noreferrer'>
                  <img
                    className='piece-media-img'
                    src={piece.sheet_music_thumbnail_url}
                    alt={piece.title}
                  />
                  <p>{piece.sheet_music_title}</p>
                </a>
              ) : piece.pdf_url ? (
                <a href={piece.pdf_url} target='_blank' rel='noreferrer'>
                  <img
                    src='https://www.shutterstock.com/image-vector/business-meeting-outlined-line-vector-260nw-526556023.jpg'
                    alt='pdf'
                  />
                  <p>{piece.pdf_url.split('_')[1]}</p>
                </a>
              ) : (
                <></>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PieceSection;
