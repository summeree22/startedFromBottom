import React, { useState, useEffect, useRef } from 'react'
import '../styles/MainPage.css';

const MainPage = () => {
  const clickRef = useRef({ x: 0, y: 0 });

  const [showPolaroid, setShowPolaroid] = useState(false);
  const [form, setForm] = useState({
    where: '',
    when: '',
    impressive: '',
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [travelEntries, setTravelEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/travel`);
        const data = await response.json();
        setTravelEntries(data);
      } catch (err) {
        console.error('데이터 불러오기 실패:', err);
      }
    };
    fetchEntries();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImage(null);
      setImagePreview(null);
    }
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append('location', form.where);
    formData.append('date', form.when);
    formData.append('description', form.impressive);
    formData.append('x', clickRef.current.x);
    formData.append('y', clickRef.current.y);
    if (image) formData.append('image', image);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/travel`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('서버 응답 실패');

      const result = await response.json();
      alert('저장되었습니다!');
      setTravelEntries((prev) => [result, ...prev]);
    } catch (error) {
      console.error('업로드 실패:', error);
      alert('업로드 중 문제가 발생했습니다.');
    }

    setShowPolaroid(false);
    setForm({ where: '', when: '', impressive: '' });
    setImage(null);
    setImagePreview(null);
    setSelectedEntry(null);
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/travel/${selectedEntry.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location: form.where,
          date: form.when,
          description: form.impressive,
          x: selectedEntry.x,
          y: selectedEntry.y,
          image_url: selectedEntry.image_url,
        }),
      });

      if (!response.ok) throw new Error('수정 실패');

      const updated = await response.json();
      setTravelEntries((prev) => prev.map(e => e.id === updated.id ? updated : e));
      alert('수정되었습니다!');
    } catch (err) {
      console.error('수정 실패:', err);
      alert('수정 중 문제가 발생했습니다.');
    }
    setShowPolaroid(false);
    setSelectedEntry(null);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    try {
      await fetch(`${process.env.REACT_APP_API_BASE_URL}/travel/${selectedEntry.id}`, {
        method: 'DELETE'
      });
      setTravelEntries((prev) => prev.filter(e => e.id !== selectedEntry.id));
      alert('삭제되었습니다!');
    } catch (err) {
      console.error('삭제 실패:', err);
      alert('삭제 중 문제가 발생했습니다.');
    }
    setShowPolaroid(false);
    setSelectedEntry(null);
  };

  const handleClose = () => {
    setShowPolaroid(false);
    setForm({ where: '', when: '', impressive: '' });
    setImage(null);
    setImagePreview(null);
    setSelectedEntry(null);
    setIsEditing(false);
  };

  const handleMainClick = (e) => {
    if (showPolaroid) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    clickRef.current = { x, y };
    setForm({ where: '', when: '', impressive: '' });
    setImage(null);
    setImagePreview(null);
    setSelectedEntry(null);
    setShowPolaroid(true);
  };

  const handlePolaroidClick = (entry) => {
    setSelectedEntry(entry);
    setForm({ where: entry.location, when: entry.date.slice(0, 10), impressive: entry.description });
    setImagePreview(entry.image_url);
    setShowPolaroid(true);
  };

  return (
    <div className="mainpage-root" onClick={handleMainClick}>
      <div className="mainpage-bg-wrapper">
        <img className="mainpage-bg-image" src="/earth-village.jpg" alt="Background" style={{ filter: 'blur(18px)' }} />
        <div className="mainpage-bg-darken" />
      </div>
      <svg className="mainpage-noise-fixed" width="100%" height="100%">
        <filter id="noise-fixed">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="1" result="noise" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise-fixed)" />
      </svg>
      <div className="mainpage-text-group">
        <span className="mainpage-pradise">PRADISE</span>
        <span className="mainpage-is">is</span>
        <span className="mainpage-where">WHERE</span>
        <span className="mainpage-i">I</span>
        <span className="mainpage-am">am</span>
      </div>
      <div className="mainpage-caption">
        Everything I carry in my heart—from memories to emotions—was born in paradise
      </div>

      {travelEntries.map((entry) => (
        entry.image_url && (
          <div
            key={entry.id}
            className="polaroid-frame"
            style={{
              position: 'absolute',
              left: `${entry.x}px`,
              top: `${entry.y}px`,
              width: '120px',
              zIndex: 5,
              cursor: 'pointer',
            }}
            onClick={(e) => {
              e.stopPropagation();
              handlePolaroidClick(entry);
            }}
          >
            <div className="polaroid-photo-area" tabIndex={0}>
              <img src={entry.image_url} alt={entry.location} className="polaroid-photo-img" style={{ width: '100%', height: 'auto', borderRadius: '8px' }} />
            </div>
          </div>
        )
      ))}

      {showPolaroid && (
        <div className="polaroid-modal" onClick={e => e.stopPropagation()}>
          <div className="polaroid-popup polaroid-popup-ratio">
            <div className="polaroid-content">
              <div className="polaroid-btn-group polaroid-btn-group-top">
                {selectedEntry ? (
                  <>
                    {isEditing ? (
                      <button className="polaroid-save" onClick={handleUpdate}>Save</button>
                    ) : (
                      <button className="polaroid-save" onClick={() => setIsEditing(true)}>Edit</button>
                    )}
                    <button className="polaroid-close" onClick={handleDelete}>Remove</button>
                  </>
                ) : (
                  <button className="polaroid-save" onClick={handleSave}>Save</button>
                )}
                <button className="polaroid-close" onClick={handleClose}>Close</button>
              </div>
              <div className="polaroid-frame">
                <div className="polaroid-photo-area" tabIndex={0}>
                  {imagePreview && (
                    <img src={imagePreview} alt="Polaroid" className="polaroid-photo-img" />
                  )}
                  {!selectedEntry && (
                    <>
                      <input type="file" accept="image/*" onChange={handleImageChange} className="polaroid-photo-input" id="polaroid-photo-input" />
                      {!imagePreview && (
                        <label htmlFor="polaroid-photo-input" className="polaroid-photo-upload-btn">Upload image</label>
                      )}
                    </>
                  )}
                </div>
              </div>
              <div className="polaroid-fields">
                {selectedEntry ? (
                  <>
                    <input name="where" value={form.where} onChange={handleChange} className="polaroid-input text-right" readOnly={!isEditing} />
                    <input name="when" value={form.when} onChange={handleChange} className="polaroid-input text-right" readOnly={!isEditing} />
                    <input name="impressive" value={form.impressive} onChange={handleChange} className="polaroid-textarea text-right" readOnly={!isEditing} />
                  </>
                ) : (
                  <>
                    <label>
                      <div className="polaroid-label">Where?</div>
                      <input name="where" value={form.where} onChange={handleChange} className="polaroid-input underline-input" placeholder="Type where..." autoFocus />
                    </label>
                    <label>
                      <div className="polaroid-label">When?</div>
                      <input name="when" value={form.when} onChange={handleChange} className="polaroid-input underline-input" placeholder="Type when..." />
                    </label>
                    <label>
                      <div className="polaroid-label">Impressive thing?</div>
                      <input name="impressive" value={form.impressive} onChange={handleChange} className="polaroid-textarea underline-input" placeholder="Type impressive thing..." />
                    </label>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainPage;

