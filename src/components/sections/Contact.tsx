import React, { useEffect, useRef, useState } from 'react';
import './Contact.css';

import frontLayer from '../../assets/frontLayer.webp';
import frontLayer2nd from '../../assets/frontLayer2nd.webp';
import frontLayer3rd from '../../assets/frontLayer3rd.webp';
import cloudLeft from '../../assets/cloudLeft.webp';
import cloudRight from '../../assets/cloudRight.webp';

interface ContactProps {
  onBack: () => void;
}

const Contact: React.FC<ContactProps> = ({ onBack }) => {
  const arenaRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const parallaxRef = useRef<HTMLDivElement>(null);

  const [fanned, setFanned] = useState(false);
  const [flipped, setFlipped] = useState<number | null>(null);

  const IDLE = [
    { x: -10, y: 10, z: 0, rz: -5.5 },
    { x: -4, y: 5, z: 9, rz: -1.8 },
    { x: 3, y: 0, z: 18, rz: 1.5 },
    { x: 9, y: -4, z: 27, rz: 4.2 }
  ];

  const getFAN = () => {
    const w = window.innerWidth;
    if (w <= 380) return [
      { x: -90, y: 16, z: 0, rz: -18 },
      { x: -30, y: -6, z: 18, rz: -5 },
      { x: 30, y: -6, z: 18, rz: 5 },
      { x: 90, y: 16, z: 0, rz: 18 }
    ];
    if (w <= 600) return [
      { x: -110, y: 18, z: 0, rz: -20 },
      { x: -36, y: -7, z: 18, rz: -6 },
      { x: 36, y: -7, z: 18, rz: 6 },
      { x: 110, y: 18, z: 0, rz: 20 }
    ];
    if (w <= 900) return [
      { x: -140, y: 20, z: 0, rz: -21 },
      { x: -46, y: -8, z: 18, rz: -7 },
      { x: 46, y: -8, z: 18, rz: 7 },
      { x: 140, y: 20, z: 0, rz: 21 }
    ];
    return [
      { x: -175, y: 22, z: 0, rz: -22 },
      { x: -58, y: -8, z: 18, rz: -7 },
      { x: 58, y: -8, z: 18, rz: 7 },
      { x: 175, y: 22, z: 0, rz: 22 }
    ];
  };

  const isTouchDevice = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  const applyTf = (i: number, base: any, lift: boolean, isFlipped: boolean) => {
    const card = cardsRef.current[i];
    if (!card) return;
    const dz = lift ? 46 : 0;
    const ry = isFlipped ? 180 : 0;
    card.style.transform = `translateX(${base.x}px) translateY(${base.y}px) translateZ(${base.z + dz}px) rotateZ(${base.rz}deg) rotateY(${ry}deg)`;
  };

  useEffect(() => {
    // Initial state
    cardsRef.current.forEach((_, i) => {
      applyTf(i, IDLE[i], false, false);
    });

    let tx = 0, ty = 0, ttx = 0, tty = 0, fa = 0;
    let animationFrameId: number;

    const loop = () => {
      tx += (ttx - tx) * 0.07;
      ty += (tty - ty) * 0.07;
      let fy = 0;
      if (!stackRef.current) return;
      
      // We need to use the fanned state but refs are better inside loop
      // However fanned is a state. We'll use a local closure or check state.
      // A better way is to use a ref for the fanned value.
    };

    // Let's refine the animation loop to use state correctly or refs
  }, []);

  // Parallax scroll and mouse effect
  useEffect(() => {
    const parallaxContainer = parallaxRef.current;
    const contactSection = document.querySelector('.contact-remarkable');
    if (!parallaxContainer || !contactSection) return;

    const layers = parallaxContainer.querySelectorAll<HTMLElement>('.parallax-layer');
    
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;
    let targetScrollProgress = 0;
    let animId: number;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      targetMouseX = (e.clientX / innerWidth - 0.5) * 2; // -1 to 1
      targetMouseY = (e.clientY / innerHeight - 0.5) * 2; // -1 to 1
    };

    const handleScroll = () => {
      const rect = contactSection.getBoundingClientRect();
      const sectionHeight = contactSection.clientHeight;
      targetScrollProgress = -rect.top / sectionHeight;
    };

    const loop = () => {
      // Smooth lerp mouse coordinates
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      layers.forEach((layer) => {
        const speed = parseFloat(layer.dataset.speed || '0');
        const direction = layer.dataset.direction || 'vertical';
        
        // Mouse depth effect based on layer's speed mapping
        const mouseOffsetX = currentMouseX * speed * -15; // Max 15px drift, inverted for depth
        const mouseOffsetY = currentMouseY * speed * -10;
        
        if (direction === 'horizontal-left') {
          const drift = targetScrollProgress * speed * 80;
          layer.style.transform = `translate3d(${-drift + mouseOffsetX}px, ${mouseOffsetY}px, 0)`;
        } else if (direction === 'horizontal-right') {
          const drift = targetScrollProgress * speed * 80;
          layer.style.transform = `translate3d(${drift + mouseOffsetX}px, ${mouseOffsetY}px, 0)`;
        } else {
          const yOffset = targetScrollProgress * speed * 100;
          layer.style.transform = `translate3d(${mouseOffsetX}px, ${yOffset + mouseOffsetY}px, 0)`;
        }
      });
      
      animId = requestAnimationFrame(loop);
    };

    // Initial setup
    handleScroll();
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    contactSection.addEventListener('scroll', handleScroll, { passive: true });
    
    animId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      contactSection.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animId);
    };
  }, []);

  // I'll rewrite the logic more robustly for React
  useEffect(() => {
    const arena = arenaRef.current;
    const cursor = cursorRef.current;
    const stack = stackRef.current;
    const cards = cardsRef.current;

    if (!arena || !cursor || !stack) return;

    const isTouch = isTouchDevice();
    let tx = 0, ty = 0, ttx = 0, tty = 0, fa = 0;
    let isFannedRef = false;
    let flippedIdxRef: number | null = null;

    const updateTransforms = (liftIdx: number | null = null) => {
      const FAN = getFAN();
      cards.forEach((card, i) => {
        if (!card) return;
        const config = isFannedRef ? FAN[i] : IDLE[i];
        const isLifted = liftIdx === i;
        const isFlipped = flippedIdxRef === i;
        
        const dz = isLifted ? 46 : 0;
        const ry = isFlipped ? 180 : 0;
        card.style.transform = `translateX(${config.x}px) translateY(${config.y}px) translateZ(${config.z + dz}px) rotateZ(${config.rz}deg) rotateY(${ry}deg)`;
        
        const dim = isFannedRef && liftIdx !== null && liftIdx !== i && flippedIdxRef === null;
        const deepDim = isFannedRef && flippedIdxRef !== null && flippedIdxRef !== i;
        
        if (deepDim) card.style.filter = 'brightness(0.42)';
        else if (dim) card.style.filter = 'brightness(0.62)';
        else card.style.filter = '';
      });
    };

    const loop = () => {
      tx += (ttx - tx) * 0.07;
      ty += (tty - ty) * 0.07;
      let fy = 0;
      if (!isFannedRef) {
        fa += 0.013;
        fy = Math.sin(fa) * 6;
      }
      stack.style.transform = `rotateX(${tx}deg) rotateY(${ty}deg) translateY(${fy}px)`;
      requestAnimationFrame(loop);
    };
    const animId = requestAnimationFrame(loop);

    // Resize handler to recalculate fan positions
    const onResize = () => {
      if (isFannedRef) updateTransforms();
    };
    window.addEventListener('resize', onResize);

    // --- Mouse events (desktop only) ---
    const onMouseEnterArena = () => {
      if (isTouch) return;
      if (!isFannedRef && flippedIdxRef === null) {
        isFannedRef = true;
        setFanned(true);
        updateTransforms();
      }
      cursor.classList.add('expand');
    };

    const onMouseLeaveArena = () => {
      if (isTouch) return;
      isFannedRef = false;
      setFanned(false);
      flippedIdxRef = null;
      setFlipped(null);
      updateTransforms();
      ttx = 0;
      tty = 0;
      cursor.classList.remove('expand');
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isTouch) return;
      const r = arena.getBoundingClientRect();
      ttx = ((e.clientY - (r.top + r.height / 2)) / (r.height / 2)) * -5.5;
      tty = ((e.clientX - (r.left + r.width / 2)) / (r.width / 2)) * 8;
      
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    };

    const onGlobalMouseMove = (e: MouseEvent) => {
      if (isTouch) return;
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    };

    arena.addEventListener('mouseenter', onMouseEnterArena);
    arena.addEventListener('mouseleave', onMouseLeaveArena);
    arena.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousemove', onGlobalMouseMove);

    // --- Touch events (mobile) ---
    const onTouchArena = (e: TouchEvent) => {
      if (!isTouch) return;
      // If cards are not fanned, fan them
      if (!isFannedRef && flippedIdxRef === null) {
        isFannedRef = true;
        setFanned(true);
        updateTransforms();
      }
    };

    arena.addEventListener('touchstart', onTouchArena, { passive: true });

    // Card events (works for both mouse and touch)
    const cardCleanups: (() => void)[] = [];
    cards.forEach((card, i) => {
      if (!card) return;
      
      const onMouseEnterCard = () => {
        if (isTouch) return;
        if (!isFannedRef || flippedIdxRef !== null) return;
        updateTransforms(i);
      };
      
      const onMouseLeaveCard = () => {
        if (isTouch) return;
        if (!isFannedRef || flippedIdxRef !== null) return;
        updateTransforms(null);
      };
      
      const onClickCard = (e: Event) => {
        if (!isFannedRef) return;
        if (flippedIdxRef !== null) return;
        e.stopPropagation();
        flippedIdxRef = i;
        setFlipped(i);
        updateTransforms(i);
      };

      card.addEventListener('mouseenter', onMouseEnterCard);
      card.addEventListener('mouseleave', onMouseLeaveCard);
      card.addEventListener('click', onClickCard);

      cardCleanups.push(() => {
        card.removeEventListener('mouseenter', onMouseEnterCard);
        card.removeEventListener('mouseleave', onMouseLeaveCard);
        card.removeEventListener('click', onClickCard);
      });
    });

    // Flip back logic
    const flipButtons = document.querySelectorAll('.b-flip');
    const onFlipBack = (e: Event) => {
      e.stopPropagation();
      flippedIdxRef = null;
      setFlipped(null);
      updateTransforms();
    };
    flipButtons.forEach(btn => btn.addEventListener('click', onFlipBack));

    // Touch outside to collapse on mobile
    const onDocTouch = (e: TouchEvent) => {
      if (!isTouch || !isFannedRef) return;
      const target = e.target as HTMLElement;
      if (!arena.contains(target)) {
        isFannedRef = false;
        setFanned(false);
        flippedIdxRef = null;
        setFlipped(null);
        updateTransforms();
      }
    };
    document.addEventListener('touchstart', onDocTouch, { passive: true });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      arena.removeEventListener('mouseenter', onMouseEnterArena);
      arena.removeEventListener('mouseleave', onMouseLeaveArena);
      arena.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousemove', onGlobalMouseMove);
      arena.removeEventListener('touchstart', onTouchArena);
      document.removeEventListener('touchstart', onDocTouch);
      cardCleanups.forEach(fn => fn());
      flipButtons.forEach(btn => btn.removeEventListener('click', onFlipBack));
    };
  }, []);

  return (
    <div className="contact-remarkable">
      {/* Parallax Background */}
      <div className="parallax-bg" ref={parallaxRef}>
        <div className="parallax-layer" data-speed="-1.2" data-direction="vertical">
          <img src={frontLayer3rd} alt="" className="parallax-img parallax-layer-back" />
        </div>
        <div className="parallax-layer" data-speed="-0.6" data-direction="vertical">
          <img src={frontLayer2nd} alt="" className="parallax-img parallax-layer-mid" />
        </div>
        <div className="parallax-layer" data-speed="-0.2" data-direction="vertical">
          <img src={frontLayer} alt="" className="parallax-img parallax-layer-front" />
        </div>
        <div className="parallax-layer" data-speed="1.5" data-direction="horizontal-left">
          <img src={cloudLeft} alt="" className="parallax-img parallax-cloud parallax-cloud-left" />
        </div>
        <div className="parallax-layer" data-speed="1.5" data-direction="horizontal-right">
          <img src={cloudRight} alt="" className="parallax-img parallax-cloud parallax-cloud-right" />
        </div>
        <div className="parallax-overlay"></div>
      </div>

      <div id="custom-cursor" ref={cursorRef}></div>

      <button className="remarkable-back-btn" onClick={onBack}>
        <span className="btn-arrow">←</span> Return
      </button>



      <div className="contact-page">
        <div className="contact-intro">
          <div className="contact-lbl">Lets Connect</div>
          <h1 className="contact-title">Let's make<br />something<br /><em>remarkable.</em></h1>
          <p className="contact-copy">Open to freelance, full-time roles, and collabs. Four ways to reach me — pick the one that suits you.</p>
          <div className="contact-hint">Hover the cards <span className="hint-arr">→</span></div>
        </div>

        <div className="contact-arena" ref={arenaRef}>
          <div className="contact-stack" ref={stackRef}>
            
            {/* Card 0 · Email */}
            <div className="contact-card" ref={el => { cardsRef.current[0] = el; }} data-type="email">
              <div className="contact-face contact-front">
                <div className="f-num">01 / 04</div>
                <div className="f-title">Send a<em>message</em></div>
                <div className="f-foot">
                  <div className="f-sub">Email</div>
                  <div className="f-btn">
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="#2a8a12" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1.5 6.5h10M6.5 1.5l5 5-5 5" /></svg>
                  </div>
                </div>
              </div>
              <div className="contact-face contact-back">
                <div className="b-eye">Email me directly</div>
                <div className="b-icon">
                  <svg width="21" height="21" viewBox="0 0 21 21" fill="none" stroke="#39ff14" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="5" width="17" height="12" rx="2.5" />
                    <path d="M2 8l8.5 5.5L19 8" />
                  </svg>
                </div>
                <div className="b-val">ramvigneshnanban@gmail.com</div>
                <a href="mailto:ramvigneshnanban@gmail.com" className="b-cta">
                  Open mail
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M1 4.5h7M4.5 1l3.5 3.5L4.5 8" /></svg>
                </a>
                <div className="b-flip">↩ flip back</div>
              </div>
            </div>

            {/* Card 1 · WhatsApp */}
            <div className="contact-card" ref={el => { cardsRef.current[1] = el; }} data-type="whatsapp">
              <div className="contact-face contact-front">
                <div className="f-num">02 / 04</div>
                <div className="f-title">Chat on<em>WhatsApp</em></div>
                <div className="f-foot">
                  <div className="f-sub">WhatsApp</div>
                  <div className="f-btn">
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="#2a8a12" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1.5 6.5h10M6.5 1.5l5 5-5 5" /></svg>
                  </div>
                </div>
              </div>
              <div className="contact-face contact-back">
                <div className="b-eye">Message me on WhatsApp</div>
                <div className="b-icon">
                  <svg width="21" height="21" viewBox="0 0 21 21" fill="none" stroke="#39ff14" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.5 2.5a8 8 0 00-7 12.1L2.5 18.5l4.1-1A8 8 0 1010.5 2.5z" />
                    <path d="M7.8 9.2c0 .5.2 1 .4 1.4.4.7.9 1.2 1.6 1.5.4.2.8.2 1.1 0l.3-.4c.1-.2 0-.4-.1-.5l-.7-.6c-.1-.1-.3-.1-.4 0l-.2.2c-.1.1-.2.1-.4 0-.3-.2-.6-.5-.8-.8-.1-.1-.1-.3 0-.4l.2-.2c.1-.1.1-.3 0-.4l-.7-.7c-.1-.1-.3-.1-.5 0l-.4.3c-.3.3-.4.7-.4 1.1z" />
                  </svg>
                </div>
                <div className="b-val">+91 7338971709</div>
                <a
                  href="https://wa.me/917338971709?text=Hi%20Ram%20Vignesh%2C%20I%20saw%20your%20portfolio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="b-cta"
                >
                  Open chat
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M1 4.5h7M4.5 1l3.5 3.5L4.5 8" /></svg>
                </a>
                <div className="b-flip">↩ flip back</div>
              </div>
            </div>

            {/* Card 2 · LinkedIn */}
            <div className="contact-card" ref={el => { cardsRef.current[2] = el; }} data-type="linkedin">
              <div className="contact-face contact-front">
                <div className="f-num">03 / 04</div>
                <div className="f-title">Let's<em>connect</em></div>
                <div className="f-foot">
                  <div className="f-sub">LinkedIn</div>
                  <div className="f-btn">
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="#2a8a12" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1.5 6.5h10M6.5 1.5l5 5-5 5" /></svg>
                  </div>
                </div>
              </div>
              <div className="contact-face contact-back">
                <div className="b-eye">Connect on LinkedIn</div>
                <div className="b-icon">
                  <svg width="21" height="21" viewBox="0 0 21 21" fill="none" stroke="#39ff14" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="17" height="17" rx="3" />
                    <path d="M6.5 9.5v5M6.5 7v.01M10.5 14.5v-3a2 2 0 014 0v3M10.5 9.5v5" />
                  </svg>
                </div>
                <div className="b-val">/in/yourhandle</div>
                <a href="https://linkedin.com/in/yourhandle" target="_blank" rel="noopener noreferrer" className="b-cta">
                  View profile
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M1 4.5h7M4.5 1l3.5 3.5L4.5 8" /></svg>
                </a>
                <div className="b-flip">↩ flip back</div>
              </div>
            </div>

            {/* Card 3 · Resume */}
            <div className="contact-card" ref={el => { cardsRef.current[3] = el; }} data-type="resume">
              <div className="contact-face contact-front">
                <div className="f-num">04 / 04</div>
                <div className="f-title">View my<em>résumé</em></div>
                <div className="f-foot">
                  <div className="f-sub">Download PDF</div>
                  <div className="f-btn">
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="#2a8a12" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6.5 1.5v7M3.5 6l3 3 3-3M2 11h9" /></svg>
                  </div>
                </div>
              </div>
              <div className="contact-face resume-back">
                <div className="res-top">
                  <div className="res-avatar">RV</div>
                  <div>
                    <div className="res-name">Ram Vignesh</div>
                    <div className="res-role">React Developer</div>
                  </div>
                </div>
                <div className="res-stats">
                  <div className="res-stat">
                    <div className="res-stat-n">3+</div>
                    <div className="res-stat-l">Years</div>
                  </div>
                  <div className="res-stat">
                    <div className="res-stat-n">17+</div>
                    <div className="res-stat-l">Projects</div>
                  </div>
                  <div className="res-stat">
                    <div className="res-stat-n">2</div>
                    <div className="res-stat-l">Clients</div>
                  </div>
                </div>
                <div className="res-skills">
                  <span className="res-sk">React</span>
                  <span className="res-sk">Next.js</span>
                  <span className="res-sk">GSAP</span>
                  <span className="res-sk">Node.js</span>
                  <span className="res-sk">TypeScript</span>
                </div>
                <a href="resume.pdf" download="YourName_Resume.pdf" className="res-dl">
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="#080c08" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6.5 1.5v7M3.5 6l3 3 3-3M2 11h9" /></svg>
                  Download Résumé
                </a>
                <div className="res-bot">
                  <div className="b-flip">↩ flip back</div>
                </div>
              </div>
            </div>

            <div className="stack-glow"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
