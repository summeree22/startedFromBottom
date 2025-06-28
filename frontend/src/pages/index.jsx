import React from 'react';
import '../styles/MainPage.css';

const MainPage = () => (
  <div className="mainpage-root">
    <div className="mainpage-bg-wrapper">
      <img
        className="mainpage-bg-image"
        src="/earth-village.jpg"
        alt="Background"
        style={{ filter: 'blur(10px)' }}
      />
    </div>
    {/* Fixed noise overlay */}
    <svg className="mainpage-noise-fixed" width="100%" height="100%">
      <filter id="noise-fixed">
        <feTurbulence type="fractalNoise" baseFrequency="0.1" numOctaves="2" result="noise" />
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
  </div>
);

export default MainPage;
