// App.js — State management & Main Layout
import React, { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import WorkflowText from './components/WorkflowText';
import WorkflowImage from './components/WorkflowImage';

function App() {
  const [activeTab, setActiveTab] = useState('text');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const isError = statusMessage.startsWith('✗') || statusMessage.startsWith('⚠');
  const isSuccess = statusMessage.startsWith('✓');

  return (
    <div className="app">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {statusMessage && (
        <div className="status-bar">
          <span className="status-dot" />
          <span className={`status-text ${isError ? 'error' : isSuccess ? 'success' : ''}`}>
            {statusMessage}
          </span>
        </div>
      )}

      <main className="main-content">
        {activeTab === 'text' ? (
          <WorkflowText
            setStatusMessage={setStatusMessage}
            setIsLoading={setIsLoading}
            isLoading={isLoading}
          />
        ) : (
          <WorkflowImage
            setStatusMessage={setStatusMessage}
            setIsLoading={setIsLoading}
            isLoading={isLoading}
          />
        )}
      </main>
    </div>
  );
}

export default App;
