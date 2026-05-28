import { useState } from 'react';
import { createPiece, uploadPieceFile } from '../../adapters/piece-adapters';
import SheetMusicModal from './SheetMusicModal';

const PieceForm = ({ instruments, loadPieces, handleCancel }) => {
  const [showSheetMusicModal, setShowSheetMusicModal] = useState(false);

  const [formData, setFormData] = useState({
    instrument_id: '',
    title: '',
    composer: '',
    status: 'learning',
    recording_url: '',
    sheet_music_url: '',
  });

  const STATUSES = [
    { value: 'learning', label: 'Learning' },
    { value: 'polishing', label: 'Polishing' },
    { value: 'performance_ready', label: 'Performance Ready' },
    { value: 'archived', label: 'Archived' },
  ];

  const [attachment, setAttachment] = useState({
    type: null,
    file: null,
    url: '',
    preview: null,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newPiece = await createPiece(
      formData.instrument_id || null,
      formData.title,
      formData.composer,
      formData.status,
      formData.recording_url,
      attachment.type === 'url' ? attachment.url : null,
    );
    if (newPiece.error) return console.error(newPiece.error);

    if (attachment.type === 'file') {
      await uploadPieceFile(Number(newPiece.data.piece_id), attachment.file);
    }

    setFormData({
      instrument_id: '',
      title: '',
      composer: '',
      status: 'learning',
      recording_url: '',
      sheet_music_url: '',
    });
    setAttachment({
      type: null,
      file: null,
      url: '',
      preview: null,
    });
    await loadPieces();
    handleCancel();
  };

  return (
    <form onSubmit={handleSubmit} className='piece-form'>
      <label htmlFor='title-input' style={{ display: 'none' }}>
        Title
      </label>
      <input
        name='title'
        id='title-input'
        value={formData.title}
        onChange={handleChange}
        placeholder='Piece title'
        required
      />
      <label>Composer</label>
      <input
        name='composer'
        value={formData.composer}
        onChange={handleChange}
        placeholder='Composer'
      />

      <label htmlFor='status-select'>Status</label>
      <select id='status-select' name='status' value={formData.status} onChange={handleChange}>
        {STATUSES.map((status) => (
          <option key={status.value} value={status.value}>
            {status.label}
          </option>
        ))}
      </select>

      <label>Recording URL</label>
      <input
        name='recording_url'
        value={formData.recording_url}
        onChange={handleChange}
        placeholder='Recording URL'
      />

      <label>Instrument (optional)</label>
      <select name='instrument_id' value={formData.instrument_id} onChange={handleChange}>
        <option value=''>No instrument</option>
        {instruments.map((instrument) => (
          <option key={instrument.instrument_id} value={instrument.instrument_id}>
            {instrument.nickname || instrument.name}
          </option>
        ))}
      </select>

      {/* Sheet music — opens modal */}
      <label>Sheet Music (optional)</label>
      <button
        className='piece-upload-button'
        type='button'
        onClick={() => setShowSheetMusicModal(true)}
      >
        {attachment.type === 'file'
          ? attachment.file?.name
          : attachment.type === 'url'
            ? attachment.preview?.title
            : 'Attach Sheet Music'}
      </button>

      {/* {attachment.type === 'file' && (
        <div className='link-preview'>
          <img src={attachment.file.name} alt={attachment.file.name} />
          <p>{attachment.file.name}</p>
        </div>
      )}
      {attachment.type === 'url' && attachment.preview && (
        <div className='link-preview'>
          {attachment.preview.thumbnail && (
            <img src={attachment.preview.thumbnail} alt={attachment.preview.title} />
          )}
          <p>{attachment.preview.title}</p>
        </div>
      )} */}

      <button type='submit'>Save</button>

      {/* Modal */}
      {showSheetMusicModal && (
        <SheetMusicModal
          onClose={() => setShowSheetMusicModal(false)}
          setFormData={setFormData}
          formData={formData}
          setAttachment={setAttachment}
          attachment={attachment}
        />
      )}
    </form>
  );
};

export default PieceForm;
