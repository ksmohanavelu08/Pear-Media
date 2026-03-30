// Navbar.js — Navigation and Logo
import React from 'react';

const Navbar = ({ activeTab, setActiveTab }) => (
  <nav className="navbar">
    <div className="navbar-brand">
      <span className="brand-icon">◈</span>
      <span className="brand-name">Pear<span className="brand-accent">Media</span></span>
    </div>
    <div className="navbar-tabs">
      <button
        className={`tab-btn ${activeTab === 'text' ? 'active' : ''}`}
        onClick={() => setActiveTab('text')}
      >
        <span className="tab-icon">✦</span>
        Creative Studio
      </button>
      <button
        className={`tab-btn ${activeTab === 'image' ? 'active' : ''}`}
        onClick={() => setActiveTab('image')}
      >
        <span className="tab-icon">◉</span>
        Style Lab
      </button>
    </div>
    <div className="navbar-badge">AI Prototype</div>
  </nav>
);

export default Navbar;
