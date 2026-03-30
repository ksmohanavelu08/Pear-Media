// WorkflowText.js — Input → Enhance → Approve → Generate
import React, { useState } from 'react';
import { getEnhancedPrompt, generateImage } from '../utils/apiHelpers';
import { PLACEHOLDER_PROMPTS } from '../utils/constants';
import ImageCard from './ImageCard';

const STEPS = ['input', 'enhance', 'approve', 'generate'];

const WorkflowText = ({ setStatusMessage, setIsLoading, isLoading }) => {
  const [step, setStep] = useState('input');
  const [userPrompt, setUserPrompt] = useState('');
  const [enhancedPrompt, setEnhancedPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState(null);
  const [placeholderIdx] = useState(() => Math.floor(Math.random() * PLACEHOLDER_PROMPTS.length));

  const stepIndex = STEPS.indexOf(step);

  const handleEnhance = async () => {
    if (!userPrompt.trim()) return setStatusMessage('⚠ Please enter a prompt first.');
    setIsLoading(true);
    setStatusMessage('Enhancing your prompt with AI…');
    try {
      const enhanced = await getEnhancedPrompt(userPrompt);
      setEnhancedPrompt(enhanced);
      setStep('approve');
      setStatusMessage('');
    } catch (err) {
      setStatusMessage(`✗ Enhancement failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!enhancedPrompt.trim()) return;
    setIsLoading(true);
    setStatusMessage('Generating your image — this may take 15–30 seconds…');
    try {
      const url = await generateImage(enhancedPrompt);
      setGeneratedImage(url);
      setStep('generate');
      setStatusMessage('');
    } catch (err) {
      setStatusMessage(`✗ Generation failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setStep('input');
    setUserPrompt('');
    setEnhancedPrompt('');
    setGeneratedImage(null);
    setStatusMessage('');
  };

  return (
    <div className="workflow-container">
      {/* Progress bar */}
      <div className="progress-track">
        {['Enter Idea', 'AI Enhances', 'You Approve', 'Image Ready'].map((label, i) => (
          <div key={i} className={`progress-step ${i <= stepIndex ? 'done' : ''} ${i === stepIndex ? 'active' : ''}`}>
            <div className="progress-dot">{i < stepIndex ? '✓' : i + 1}</div>
            <span>{label}</span>
          </div>
        ))}
        <div className="progress-bar-fill" style={{ width: `${(stepIndex / 3) * 100}%` }} />
      </div>

      {/* STEP 1: Input */}
      <div className={`wf-section ${step === 'input' ? 'visible' : 'hidden'}`}>
        <div className="section-header">
          <span className="section-num">01</span>
          <h2>Your Creative Idea</h2>
        </div>
        <p className="section-desc">Describe what you want to see — don't worry about perfection, the AI will craft the details.</p>
        <textarea
          className="big-input"
          rows={4}
          placeholder={`e.g. "${PLACEHOLDER_PROMPTS[placeholderIdx]}"`}
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          disabled={isLoading}
        />
        <div className="action-row">
          <button className="btn-primary" onClick={handleEnhance} disabled={isLoading || !userPrompt.trim()}>
            {isLoading ? <span className="spinner" /> : '✦ Enhance with AI'}
          </button>
        </div>
      </div>

      {/* STEP 2: Approve */}
      {(step === 'approve' || step === 'generate') && (
        <div className="wf-section visible">
          <div className="section-header">
            <span className="section-num">02</span>
            <h2>Review & Edit Enhanced Prompt</h2>
          </div>
          <p className="section-desc">The AI has enriched your idea. Edit freely — this exact text will be sent to the image generator.</p>
          <div className="original-prompt">
            <span className="tag">Your original</span>
            <p>{userPrompt}</p>
          </div>
          <textarea
            className="big-input enhanced"
            rows={5}
            value={enhancedPrompt}
            onChange={(e) => setEnhancedPrompt(e.target.value)}
            disabled={isLoading || step === 'generate'}
          />
          {step === 'approve' && (
            <div className="action-row">
              <button className="btn-ghost" onClick={reset}>← Start over</button>
              <button className="btn-primary" onClick={handleGenerate} disabled={isLoading || !enhancedPrompt.trim()}>
                {isLoading ? <span className="spinner" /> : '◉ Generate Image'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* STEP 3: Result */}
      {step === 'generate' && generatedImage && (
        <div className="wf-section visible">
          <div className="section-header">
            <span className="section-num">03</span>
            <h2>Your Generated Image</h2>
          </div>
          <ImageCard imageUrl={generatedImage} label="AI Generated" prompt={enhancedPrompt} />
          <div className="action-row" style={{ marginTop: '1.5rem' }}>
            <button className="btn-ghost" onClick={reset}>✦ Create another</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowText;
