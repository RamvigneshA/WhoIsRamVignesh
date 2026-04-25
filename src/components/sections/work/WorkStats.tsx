import React from 'react';

const WorkStats = () => (
  <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}>

    {/* Background decoration */}
    <div className="depth-bg" style={{
      position: 'absolute',
      fontFamily: '"Instrument Serif", serif',
      fontSize: '25vw',
      color: 'rgba(12,12,12,.03)',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      whiteSpace: 'nowrap',
      pointerEvents: 'none',
    }}>
      STATS
    </div>

    {/* Marquee Belt */}
    <div className="marquee-belt">
      <div className="marquee-inner" id="mq">
        <div className="m-item">React <span className="m-dot"></span></div>
        <div className="m-item">Next.js <span className="m-dot"></span></div>
        <div className="m-item">TypeScript <span className="m-dot"></span></div>
        <div className="m-item">Tailwind <span className="m-dot"></span></div>
        <div className="m-item">Performance <span className="m-dot"></span></div>
        <div className="m-item">Accessibility <span className="m-dot"></span></div>
        <div className="m-item">GraphQL <span className="m-dot"></span></div>
        <div className="m-item">Design Systems <span className="m-dot"></span></div>
        {/* dup for seamless loop */}
        <div className="m-item">React <span className="m-dot"></span></div>
        <div className="m-item">Next.js <span className="m-dot"></span></div>
        <div className="m-item">TypeScript <span className="m-dot"></span></div>
        <div className="m-item">Tailwind <span className="m-dot"></span></div>
        <div className="m-item">Performance <span className="m-dot"></span></div>
        <div className="m-item">Accessibility <span className="m-dot"></span></div>
        <div className="m-item">GraphQL <span className="m-dot"></span></div>
        <div className="m-item">Design Systems <span className="m-dot"></span></div>
      </div>
    </div>

    {/* Numbers Section */}
    <div className="numbers-section">
      <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '0 64px' }}>
        <p className="sec-eye anim-up">By the numbers</p>
      </div>
      <div className="numbers-grid">
        <div className="num-cell anim-scale" style={{ transitionDelay: '0s' }}>
          <div className="num-bg-digit depth-bg">3</div>
          <div className="num-val" data-count="3">0</div>
          <div className="num-label">Years of production React experience</div>
        </div>
        <div className="num-cell anim-scale" style={{ transitionDelay: '0.1s' }}>
          <div className="num-bg-digit depth-bg">10+</div>
          <div className="num-val" data-count="10">0</div>
          <div className="num-label">Projects shipped across industries</div>
        </div>
        <div className="num-cell anim-scale" style={{ transitionDelay: '0.2s' }}>
          <div className="num-bg-digit depth-bg">99</div>
          <div className="num-val" data-count="99">0</div>
          <div className="num-label">Average Lighthouse performance score</div>
        </div>
        <div className="num-cell anim-scale" style={{ transitionDelay: '0.3s' }}>
          <div className="num-bg-digit depth-bg">18k</div>
          <div className="num-val" data-count="18">0</div>
          <div className="num-label">Weekly npm downloads on OSS packages</div>
        </div>
      </div>
    </div>
  </div>
);

export default WorkStats;
