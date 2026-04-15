import React, { useState, useEffect, useRef } from 'react';
import faceImg from '../../assets/leftHalfFace.webp';
import h1 from '../../assets/helmet1.png';
import h2 from '../../assets/helmet2.png';
import h3 from '../../assets/helmet3.png';
import h4 from '../../assets/helmet4.png';
import h5 from '../../assets/helmet5.png';
import h6 from '../../assets/helmet6.png';
import h7 from '../../assets/fullSolidHelmet7.png';
import TextPressure from '../TextPressure';
import './About.css';

const helmetImages = [h1, h2, h3, h4, h5, h6, h7];

const About = ({ onBack }) => {
  const [frame, setFrame] = useState(-1);
  const sectionRef = useRef(null);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (sectionRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = sectionRef.current;
            const scrollFraction = scrollTop / (scrollHeight - clientHeight);
            
            // Map scroll 0-1 to frame -1 to 6
            const totalFrames = helmetImages.length;
            // Introduce a small buffer so frame stays -1 for a few pixels
            const rawIndex = Math.floor(scrollFraction * (totalFrames + 0.5)) - 1;
            const frameIndex = Math.min(totalFrames - 1, Math.max(-1, rawIndex));
            
            setFrame(frameIndex);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    const container = sectionRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  // Preload frames to prevent flickering
  useEffect(() => {
    helmetImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  return (
    <section ref={sectionRef} className="premium-section about-section">
      <div className="scroll-track"></div>
      
      <img 
        src={faceImg} 
        alt="Portrait" 
        className="section-face-img" 
      />
      
      <div className="helmet-sequence-container">
        {helmetImages.map((src, index) => (
          <img 
            key={index}
            src={src} 
            alt={`Helmet Frame ${index + 1}`} 
            className={`section-helmet-img helmet-piece-${index} ${frame >= index ? 'active' : ''}`} 
            style={{ 
              zIndex: 1 + index 
            }}
          />
        ))}
      </div>

      <div className="section-tagline large-tagline animated-tagline">
        <TextPressure
          text="WHO IS THIS GUY?"
          flex
          alpha={false}
          stroke={false}
          width
          weight
          italic
          textColor="#ffffff"
          strokeColor="#5227FF"
          minFontSize={36}
        />
      </div>

      <button className="premium-back-btn minimalist-btn" onClick={onBack}>
        <span className="btn-arrow">←</span>
      </button>
    </section>
  );
};

export default About;
