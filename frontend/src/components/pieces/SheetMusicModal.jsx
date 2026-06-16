import { useState } from 'react';
import { fetchPieceLinkPreview } from '../../adapters/piece-adapters';

const SheetMusicModal = ({ onClose, setFormData, formData, setAttachment, attachment }) => {
  const [draftAttachment, setDraftAttachment] = useState(attachment);
  const [mode, setMode] = useState('file');
  const [loadingPreview, setLoadingPreview] = useState(false);

  const handleConfirm = () => {
    setAttachment(draftAttachment);

    if (!formData.title.trim() && draftAttachment.preview?.title) {
      setFormData((prev) => ({
        ...prev,
        title: draftAttachment.preview.title,
      }));
    }
    onClose();
  };

  const handleFileUpload = async (e) => {
    setDraftAttachment({
      type: 'file',
      file: e.target.files[0] || null,
      url: '',
      preview: null,
    });
  };

  const handleUrl = async (e) => {
    const value = e.target.value;

    if (!value.startsWith('http')) return;

    try {
      setLoadingPreview(true);
      const data = await fetchPieceLinkPreview(value);
      setDraftAttachment({
        type: 'url',
        file: null,
        url: value,
        preview: data.data,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPreview(false);
    }
  };

  const canConfirm =
    (mode === 'url' && draftAttachment.url) || (mode === 'file' && draftAttachment.file);

  return (
    <div className='modal-overlay' onClick={onClose}>
      <div className='sheet-modal' onClick={(e) => e.stopPropagation()}>
        <div className='sheet-modal-header'>
          <h2>Attach Sheet Music</h2>
          <button type='button' className='modal-close' onClick={onClose}>
            ✕
          </button>
        </div>

        <div className='sheet-music-tabs'>
          <button
            type='button'
            className={mode === 'file' ? 'active' : ''}
            onClick={() => setMode('file')}
          >
            Upload
          </button>

          <button
            type='button'
            className={mode === 'url' ? 'active' : ''}
            onClick={() => setMode('url')}
          >
            Link
          </button>
        </div>

        {mode === 'file' && (
          <div className='upload-section'>
            <label htmlFor='file-upload' className='upload-dropzone'>
              {draftAttachment.file?.name ? (
                <p>Attached File: {draftAttachment.file.name}</p>
              ) : (
                <p>Upload PDF or Image</p>
              )}
              {/* <p>Upload PDF or Image</p> */}
              <span>Click to browse</span>
            </label>
            <input
              id='file-upload'
              type='file'
              accept='.pdf,image/*'
              style={{ display: 'none' }}
              onChange={(e) => handleFileUpload(e)}
            />
          </div>
        )}

        {mode === 'url' && (
          <div>
            <div className='url-input-row'>
              <input
                type='url'
                placeholder='Paste sheet music URL'
                value={draftAttachment.url}
                onChange={(e) => handleUrl(e)}
              />
            </div>
          </div>
        )}

        <div className='sheet-modal-footer'>
          <button type='button' className='cancel-btn' onClick={onClose}>
            Cancel
          </button>

          <button
            type='button'
            className='confirm-btn'
            onClick={handleConfirm}
            disabled={!canConfirm}
          >
            Attach
          </button>
        </div>
      </div>
    </div>
  );
};

export default SheetMusicModal;
