import React from 'react';

const WorkNumbers = () => (
  <section id="numbers">
    <div className="w-wrap">
      <p className="sec-eye">By the numbers</p>
    </div>
    <div className="w-wrap" style={{ paddingTop: 0 }}>
      <div className="numbers-grid">
        <div className="num-cell p-el" data-speed="-0.06">
          <div className="num-bg-digit p-el" data-speed="-0.18">3</div>
          <div className="num-val" data-count="3">0</div>
          <div className="num-label">Years of production React experience</div>
        </div>
        <div className="num-cell p-el" data-speed="-0.04">
          <div className="num-bg-digit p-el" data-speed="-0.14">10+</div>
          <div className="num-val" data-count="10">0</div>
          <div className="num-label">Projects shipped across industries</div>
        </div>
        <div className="num-cell p-el" data-speed="-0.07">
          <div className="num-bg-digit p-el" data-speed="-0.20">99</div>
          <div className="num-val" data-count="99">0</div>
          <div className="num-label">Average Lighthouse performance score</div>
        </div>
        <div className="num-cell p-el" data-speed="-0.05">
          <div className="num-bg-digit p-el" data-speed="-0.16">18k</div>
          <div className="num-val" data-count="18">0</div>
          <div className="num-label">Weekly npm downloads on OSS packages</div>
        </div>
      </div>
    </div>
  </section>
);

export default WorkNumbers;
