import React, { useEffect, useRef } from 'react';
import './Work.css';
import WorkHero from './WorkHero';
import WorkMarquee from './WorkMarquee';
import WorkNumbers from './WorkNumbers';
import WorkAbout from './WorkAbout';
import WorkSkills from './WorkSkills';
import WorkProcess from './WorkProcess';

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
      parItems.forEach(({ el, speed }) => {
        const rect = el.getBoundingClientRect();
        // Calculation mapping scroll in container viewport.
        // Bounding rect handles natural document flow relation to screen.
        const center = (rect.top + rect.bottom) / 2;
        const offset = (center - window.innerHeight / 2) * speed;
        // Check if there is an existing transform format like translate()
        // Wait, for hero elements, we override transform string manually later.
        if (!el.classList.contains('hero-mouse-par')) {
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
      
      const heroOrb = hero.querySelector('.hero-orb');
      const heroCircle = hero.querySelector('.hero-circle3');
      const heroWord = hero.querySelector('.hero-bigword');

      if (heroOrb) {
        const baseOffset = heroOrb.dataset.speed * (scrollY + hero.getBoundingClientRect().height / 2 - H / 2);
        heroOrb.style.transform = `translateY(${baseOffset.toFixed(1)}px) translate(${nx * -22}px, ${ny * -16}px)`;
        heroOrb.classList.add('hero-mouse-par');
      }
      
      if (heroCircle) {
        heroCircle.style.transform = `translateY(0) translate(${nx * 30}px, ${ny * 24}px)`;
        heroCircle.classList.add('hero-mouse-par');
      }
      
      if (heroWord) {
        heroWord.style.transform = `translate(calc(-50% + ${nx * 14}px), calc(-48% + ${ny * 10}px))`;
        heroWord.classList.add('hero-mouse-par');
      }
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
      <WorkHero ref={heroRef} />
      <WorkMarquee />
      <WorkNumbers />
      <WorkAbout />
      <WorkSkills />
      <WorkProcess />

    </div>
  );
};

export default Work;
