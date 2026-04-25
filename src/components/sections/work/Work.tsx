import React, { useEffect, useRef } from 'react';
import './Work.css';
import WorkHero from './WorkHero';
import WorkMarquee from './WorkMarquee';
import WorkNumbers from './WorkNumbers';
import WorkAbout from './WorkAbout';
import WorkSkills from './WorkSkills';
import WorkProcess from './WorkProcess';
import WorkNewHero from './WorkNewHero';

const Work = ({ onBack }) => {
  const rootRef = useRef(null);
  const heroRef = useRef(null);
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  // 1. Cursor Handling
  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    const root = rootRef.current;
    if (!dot || !ring || !root) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx, ry = my;

    const handleMouseMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
    };

    root.addEventListener('mousemove', handleMouseMove);

    const interactiveEls = root.querySelectorAll('a, button, .pd, .proc-card');
    const handleMouseEnter = () => root.classList.add('hover');
    const handleMouseLeave = () => root.classList.remove('hover');

    interactiveEls.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    let rafId;
    const tick = () => {
      dot.style.cssText = `left:${mx}px;top:${my}px`;
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.cssText = `left:${rx}px;top:${ry}px`;
      rafId = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(rafId);
      root.removeEventListener('mousemove', handleMouseMove);
      interactiveEls.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  // 2. Continuous Parallax Engine on Local Scroll Container (.work-root)
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const parItems = [];
    root.querySelectorAll('.p-el[data-speed]').forEach(el => {
      parItems.push({ el, speed: parseFloat(el.dataset.speed) });
    });

    let scrollY = 0;
    let targetY = 0;

    const handleScroll = () => {
      targetY = root.scrollTop;
    };
    root.addEventListener('scroll', handleScroll, { passive: true });

    let rafId;
    const raf = () => {
      scrollY += (targetY - scrollY) * 0.09;
      const H = window.innerHeight;
      const heroRange = H * 4;
      const heroProgress = Math.min(scrollY / heroRange, 1);

      parItems.forEach(({ el, speed }) => {
        const isHeroEl = !!el.closest('.work-new-hero');
        let offset = 0;

        if (isHeroEl) {
          // Virtual Parallax for sticky elements
          offset = (heroProgress - 0.5) * H * speed * 2;
        } else {
          // Standard Coordinate Parallax
          const rect = el.getBoundingClientRect();
          const center = (rect.top + rect.bottom) / 2;
          offset = (center - H / 2) * speed;
        }

        if (el.classList.contains('hp-layer')) {
          let cinematicY = 0;
          let cinematicX = 0;
          let scale = 1;
          
          if (el.classList.contains('layer-mountain')) {
            scale = 1.3 - (heroProgress * 0.25);
            offset = 0; // Pinned
          }
          if (el.classList.contains('layer-bg')) {
            cinematicY = (1 - heroProgress) * 200;
          }
          if (el.classList.contains('layer-cave-interior') || el.classList.contains('layer-man')) {
            cinematicY = (1 - heroProgress) * 600;
          }
          if (el.classList.contains('layer-cave-left')) {
            cinematicX = (1 - heroProgress) * -800;
            cinematicY = (1 - heroProgress) * -600;
            scale = 1.4 - (heroProgress * 0.4); 
          }
          if (el.classList.contains('layer-cave-right')) {
            cinematicX = (1 - heroProgress) * 800;
            cinematicY = (1 - heroProgress) * -600;
            scale = 1.4 - (heroProgress * 0.4); 
          }
          
          el.style.transform = `translate(${cinematicX.toFixed(2)}px, ${(offset + cinematicY).toFixed(2)}px) scale(${scale.toFixed(3)})`;
        } else if (el.classList.contains('h-pin')) {
          el.style.transform = `translateY(${offset.toFixed(2)}px)`;
          el.style.opacity = (1 - heroProgress).toString();
        } else if (!el.classList.contains('hero-mouse-par')) {
          el.style.transform = `translateY(${offset.toFixed(2)}px)`;
        }
      });
      rafId = requestAnimationFrame(raf);
    };
    raf();

    return () => {
      cancelAnimationFrame(rafId);
      root.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // 3. Hero Mouse Parallax
  useEffect(() => {
    const hero = heroRef.current;
    const root = rootRef.current;
    if (!hero || !root) return;

    // Use root's scroll matching the parallax Y offset
    const handleMouseMove = (e) => {
      const { innerWidth: W, innerHeight: H } = window;
      const nx = (e.clientX / W - 0.5) * 2;
      const ny = (e.clientY / H - 0.5) * 2;
      
      const scrollY = root.scrollTop;
      const heroRange = H * 4;
      const heroProgress = Math.min(scrollY / heroRange, 1);
      
      // 1. Cinematic HP Layers
      const imageLayers = hero.querySelectorAll('.hp-layer');
      imageLayers.forEach(layer => {
        const speed = parseFloat(layer.dataset.speed || '0');
        let virtualBaseOffset = (heroProgress - 0.5) * H * speed * 2;
        
        let cinematicY = 0;
        let cinematicX = 0;
        let scale = 1;
        
        if (layer.classList.contains('layer-mountain')) {
          scale = 1.3 - (heroProgress * 0.25);
          virtualBaseOffset = 0;
        }
        if (layer.classList.contains('layer-bg')) {
          cinematicY = (1 - heroProgress) * 200;
        }
        if (layer.classList.contains('layer-cave-interior') || layer.classList.contains('layer-man')) {
          cinematicY = (1 - heroProgress) * 600;
        }
        if (layer.classList.contains('layer-cave-left')) {
          cinematicX = (1 - heroProgress) * -800;
          cinematicY = (1 - heroProgress) * -600;
          scale = 1.4 - (heroProgress * 0.4);
        }
        if (layer.classList.contains('layer-cave-right')) {
          cinematicX = (1 - heroProgress) * 800;
          cinematicY = (1 - heroProgress) * -600;
          scale = 1.4 - (heroProgress * 0.4);
        }
        
        const mx = nx * (speed * 18);
        const my = ny * (speed * 12);
        
        layer.style.transform = `translate(${(mx + cinematicX).toFixed(1)}px, ${(my + virtualBaseOffset + cinematicY).toFixed(1)}px) scale(${scale.toFixed(3)})`;
        layer.classList.add('hero-mouse-par');
      });

      // 2. Pinned elements (h-pin)
      const pinElements = hero.querySelectorAll('.h-pin');
      pinElements.forEach(el => {
        const speed = parseFloat(el.dataset.speed || '0');
        const virtualBaseOffset = (heroProgress - 0.5) * H * speed * 2;
        const mx = nx * (speed * 18);
        const my = ny * (speed * 12);
        
        el.style.transform = `translateY(${virtualBaseOffset.toFixed(1)}px) translate(${mx.toFixed(1)}px, ${my.toFixed(1)}px)`;
        el.style.opacity = (1 - heroProgress).toString();
        el.classList.add('hero-mouse-par');
      });

      // 3. Simple Parallax Elements (Orbs, Circles, Bigword)
      const parEls = hero.querySelectorAll('.p-el:not(.hp-layer):not(.h-pin)');
      parEls.forEach(el => {
        const speed = parseFloat(el.dataset.speed || '0');
        const rect = el.getBoundingClientRect();
        const center = (rect.top + rect.bottom) / 2;
        const scrollOffset = (center - H / 2) * speed;
        
        const mx = nx * (Math.abs(speed) * 30);
        const my = ny * (Math.abs(speed) * 20);

        if (el.classList.contains('hero-bigword')) {
          el.style.transform = `translate(calc(-50% + ${mx}px), calc(-48% + ${my + scrollOffset}px))`;
        } else {
          el.style.transform = `translateY(${scrollOffset.toFixed(1)}px) translate(${mx.toFixed(1)}px, ${my.toFixed(1)}px)`;
        }
        el.classList.add('hero-mouse-par');
      });
    };

    hero.addEventListener('mousemove', handleMouseMove);
    
    // Initialize immediately to prevent the global scroll observer from overwriting the initial centered offset
    handleMouseMove({ clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 });

    return () => hero.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 4. Input Intersection Observers (Counters & Reveals)
  useEffect(() => {
    if (!rootRef.current) return;

    const counterObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseInt(el.dataset.count);
        const suffix = target === 18 ? 'k' : '+';
        let v = 0;
        const step = target / 55;
        const t = setInterval(() => {
          v += step;
          if (v >= target) {
            v = target;
            clearInterval(t);
          }
          el.textContent = Math.floor(v) + suffix;
        }, 16);
        counterObs.unobserve(el);
      });
    }, { threshold: 0.5, root: rootRef.current });

    rootRef.current.querySelectorAll('[data-count]').forEach(el => counterObs.observe(el));

    const revObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        
        // Slightly modify the original query logic since `e.target` is the individual element.
        // In the original, it observed EACH element directly and revealed siblings. 
        // We can just reveal the current element. Then for stagger we can use CSS nth-child if needed,
        // or just apply an arbitrary delay.
        e.target.classList.add('vis');
        revObs.unobserve(e.target);
      });
    }, { threshold: 0.15, root: rootRef.current });

    // We add stagger classes with inline delay mapping to simplify intersection observer trigger
    const queryAndDelay = (selector, baseDelay = 60) => {
        const els = rootRef.current.querySelectorAll(selector);
        els.forEach((el, i) => {
            el.style.transitionDelay = `${i * baseDelay}ms`;
            revObs.observe(el);
        });
    };

    queryAndDelay('.sk', 60);
    queryAndDelay('.pd', 40);
    queryAndDelay('.proj-row', 60);
    queryAndDelay('.proc-card', 60);

    return () => {
      counterObs.disconnect();
      revObs.disconnect();
    };
  }, []);

  return (
    <div className="work-root" ref={rootRef}>
      <div id="cur-dot" className="cur-dot" ref={dotRef}></div>
      <div id="cur-ring" className="cur-ring" ref={ringRef}></div>

      <button className="premium-back-btn fixed-top-left" onClick={onBack}>
        <span className="btn-arrow">←</span> Return
      </button>

      {/* ══════════════════════ HERO ══════════════════════ */}
      <WorkNewHero />
      <WorkMarquee />
      <WorkNumbers />
      <WorkAbout />
      <WorkSkills />
      <WorkProcess />

    </div>
  );
};

export default Work;
