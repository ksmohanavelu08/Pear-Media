// WorkflowImage.js — Upload → Analyze → Variation Generation
import React, { useState, useRef } from 'react';
import { analyzeImage, generateImage, fileToBase64 } from '../utils/apiHelpers';
import ImageCard from './ImageCard';

const WorkflowImage = ({ setStatusMessage, setIsLoading, isLoading }) => {
  const [step, setStep] = useState('upload');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [base64Data, setBase64Data] = useState(null);
  const [mimeType, setMimeType] = useState('image/jpeg');
  const [analysis, setAnalysis] = useState(null);
  const [variationPrompt, setVariationPrompt] = useState('');
  const [variationImage, setVariationImage] = useState(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef();

  const stepIndex = ['upload', 'analyze', 'variation'].indexOf(step);

  const processFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      return setStatusMessage('⚠ Please upload a valid image file (JPG, PNG, WEBP).');
    }
    if (file.size > 10 * 1024 * 1024) {
      return setStatusMessage('⚠ Image too large. Please use a file under 10MB.');
    }
    setMimeType(file.type);
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
    try {
      const b64 = await fileToBase64(file);
      setBase64Data(b64);
      setStep('analyze');
      setStatusMessage('');
    } catch {
      setStatusMessage('✗ Could not read file. Please try again.');
    }
  };

  const handleFileInput = (e) => processFile(e.target.files[0]);
  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    processFile(e.dataTransfer.files[0]);
  };

  const handleAnalyze = async () => {
    setIsLoading(true);
    setStatusMessage('Analyzing image with computer vision…');
    try {
      const result = await analyzeImage(base64Data, mimeType);
      setAnalysis(result);
      setVariationPrompt(result.variationPrompt || '');
      setStep('variation');
      setStatusMessage('');
    } catch (err) {
      setStatusMessage(`✗ Analysis failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateVariation = async () => {
    setIsLoading(true);
    setStatusMessage('Generating stylistic variation…');
    try {
      const url = await generateImage(variationPrompt);
      setVariationImage(url);
      setStatusMessage('');
    } catch (err) {
      setStatusMessage(`✗ Variation generation failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setStep('upload');
    setPreviewUrl(null);
    setBase64Data(null);
    setAnalysis(null);
    setVariationPrompt('');
    setVariationImage(null);
    setStatusMessage('');
  };

  return (
    <div className="workflow-container">
      {/* Progress bar */}
      <div className="progress-track">
        {['Upload Image', 'AI Analyzes', 'Variation Ready'].map((label, i) => (
          <div key={i} className={`progress-step ${i <= stepIndex ? 'done' : ''} ${i === stepIndex ? 'active' : ''}`}>
            <div className="progress-dot">{i < stepIndex ? '✓' : i + 1}</div>
            <span>{label}</span>
          </div>
        ))}
        <div className="progress-bar-fill" style={{ width: `${(stepIndex / 2) * 100}%` }} />
      </div>

      {/* STEP 1: Upload */}
      <div className={`wf-section ${step === 'upload' ? 'visible' : 'hidden'}`}>
        <div className="section-header">
          <span className="section-num">01</span>
          <h2>Upload Your Image</h2>
        </div>
        <p className="section-desc">Upload any image — the AI will extract its style, subjects, and colour palette to generate variations.</p>
        <div
          className={`drop-zone ${dragging ? 'dragging' : ''}`}
          onClick={() => fileRef.current.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileInput} />
          <div className="drop-icon">◈</div>
          <p className="drop-label">Drop an image here or <span className="drop-link">browse files</span></p>
          <p className="drop-hint">JPG, PNG, WEBP — max 10MB</p>
        </div>
      </div>

      {/* STEP 2: Preview + Analyze */}
      {(step === 'analyze' || step === 'variation') && previewUrl && (
        <div className="wf-section visible">
          <div className="section-header">
            <span className="section-num">02</span>
            <h2>Image Preview</h2>
          </div>
          <div className="preview-wrap">
            <img src={previewUrl} alt="Uploaded" className="preview-img" />
            {step === 'analyze' && (
              <div className="action-row" style={{ marginTop: '1rem' }}>
                <button className="btn-ghost" onClick={reset}>← Change image</button>
                <button className="btn-primary" onClick={handleAnalyze} disabled={isLoading}>
                  {isLoading ? <span className="spinner" /> : '◉ Analyze Style'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* STEP 3: Analysis + Variation */}
      {step === 'variation' && analysis && (
        <div className="wf-section visible">
          <div className="section-header">
            <span className="section-num">03</span>
            <h2>Analysis Results</h2>
          </div>
          <div className="analysis-grid">
            {[
              ['Main Subject', analysis.mainSubject],
              ['Artistic Style', analysis.artisticStyle],
              ['Lighting', analysis.lighting],
              ['Mood', analysis.mood],
            ].map(([k, v]) => (
              <div className="analysis-tile" key={k}>
                <span className="a-tile-key">{k}</span>
                <span className="a-tile-val">{v}</span>
              </div>
            ))}
          </div>
          {analysis.colorPalette && (
            <div className="palette-row">
              <span className="palette-label">Colour Palette</span>
              {analysis.colorPalette.map((c, i) => (
                <span key={i} className="palette-chip">{c}</span>
              ))}
            </div>
          )}

          <div className="section-header" style={{ marginTop: '2rem' }}>
            <span className="section-num">04</span>
            <h2>Variation Prompt</h2>
          </div>
          <p className="section-desc">Edit the auto-generated variation prompt before generating.</p>
          <textarea
            className="big-input enhanced"
            rows={4}
            value={variationPrompt}
            onChange={(e) => setVariationPrompt(e.target.value)}
            disabled={isLoading}
          />
          <div className="action-row">
            <button className="btn-ghost" onClick={reset}>← Start over</button>
            <button className="btn-primary" onClick={handleGenerateVariation} disabled={isLoading || !variationPrompt.trim()}>
              {isLoading ? <span className="spinner" /> : '✦ Generate Variation'}
            </button>
          </div>

          {variationImage && (
            <>
              <div className="section-header" style={{ marginTop: '2rem' }}>
                <span className="section-num">05</span>
                <h2>Generated Variation</h2>
              </div>
              <div className="comparison-grid">
                <div>
                  <p className="comp-label">Original</p>
                  <img src={previewUrl} alt="Original" className="comp-img" />
                </div>
                <div>
                  <p className="comp-label">AI Variation</p>
                  <img src={variationImage} alt="Variation" className="comp-img" />
                </div>
              </div>
              <ImageCard imageUrl={variationImage} label="Stylistic Variation" prompt={variationPrompt} analysisData={analysis} />
              <div className="action-row" style={{ marginTop: '1.5rem' }}>
                <button className="btn-ghost" onClick={handleGenerateVariation} disabled={isLoading}>
                  {isLoading ? <span className="spinner" /> : '↻ Regenerate'}
                </button>
                <button className="btn-ghost" onClick={reset}>◈ New Image</button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default WorkflowImage;
