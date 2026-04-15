import React from 'react';
import SoftAurora from '../SoftAurora';
import './Contact.css';

const Contact = ({ onBack }) => {
  return (
    <section className="premium-section contact-section">
      <div className="section-bg">
        <SoftAurora 
          speed={0.2} scale={1.2} brightness={0.35}
          color1="#1a1a1a" color2="#000000"
          enableMouseInteraction={false}
        />
      </div>

      <div className="section-container">
        <header className="section-header">
          <span className="section-tagline">AVAILABILITY</span>
          <h1 className="section-title">Let's Connect</h1>
        </header>

        <div className="contact-content glass">
          <div className="card-accent"></div>
          <div className="contact-main">
            <h2>Start a conversation.</h2>
            <p>I'm currently open to new architectural challenges and creative collaborations. Remote or global.</p>
            <a href="mailto:hello@example.com" className="email-link">
              hello@example.com
              <span className="link-underline"></span>
            </a>
          </div>
          
          <div className="contact-links">
            <div className="social-row">
              <span className="social-label">LinkedIn</span>
              <a href="#" className="social-url">/in/gokulnatha</a>
            </div>
            <div className="social-row">
              <span className="social-label">Twitter</span>
              <a href="#" className="social-url">@gokul_dev</a>
            </div>
            <div className="social-row">
              <span className="social-label">GitHub</span>
              <a href="#" className="social-url">gokul-natha</a>
            </div>
          </div>
        </div>

        <button className="premium-back-btn" onClick={onBack}>
          <span className="btn-arrow">←</span> Return to Hero
        </button>
      </div>

    </section>
  );
};

export default Contact;
