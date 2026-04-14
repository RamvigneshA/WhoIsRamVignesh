import React, { useEffect, useRef, useState, useCallback } from 'react'
import myImg from '../../assets/myimg.webp'
import pointingFinger from '../../assets/pointingFinger.png'
import SoftAurora from '../SoftAurora'
import { gsap } from 'gsap'

const Hero = ({ onNavigate }) => {
  const tlBubbleRef = useRef(null)
  const trBubbleRef = useRef(null)
  const blBubbleRef = useRef(null)
  const brBubbleRef = useRef(null)
  const overlayRef = useRef(null)
  const tlFingerRef = useRef(null)
  const trFingerRef = useRef(null)
  const blFingerRef = useRef(null)
  const brFingerRef = useRef(null)
  const containerRef = useRef(null)

  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [activeCorner, setActiveCorner] = useState(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const dragStart = useRef({ x: 0, y: 0 })

  const updateAngles = useCallback(() => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const cx = rect.width / 2 + pos.x
    const cy = rect.height / 2 + pos.y

    const corners = [
      { ref: tlFingerRef, x: 0,          y: 0 },
      { ref: trFingerRef, x: rect.width, y: 0 },
      { ref: blFingerRef, x: 0,          y: rect.height },
      { ref: brFingerRef, x: rect.width, y: rect.height },
    ]

    corners.forEach(({ ref, x, y }) => {
      if (!ref.current) return
      const dx = cx - x
      const dy = cy - y
      const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90
      ref.current.style.transform = `rotate(${angle}deg)`
    })
  }, [pos])

  useEffect(() => {
    updateAngles()
    window.addEventListener('resize', updateAngles)
    return () => window.removeEventListener('resize', updateAngles)
  }, [updateAngles])

  // Combined Drag Start
  const handleStart = (clientX, clientY) => {
    setIsDragging(true)
    dragStart.current = {
      x: clientX - pos.x,
      y: clientY - pos.y
    }
  }

  // Combined Move logic
  const handleMove = useCallback((clientX, clientY) => {
    if (!isDragging) return
    
    const maxX = window.innerWidth * 0.35
    const maxY = window.innerHeight * 0.35

    let newX = clientX - dragStart.current.x
    let newY = clientY - dragStart.current.y

    newX = Math.max(-maxX, Math.min(maxX, newX))
    newY = Math.max(-maxY, Math.min(maxY, newY))

    setPos({ x: newX, y: newY })

    // Hit detection
    const corners = [
      { id: 'about',    ref: tlBubbleRef },
      { id: 'work',     ref: trBubbleRef },
      { id: 'projects', ref: blBubbleRef },
      { id: 'contact',  ref: brBubbleRef },
    ]

    let found = null
    corners.forEach(({ id, ref }) => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const charRect = {
        x: window.innerWidth / 2 + newX,
        y: window.innerHeight / 2 + newY
      }
      const dx = charRect.x - (rect.left + rect.width / 2)
      const dy = charRect.y - (rect.top + rect.height / 2)
      const dist = Math.sqrt(dx * dx + dy * dy)
      
      if (dist < 120) found = id
    })
    setActiveCorner(found)
  }, [isDragging, isTransitioning])

  const triggerAbsorption = useCallback((cornerId) => {
    setIsTransitioning(true)
    const targetRef = {
      about: tlBubbleRef,
      work: trBubbleRef,
      projects: blBubbleRef,
      contact: brBubbleRef
    }[cornerId]

    if (!targetRef.current || !overlayRef.current) return

    const rect = targetRef.current.getBoundingClientRect()
    const targetX = rect.left + rect.width / 2
    const targetY = rect.top + rect.height / 2

    const tl = gsap.timeline({
      onComplete: () => {
        onNavigate(cornerId)
      }
    })

    // 1. Move character to bubble
    tl.to('.char-wrapper', {
      x: targetX - window.innerWidth / 2,
      y: targetY - window.innerHeight / 2,
      scale: 0,
      duration: 0.6,
      ease: 'power3.inOut'
    })

    // 2. Expand bubble/overlay
    tl.set(overlayRef.current, {
      left: targetX,
      top: targetY,
      width: 0,
      height: 0,
      opacity: 1
    })

    tl.to(overlayRef.current, {
      width: window.innerWidth * 2.5,
      height: window.innerWidth * 2.5,
      duration: 0.8,
      ease: 'power2.in'
    })
  }, [onNavigate])

  const handleEnd = useCallback(() => {
    setIsDragging(false)
    if (activeCorner && !isTransitioning) {
      triggerAbsorption(activeCorner)
    }
  }, [activeCorner, isTransitioning, triggerAbsorption])

  // Global Listeners for Move and End
  useEffect(() => {
    const onMouseMove = (e) => handleMove(e.clientX, e.clientY)
    const onTouchMove = (e) => {
      // Prevent scrolling while dragging on mobile
      if (e.cancelable) e.preventDefault() 
      handleMove(e.touches[0].clientX, e.touches[0].clientY)
    }

    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove)
      window.addEventListener('mouseup', handleEnd)
      // { passive: false } is required to allow e.preventDefault()
      window.addEventListener('touchmove', onTouchMove, { passive: false })
      window.addEventListener('touchend', handleEnd)
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', handleEnd)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', handleEnd)
    }
  }, [isDragging, handleMove, handleEnd])

  return (
    <div className="hero" ref={containerRef} style={{ position: 'fixed', inset: 0, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <SoftAurora 
          speed={0.3} scale={1.4} brightness={0.9}
          color1="#ffffff" color2="#f0e6ff"
          noiseFrequency={2} noiseAmplitude={1}
          bandHeight={0.5} bandSpread={1}
          octaveDecay={0.1} layerOffset={0}
          colorSpeed={1} enableMouseInteraction mouseInfluence={0.1}
        />
      </div>

      <div className="hero-content" style={{ 
        position: 'relative', zIndex: 1, width: '100%', height: '100%',
        opacity: 0,
        animation: 'heroEntrance 1.5s ease-out 0.5s forwards' 
      }}>
        
        <div 
          onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
          onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
          style={{ 
            position: 'absolute', inset: 0,
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            cursor: isDragging ? 'grabbing' : 'grab',
            touchAction: 'none' // Essential for mobile to disable browser gestures
          }}
        >
          <div className="char-wrapper" style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            transform: `translate(${pos.x}px, ${pos.y}px)`,
            transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            userSelect: 'none'
          }}>
            {/* Racing Arrows Guides */}
            {!isDragging && (
              <>
                <div className="race-arrows tl">
                  <span className="race-sequence"><span>›</span><span>›</span><span>›</span><span>›</span></span>
                </div>
                <div className="race-arrows tr">
                  <span className="race-sequence"><span>›</span><span>›</span><span>›</span><span>›</span></span>
                </div>
                <div className="race-arrows bl">
                  <span className="race-sequence"><span>›</span><span>›</span><span>›</span><span>›</span></span>
                </div>
                <div className="race-arrows br">
                  <span className="race-sequence"><span>›</span><span>›</span><span>›</span><span>›</span></span>
                </div>
              </>
            )}

            <img 
              src={myImg} alt="Hero" 
              draggable="false"
              style={{ 
                width: 'clamp(220px, 35vw, 520px)',
                height: 'auto',
                objectFit: 'contain'
              }} 
            />
          </div>
        </div>

        <div className="corner-hand tl">
          <img ref={tlFingerRef} src={pointingFinger} alt="" className="finger-img tl-finger" />
          <div ref={tlBubbleRef} className={`bubble tl-bubble ${activeCorner === 'about' ? 'active' : ''}`}>Who is <br/>this guy?</div>
        </div>

        <div className="corner-hand tr">
          <img ref={trFingerRef} src={pointingFinger} alt="" className="finger-img tr-finger" />
          <div ref={trBubbleRef} className={`bubble tr-bubble ${activeCorner === 'work' ? 'active' : ''}`}>What does <br/>he actually<br/> do?</div>
        </div>

        <div className="corner-hand bl">
          <img ref={blFingerRef} src={pointingFinger} alt="" className="finger-img bl-finger" />
          <div ref={blBubbleRef} className={`bubble bl-bubble ${activeCorner === 'projects' ? 'active' : ''}`}>Can he <br/>build real<br/> products?</div>
        </div>

        <div className="corner-hand br">
          <img ref={brFingerRef} src={pointingFinger} alt="" className="finger-img br-finger" />
          <div ref={brBubbleRef} className={`bubble br-bubble ${activeCorner === 'contact' ? 'active' : ''}`}>Should I <br/>hire him?</div>
        </div>

        {/* Transition Overlay */}
        <div ref={overlayRef} className="nav-overlay" />
      </div>

      <style>{`
        @keyframes heroEntrance {
          from { opacity: 0; transform: scale(1.02); }
          to   { opacity: 1; transform: scale(1); }
        }

        @keyframes raceFlow {
          0% { opacity: 0; transform: translateX(-10px); }
          20% { opacity: 1; transform: translateX(0); }
          80% { opacity: 1; transform: translateX(0); }
          100% { opacity: 0; transform: translateX(10px); }
        }

        .corner-hand {
          position: absolute;
          z-index: 2;
          display: flex;
          align-items: flex-start;
          pointer-events: none;
        }

        .race-arrows {
          position: absolute;
          z-index: 5;
          pointer-events: none;
          color: rgba(255, 255, 255, 0.6);
          font-size: 24px;
          font-weight: bold;
          letter-spacing: -2px;
          display: flex;
          gap: 2px;
        }

        .race-sequence span {
          display: inline-block;
          animation: raceFlow 1.6s infinite both;
          opacity: 0;
        }

        .race-sequence span:nth-child(1) { animation-delay: 0.1s; }
        .race-sequence span:nth-child(2) { animation-delay: 0.2s; }
        .race-sequence span:nth-child(3) { animation-delay: 0.3s; }
        .race-sequence span:nth-child(4) { animation-delay: 0.4s; }

        .race-arrows.tl { top: 20%; left: 20%; transform: rotate(-135deg); }
        .race-arrows.tr { top: 20%; right: 20%; transform: rotate(-45deg); }
        .race-arrows.bl { bottom: 20%; left: 20%; transform: rotate(135deg); }
        .race-arrows.br { bottom: 20%; right: 20%; transform: rotate(45deg); }

        .finger-img {
          width: clamp(160px, 32vw, 580px);
          height: auto;
          flex-shrink: 0;
          will-change: transform;
        }

        .bubble {
  padding: clamp(10px, 1.4vw, 16px) clamp(16px, 2.5vw, 28px);
  font-size: clamp(0.75rem, 1.3vw, 1.1rem);
  color: #fff;

  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 999px;

  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  letter-spacing: 0.04em;
  font-weight: 500;

  align-self: center;

  transition: all 0.3s ease;
  cursor: pointer;
}

.bubble.active {
  transform: scale(1.15) !important;
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 30px rgba(255, 255, 255, 0.1);
}

.nav-overlay {
  position: fixed;
  border-radius: 50%;
  background: #fff;
  pointer-events: none;
  z-index: 100;
  transform: translate(-50%, -50%);
  width: 0;
  height: 0;
  opacity: 0;
}

        .corner-hand.tl { top: 0; left: 0; flex-direction: row; align-items: flex-end; }
        .tl-finger { margin-left: clamp(-90px, -13vw, -60px); margin-top: clamp(-60px, -9vw, -30px); }
        .tl-bubble { margin-left: 8px; }

        .corner-hand.tr { top: 0; right: 0; flex-direction: row-reverse; align-items: flex-end; }
        .tr-finger { margin-right: clamp(-90px, -13vw, -60px); margin-top: clamp(-60px, -9vw, -30px); }
        .tr-bubble { margin-right: 8px; }

        .corner-hand.bl { bottom: 0; left: 0; flex-direction: row; align-items: flex-start; }
        .bl-finger { margin-left: clamp(-90px, -13vw, -60px); margin-bottom: clamp(-60px, -9vw, -30px); }
        .bl-bubble { margin-left: 0px; }

        .corner-hand.br { bottom: 0; right: 0; flex-direction: row-reverse; align-items: flex-start; }
        .br-finger { margin-right: clamp(-90px, -13vw, -60px); margin-bottom: clamp(-60px, -9vw, -30px); }
        .br-bubble { margin-right: 8px; }

        @media (max-width: 768px) {
          .bubble { white-space: normal; max-width: 140px; text-align: center; }
          .finger-img { width: 180px; } /* Slightly smaller for mobile */
        }
      `}</style>
    </div>
  )
}

export default Hero