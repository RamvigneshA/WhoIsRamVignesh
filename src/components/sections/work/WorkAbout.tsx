import React from 'react';

const WorkAbout = () => (
  <section id="about">
    <div className="p-el about-year" style={{ top: '60px', left: '-40px' }} data-speed="-0.14">2026</div>
    <div className="p-el deco-ring" style={{ width: '400px', height: '400px', top: '-100px', right: '-80px' }} data-speed="0.12"></div>
    <div className="p-el deco-ring" style={{ width: '200px', height: '200px', bottom: '80px', left: '20%' }} data-speed="-0.08"></div>
    <div className="p-el snippet" style={{ bottom: '100px', right: '2%' }} data-speed="0.22">
      <span className="kw">import</span> &#123; <span className="fn">motion</span> &#125; <span className="kw">from</span> <span className="str">'framer-motion'</span>
    </div>
    <div className="p-el snippet" style={{ top: '80px', right: '38%' }} data-speed="-0.16">
      <span className="cm">// zero layout shift</span><br />CLS: <span style={{ color: 'var(--green-dk)' }}>0.00</span>
    </div>

    <div className="w-wrap">
      <p className="sec-eye">01 — About</p>
      <div className="about-layout">
        <div>
          <h2 className="about-big-q">I build things<br />the <em>right way.</em></h2>
          <p className="about-p">I care about the <strong>intersection of engineering and design</strong> — the micro-interaction that delights, the page that loads before you blink, the component API that just makes sense.</p>
          <p className="about-p">Built products used by <strong>millions</strong>. Led front-end at two YC-backed startups. Shipped a design system used across 6 products. Contributed to open-source libraries with <strong>18K weekly downloads.</strong></p>
          <p className="about-p">Currently exploring <strong>senior & lead opportunities</strong> at companies that care about craft as much as delivery.</p>
        </div>
      </div>
    </div>
  </section>
);

export default WorkAbout;
