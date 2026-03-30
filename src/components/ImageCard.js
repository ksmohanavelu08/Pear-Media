// ImageCard.js — Reusable component to display generated image results
import React, { useState } from 'react';

const ImageCard = ({ imageUrl, label, prompt, analysisData }) => {
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `pearmedia-${Date.now()}.png`;
    a.target = '_blank';
    a.click();
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  return (
    <div className="image-card">
      <div className="image-card-label">{label}</div>
      <div className="image-card-img-wrap">
        <img src={imageUrl} alt={label} className="image-card-img" />
        <div className="image-card-overlay">
          <button className="overlay-btn" onClick={handleDownload}>
            {downloaded ? '✓ Saved' : '↓ Download'}
          </button>
        </div>
      </div>
      {prompt && (
        <div className="image-card-prompt">
          <span className="prompt-label">Prompt used</span>
          <p>{prompt}</p>
        </div>
      )}
      {analysisData && (
        <div className="image-card-analysis">
          <div className="analysis-row">
            <span className="a-key">Subject</span>
            <span className="a-val">{analysisData.mainSubject}</span>
          </div>
          <div className="analysis-row">
            <span className="a-key">Style</span>
            <span className="a-val">{analysisData.artisticStyle}</span>
          </div>
          <div className="analysis-row">
            <span className="a-key">Lighting</span>
            <span className="a-val">{analysisData.lighting}</span>
          </div>
          <div className="analysis-row">
            <span className="a-key">Mood</span>
            <span className="a-val">{analysisData.mood}</span>
          </div>
          {analysisData.colorPalette && (
            <div className="analysis-row">
              <span className="a-key">Palette</span>
              <span className="a-val palette-chips">
                {analysisData.colorPalette.map((c, i) => (
                  <span key={i} className="palette-chip">{c}</span>
                ))}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageCard;
