import React from 'react';

const WorkProcess = () => (
  <section id="process">
    <div className="p-el" style={{ position: 'absolute', fontFamily: '"Instrument Serif", serif', fontSize: '18vw', color: 'rgba(12,12,12,.025)', top: 0, left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', pointerEvents: 'none' }} data-speed="-0.10">HOW I WORK</div>
    <div className="p-el snippet" style={{ top: '60px', right: '2%' }} data-speed="-0.16">
      <span className="kw">type</span> <span className="fn">Process</span> = &#123;<br />
      &nbsp;discover: <span className="str">boolean</span>;<br />
      &nbsp;ship: <span className="str">boolean</span>;<br />
      &#125;
    </div>

    <div className="w-wrap">
      <p className="sec-eye">03 — Process</p>
      <h2 className="h-serif" style={{ fontSize: 'clamp(36px,5vw,68px)', color: '#000' }}>How I <em>work.</em></h2>
      <div className="process-grid">
        <div className="proc-card">
          <div className="proc-n">01</div>
          <div className="proc-title">Discover</div>
          <div className="proc-desc">Deep-dive into the product, users, and constraints. No assumptions.</div>
        </div>
        <div className="proc-card">
          <div className="proc-n">02</div>
          <div className="proc-title">Architect</div>
          <div className="proc-desc">Design the component tree, data flow, and performance budget upfront.</div>
        </div>
        <div className="proc-card">
          <div className="proc-n">03</div>
          <div className="proc-title">Build</div>
          <div className="proc-desc">Iterative development with tests. Accessible, documented, ship-ready.</div>
        </div>
        <div className="proc-card">
          <div className="proc-n">04</div>
          <div className="proc-title">Refine</div>
          <div className="proc-desc">Performance profiling, UX polish, and handoff that teams actually use.</div>
        </div>
      </div>
    </div>
  </section>
);

export default WorkProcess;
