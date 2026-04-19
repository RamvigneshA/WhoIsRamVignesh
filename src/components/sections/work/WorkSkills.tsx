import React from 'react';

const WorkSkills = () => (
  <section id="skills">
    <div className="p-el sk-float-num" style={{ right: '-30px', top: '40px' }} data-speed="-0.20">97</div>
    <div className="p-el sk-float-num" style={{ left: '-20px', bottom: '40px' }} data-speed="0.15">3+</div>
    <div className="p-el snippet" style={{ top: '60px', right: '48px' }} data-speed="-0.18">
      <span style={{ color: '#7c3aed' }}>useMemo</span>(() =&gt; compute(data), [data])
    </div>
    <div className="p-el snippet" style={{ bottom: '80px', left: '48px' }} data-speed="0.22">
      <span style={{ color: '#7c3aed' }}>const</span> [state, dispatch] = <span style={{ color: 'var(--green-dk)' }}>useReducer</span>(fn, init)
    </div>

    <div className="w-wrap" style={{ paddingBottom: '40px' }}>
      <p className="sec-eye">02 — Skills</p>
      <h2 className="h-serif" style={{ fontSize: 'clamp(36px,5vw,68px)', color: 'var(--ink)', marginBottom: 0 }}>What I <em style={{ color: 'var(--green-dk)' }}>do best.</em></h2>
    </div>
    <div className="w-wrap" style={{ padding: 0 }}>
      <div className="skills-top">
        <div className="skills-panel">
          <p className="sp-label">// Frontend</p>
          <div className="sk"><div className="sk-left"><div className="sk-pip pip-g"></div><span className="sk-name">React & Next.js</span></div><span className="sk-n">97%</span></div>
          <div className="sk"><div className="sk-left"><div className="sk-pip pip-g"></div><span className="sk-name">TypeScript</span></div><span className="sk-n">94%</span></div>
          <div className="sk"><div className="sk-left"><div className="sk-pip pip-g"></div><span className="sk-name">CSS & Animation</span></div><span className="sk-n">93%</span></div>
          <div className="sk"><div className="sk-left"><div className="sk-pip pip-g"></div><span className="sk-name">State Management</span></div><span className="sk-n">91%</span></div>
          <div className="sk"><div className="sk-left"><div className="sk-pip pip-w"></div><span className="sk-name">Web Performance</span></div><span className="sk-n">89%</span></div>
        </div>
        <div className="skills-panel">
          <p className="sp-label">// Platform & tooling</p>
          <div className="sk"><div className="sk-left"><div className="sk-pip pip-g"></div><span className="sk-name">Node.js & APIs</span></div><span className="sk-n">86%</span></div>
          <div className="sk"><div className="sk-left"><div className="sk-pip pip-g"></div><span className="sk-name">GraphQL</span></div><span className="sk-n">88%</span></div>
          <div className="sk"><div className="sk-left"><div className="sk-pip pip-w"></div><span className="sk-name">Design Systems</span></div><span className="sk-n">90%</span></div>
          <div className="sk"><div className="sk-left"><div className="sk-pip pip-w"></div><span className="sk-name">Testing (Vitest, Cypress)</span></div><span className="sk-n">82%</span></div>
          <div className="sk"><div className="sk-left"><div className="sk-pip pip-w"></div><span className="sk-name">CI/CD & DevOps</span></div><span className="sk-n">76%</span></div>
        </div>
      </div>
      <div className="pills-dark">
        <span className="pd">React 19</span><span className="pd">Next.js 15</span><span className="pd">Tailwind CSS</span>
        <span className="pd">Zustand</span><span className="pd">React Query</span><span className="pd">Framer Motion</span>
        <span className="pd">Prisma</span><span className="pd">Radix UI</span><span className="pd">Vitest</span>
        <span className="pd">Storybook</span><span className="pd">Docker</span><span className="pd">Vercel</span>
        <span className="pd">Stripe</span><span className="pd">tRPC</span><span className="pd">Socket.io</span>
      </div>
    </div>
  </section>
);

export default WorkSkills;
