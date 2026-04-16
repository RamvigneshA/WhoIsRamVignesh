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

// Stones
import bStone from '../../assets/blueStone.webp';
import gStone from '../../assets/greenStone.webp';
import oStone from '../../assets/orangeStone.webp';
import pStone from '../../assets/purpleStone.webp';
import rStone from '../../assets/redStone.webp';
import yStone from '../../assets/yellowStone.webp';

// Snap Frames
import s1 from '../../assets/snap1.webp';
import s2 from '../../assets/snap2.webp';
import s3 from '../../assets/snap3.webp';
import s4 from '../../assets/snap4.webp';
import s5 from '../../assets/snap5.webp';
import s6 from '../../assets/snap6.webp';

const helmetImages = [h1, h2, h3, h4, h5, h6, h7];
const stoneImages = [bStone, gStone, rStone, oStone, pStone, yStone, bStone]; // Blue, Green, Red, Orange, Purple, Yellow, Blue
const snapFrames = [s1, s2, s3, s4, s5, s6];

const scenes = [
  "After Mechatronics straight to the floor.\nAssembly line. Same loop.\nNo comfort. Only constraints.\n working with scraps",
  "Something felt off.\nSame system.No change.\nThen my brother stepped in.\nA senior in product.\nA real-world thinker.\nHe showed me another path into development.",
  "I found the web.\nNot machines but interfaces.\nNot parts but interactions.",
  "I built. I broke.I rebuilt.\nAgain and again.\nUntil I saw beyond code.\nPerformance ,Systems ,Bussiness value.",
  "From systems to scale.\nFrom code to control.\nFrom building to shaping experience.",
  "Not just building.\nNot just coding.\nNow… creating impact.",
  "This is my world now.\nI build experiences.",
  "" // Hidden 8th scene for scroll-triggered snap
];

const About = ({ onBack }) => {
  const [frame, setFrame] = useState(-1);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [snapStage, setSnapStage] = useState('idle'); // 'idle', 'revealing', 'snapping', 'flashing'
  const [currentSnapFrame, setCurrentSnapFrame] = useState(-1);
  const [handY, setHandY] = useState(100); // Hand vertical position (percentage)
  const [revealText, setRevealText] = useState('');
  const sectionRef = useRef(null);
  
  // Ref-based state to avoid stale closures in event listeners
  const snapStageRef = useRef(snapStage);
  const onBackRef = useRef(onBack);

  useEffect(() => {
    snapStageRef.current = snapStage;
  }, [snapStage]);

  useEffect(() => {
    onBackRef.current = onBack;
  }, [onBack]);

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

  const currentScene = Math.floor(scrollFraction * scenes.length);
  const clampedScene = Math.min(scenes.length - 1, Math.max(0, currentScene));
  
  // Keep timeline at 7 dots, but handle snap in the 8th zone
  setActiveSceneIndex(Math.min(6, clampedScene));

  // Scroll-driven hand logic for the 8th zone
  if (clampedScene === 7 && snapStageRef.current === 'idle') {
    const zoneScroll = (scrollFraction * scenes.length) % 1;
    setHandY(100 - zoneScroll * 100); // 100% to 0% (center of screen)
    if (zoneScroll >= 0.98) {
      triggerAutoSnap();
    }
  } else if (clampedScene < 7) {
    setHandY(100);
  }
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
    [...helmetImages, ...snapFrames].forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const scrollToScene = (index) => {
    if (sectionRef.current) {
      const { scrollHeight, clientHeight } = sectionRef.current;
      const targetScroll = (index / (scenes.length - 1)) * (scrollHeight - clientHeight);
      sectionRef.current.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  const triggerAutoSnap = () => {
    if (snapStage !== 'idle') return;
    
    // Stage 1: Text Reveal Sequence
    setSnapStage('revealing');
    setRevealText('I');
    
    setTimeout(() => {
      setRevealText('AM');
      
      setTimeout(() => {
        setRevealText('DEVELOPER');
        
        setTimeout(() => {
          setRevealText('');
          // Stage 2: Fast snap animation starts immediately at scroll climax
          setSnapStage('snapping');
          let frameNum = 0;
          const interval = setInterval(() => {
            if (frameNum >= snapFrames.length) {
              clearInterval(interval);
              // Stage 3: The Flash
              setSnapStage('flashing');
              
              setTimeout(() => {
                onBackRef.current(); // Automatically return after the journey ends
              }, 1500);
            } else {
              setCurrentSnapFrame(frameNum);
              frameNum++;
            }
          }, 70); 
        }, 1200); // DEVELOPER impact time
      }, 600); // AM time
    }, 600); // I time
  };

  return (
    <section ref={sectionRef} className="premium-section about-section">
      <img 
        src={faceImg} 
        alt="Portrait" 
        className="section-face-img" 
      />
      
      <div className="timeline-container">
        <div className="timeline-line"></div>
        {scenes.slice(0, 7).map((_, index) => (
          <button 
            key={index} 
            className={`timeline-node ${activeSceneIndex === index ? 'active' : ''} crystal-node-${index}`}
            onClick={() => scrollToScene(index)}
            aria-label={`Go to scene ${index + 1}`}
          >
            <img src={stoneImages[index]} alt="" className="node-stone-img" />
          </button>
        ))}
      </div>

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

      <div className="scenes-container">
        {scenes.map((text, index) => (
          <div key={index} className={`about-scene scene-${index + 1}`}>
            <div className="scene-content">
              {text.split('\n').map((line, i) => (
                <h2 key={i} className="scene-text-line">{line}</h2>
              ))}
            </div>
          </div>
        ))}
      </div>


      {/* Snap Stage: Scroll-driven or Animating */}
      {(handY < 100 || snapStage !== 'idle') && (
        <div className={`snap-animation-overlay stage-${snapStage}`}>
          {snapStage === 'revealing' && (
            <div className="snap-reveal-text-container">
              <h2 className={`snap-reveal-text ${revealText.toLowerCase()}`}>
                {revealText}
              </h2>
            </div>
          )}
          
          {snapStage !== 'flashing' && (
            <img 
              src={snapFrames[currentSnapFrame === -1 ? 0 : currentSnapFrame]} 
              alt="Snap Animation" 
              className={`snap-frame-img ${snapStage}`}
              style={{ 
                transform: snapStage === 'idle' ? `translateY(${handY}vh)` : 'translateY(0)'
              }}
            />
          )}
          {snapStage === 'flashing' && <div className="flash-whiteout" />}
        </div>
      )}
    </section>
  );
};

export default About;
