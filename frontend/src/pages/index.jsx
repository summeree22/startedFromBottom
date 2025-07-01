import React, { useState, useEffect, useRef } from 'react';
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
    console.log('저장 시 좌표:', clickRef.current);

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
      console.log('업로드 성공:', result);
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
  };

  const handleClose = () => {
    setShowPolaroid(false);
    setForm({ where: '', when: '', impressive: '' });
    setImage(null);
    setImagePreview(null);
  };

  const handleMainClick = (e) => {
    console.log('🔥🔥🔥 클릭됨!');
    if (showPolaroid) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    clickRef.current = { x , y };
    console.log('클릭 좌표: 저장됨', clickRef.current);

    setShowPolaroid(true);
  };

  return (
    <div className="mainpage-root" onClick={handleMainClick}>
      <div className="mainpage-bg-wrapper">
        <img
          className="mainpage-bg-image"
          src="/earth-village.jpg"
          alt="Background"
          style={{ filter: 'blur(18px)' }}
        />
        <div className="mainpage-bg-darken" />
      </div>
      {/* Fixed noise overlay */}
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

      {/* 폴라로이드 스타일로 이미지 렌더링 */}
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
          >
            <div className="polaroid-photo-area" tabIndex={0}>
              <img
                src={entry.image_url}
                alt={entry.location}
                className="polaroid-photo-img"
                style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
              />
            </div>
          </div>
        )
      ))}

      {/* Polaroid Modal */}
      {showPolaroid && (
        <div className="polaroid-modal" onClick={e => e.stopPropagation()}>
          <div className="polaroid-popup polaroid-popup-ratio">
            <div className="polaroid-content">
              {/* Save/Close 버튼을 카드 우측 상단에 고정 */}
              <div className="polaroid-btn-group polaroid-btn-group-top">
                <button className="polaroid-save" onClick={handleSave}>
                  Save
                </button>
                <button className="polaroid-close" onClick={handleClose}>
                  Close
                </button>
              </div>
              {/* 왼쪽: 폴라로이드 프레임 */}
              <div className="polaroid-frame">
                <div className="polaroid-photo-area" tabIndex={0}>
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Polaroid"
                      className="polaroid-photo-img"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="polaroid-photo-input"
                    id="polaroid-photo-input"
                  />
                  {/* 이미지가 없을 때만 버튼 보이게 */}
                  {!imagePreview && (
                    <label
                      htmlFor="polaroid-photo-input"
                      className="polaroid-photo-upload-btn"
                    >
                      Upload image
                    </label>
                  )}
                </div>
              </div>
              {/* 오른쪽: 입력 필드 */}
              <div className="polaroid-fields">
                <label>
                  <div className="polaroid-label">Where?</div>
                  <input
                    name="where"
                    value={form.where}
                    onChange={handleChange}
                    className="polaroid-input underline-input"
                    placeholder="Type where..."
                    autoFocus
                  />
                </label>
                <label>
                  <div className="polaroid-label">When?</div>
                  <input
                    name="when"
                    value={form.when}
                    onChange={handleChange}
                    className="polaroid-input underline-input"
                    placeholder="Type when..."
                  />
                </label>
                <label>
                  <div className="polaroid-label">Impressive thing?</div>
                  <input
                    name="impressive"
                    value={form.impressive}
                    onChange={handleChange}
                    className="polaroid-textarea underline-input"
                    placeholder="Type impressive thing..."
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainPage;
