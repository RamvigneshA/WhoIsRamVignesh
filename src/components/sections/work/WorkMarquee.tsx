import React from 'react';

const WorkMarquee = () => (
  <div className="marquee-belt">
    <div className="marquee-inner" id="mq">
      <div className="m-item">React <span className="m-dot"></span></div><div className="m-item">Next.js <span className="m-dot"></span></div>
      <div className="m-item">TypeScript <span className="m-dot"></span></div><div className="m-item">Tailwind <span className="m-dot"></span></div>
      <div className="m-item">Performance <span className="m-dot"></span></div><div className="m-item">Accessibility <span className="m-dot"></span></div>
      <div className="m-item">GraphQL <span className="m-dot"></span></div><div className="m-item">Design Systems <span className="m-dot"></span></div>
      {/* dup */}
      <div className="m-item">React <span className="m-dot"></span></div><div className="m-item">Next.js <span className="m-dot"></span></div>
      <div className="m-item">TypeScript <span className="m-dot"></span></div><div className="m-item">Tailwind <span className="m-dot"></span></div>
      <div className="m-item">Performance <span className="m-dot"></span></div><div className="m-item">Accessibility <span className="m-dot"></span></div>
      <div className="m-item">GraphQL <span className="m-dot"></span></div><div className="m-item">Design Systems <span className="m-dot"></span></div>
    </div>
  </div>
);

export default WorkMarquee;
