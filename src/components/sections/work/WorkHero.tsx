import React, { forwardRef } from 'react';
import Hero3DText from './Hero3DText';

const WorkHero = forwardRef<HTMLElement>((props, ref) => (
  <section id="hero" ref={ref}>
    <div className="p-el hero-bigword" data-speed="-0.25">REACT</div>
    <div className="p-el hero-orb" data-speed="0.18"></div>
    <div className="p-el hero-orb2" data-speed="-0.12"></div>
    <div className="p-el hero-circle1" data-speed="0.10"></div>
    <div className="p-el hero-circle2" data-speed="-0.15"></div>
    <div className="p-el hero-circle3" data-speed="0.30"></div>

    <div className="p-el snippet" style={{ top: '18%', right: '8%' }} data-speed="-0.20">
      <span className="kw">const</span> <span className="fn">App</span> = () =&gt; (<br />
      &nbsp;&lt;<span className="fn">Router</span>&gt;<br />
      &nbsp;&nbsp;&lt;<span className="fn">Routes</span> /&gt;<br />
      &nbsp;&lt;/<span className="fn">Router</span>&gt;<br />
      )
    </div>
    <div className="p-el snippet" style={{ top: '55%', right: '3%' }} data-speed="0.28">
      <span className="kw">export default function</span> <span className="fn">Page</span>() &#123;<br />
      &nbsp;<span className="kw">return</span> &lt;<span className="fn">Hero</span> animate /&gt;<br />
      &#125;
    </div>
    <div className="p-el snippet" style={{ top: '72%', left: '2%' }} data-speed="-0.18">
      <span className="cm">// Lighthouse score</span><br />
      performance: <span style={{ color: 'var(--green-dk)' }}>99</span>
    </div>

    <div className="hero-content">
      <Hero3DText />
    </div>

    <div className="scroll-hint">
      <div className="scroll-line-anim"></div>
      scroll
    </div>
  </section>
));

WorkHero.displayName = 'WorkHero';
export default WorkHero;
