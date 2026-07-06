import { useEffect, useRef } from "react";

import mountainImg     from '../../../assets/mainMountain.webp';
import caveInteriorImg from '../../../assets/caveInterior.webp';
import manImg          from '../../../assets/manStanding.webp';
import caveLeftImg     from '../../../assets/caveTopLeftSide.webp';
import caveRightImg    from '../../../assets/caveTopRightSide.webp';
import caveTopImg      from '../../../assets/caveTop.webp';

const WorkNewHero = () => {
  const sectionRef   = useRef<HTMLDivElement>(null);
  const mountainRef  = useRef<HTMLImageElement>(null);
  const interiorRef  = useRef<HTMLImageElement>(null);
  const manRef       = useRef<HTMLImageElement>(null);
  const caveLeftRef  = useRef<HTMLImageElement>(null);
  const caveRightRef = useRef<HTMLImageElement>(null);
  const caveTopRef   = useRef<HTMLImageElement>(null);
  const overlayRef   = useRef<HTMLDivElement>(null);
  const labelRef     = useRef<HTMLDivElement>(null);
  const quoteRef     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // The scroll range = the sticky section's scroll distance
    // (set via CSS: scroll-height = SCROLL_MULTIPLIER * 100vh)
    const SCROLL_MULTIPLIER = 2; // shorter scroll distance = snappier payoff

    let rafId: number;
    let smoothProgress = 0;
    let targetProgress = 0;

    const onScroll = () => {
      const root = section.closest('.work-root') as HTMLElement;
      if (!root) return;
      const scrollTop  = root.scrollTop;
      const scrollRange = window.innerHeight * SCROLL_MULTIPLIER;
      targetProgress = Math.min(Math.max(scrollTop / scrollRange, 0), 1);
    };

    // Quick deceleration — fast start, settles fast. Reads as "snappy" not "soft".
    const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
    // Slight overshoot then settle — gives the cave sides a "slam into place" punch.
    const easeOutBack = (t: number) => {
      const c1 = 1.4, c3 = c1 + 1;
      return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    };
    const easeInOut = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    const tick = () => {
      // Smooth damp toward target — higher factor = tighter, more immediate scroll-tracking
      smoothProgress += (targetProgress - smoothProgress) * 0.22;
      const p = smoothProgress;

      // ── Layer: mountain – the hero layer ──────────────────────────
      // Fast whip-zoom out from 1.8 → 1.0, fully resolved by ~45% scroll
      if (mountainRef.current) {
        const mp = Math.min(p / 0.45, 1);
        const eased = easeOutExpo(mp);
        const scale = 1.8 - eased * 0.8;          // 1.8 → 1.0
        const ty    = (1 - eased) * 60;            // slide up slightly
        mountainRef.current.style.transform = `translateY(${ty.toFixed(2)}px) scale(${scale.toFixed(4)})`;
        mountainRef.current.style.opacity = `${Math.min(1, p * 4 + 0.1)}`;
      }

      // ── Layer: cave interior floor (rocky bottom) ─────────────────
      // Rises into view from below — quick
      if (interiorRef.current) {
        const startAt = 0.05;
        const endAt   = 0.30;
        const lp = Math.min(Math.max((p - startAt) / (endAt - startAt), 0), 1);
        const eased = easeOutExpo(lp);
        const ty = (1 - eased) * 120;
        interiorRef.current.style.transform = `translateY(${ty.toFixed(2)}px)`;
        interiorRef.current.style.opacity   = `${eased}`;
      }

      // ── Layer: cave top arch ──────────────────────────────────────
      // Drops down fast to frame the scene
      if (caveTopRef.current) {
        const startAt = 0.05;
        const endAt   = 0.32;
        const lp = Math.min(Math.max((p - startAt) / (endAt - startAt), 0), 1);
        const eased = easeOutExpo(lp);
        const ty = (1 - eased) * -200;
        caveTopRef.current.style.transform = `translateY(${ty.toFixed(2)}px)`;
        caveTopRef.current.style.opacity   = `${eased}`;
      }

      // ── Layer: cave-left side ─────────────────────────────────────
      // Slams in from far left corner with a slight overshoot
      if (caveLeftRef.current) {
        const startAt = 0.25;
        const endAt   = 0.55;
        const lp = Math.min(Math.max((p - startAt) / (endAt - startAt), 0), 1);
        const eased = easeOutBack(lp);
        const tx = (1 - eased) * -160;
        const ty = (1 - eased) * -100;
        caveLeftRef.current.style.transform = `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px)`;
        caveLeftRef.current.style.opacity   = `${Math.min(1, easeOutExpo(lp) * 1.05)}`;
      }

      // ── Layer: cave-right side ────────────────────────────────────
      // Slams in from far right corner with a slight overshoot
      if (caveRightRef.current) {
        const startAt = 0.25;
        const endAt   = 0.55;
        const lp = Math.min(Math.max((p - startAt) / (endAt - startAt), 0), 1);
        const eased = easeOutBack(lp);
        const tx = (1 - eased) * 160;
        const ty = (1 - eased) * -100;
        caveRightRef.current.style.transform = `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px)`;
        caveRightRef.current.style.opacity   = `${Math.min(1, easeOutExpo(lp) * 1.05)}`;
      }

      // ── Layer: man silhouette ─────────────────────────────────────
      // Fades + rises into position from below — quick
      if (manRef.current) {
        const startAt = 0.18;
        const endAt   = 0.42;
        const lp = Math.min(Math.max((p - startAt) / (endAt - startAt), 0), 1);
        const eased = easeOutExpo(lp);
        const ty = (1 - eased) * 50;
        manRef.current.style.transform = `translateY(${ty.toFixed(2)}px)`;
        manRef.current.style.opacity   = `${eased}`;
      }

      // ── Cinematic quote ────────────────────────────────────────────
      // Appears once the cave frame has closed in, holds briefly,
      // then dissolves together with the dark overlay at the very end.
      if (quoteRef.current) {
        const inStart = 0.50, inEnd = 0.66;
        const outStart = 0.80, outEnd = 1.0;
        let op = 0;
        if (p < inStart) {
          op = 0;
        } else if (p < inEnd) {
          op = easeOutExpo((p - inStart) / (inEnd - inStart));
        } else if (p < outStart) {
          op = 1;
        } else {
          op = 1 - easeInOut(Math.min((p - outStart) / (outEnd - outStart), 1));
        }
        const inProg = Math.min(Math.max((p - inStart) / (inEnd - inStart), 0), 1);
        const ty = (1 - easeOutExpo(inProg)) * 18;
        quoteRef.current.style.opacity = `${op}`;
        quoteRef.current.style.transform = `translateY(${ty.toFixed(2)}px)`;
      }

      // ── Dark overlay near the end ─────────────────────────────────
      // Fades the entire scene to dark before handing off to work content
      if (overlayRef.current) {
        const startAt = 0.7;
        const lp = Math.min(Math.max((p - startAt) / (1 - startAt), 0), 1);
        overlayRef.current.style.opacity = `${easeInOut(lp) * 0.92}`;
      }

      // ── Scroll label ─────────────────────────────────────────────
      // Vanishes fast — it's only relevant for the first instant of scroll
      if (labelRef.current) {
        labelRef.current.style.opacity = `${Math.max(0, 1 - p * 10)}`;
        labelRef.current.style.transform = `translateY(${p * -40}px)`;
      }

      rafId = requestAnimationFrame(tick);
    };

    const root = section.closest('.work-root') as HTMLElement;
    if (root) root.addEventListener('scroll', onScroll, { passive: true });
    tick();

    return () => {
      cancelAnimationFrame(rafId);
      if (root) root.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    /* Outer wrapper is tall to give scrollable distance */
    <div className="cinematic-hero-wrapper" ref={sectionRef}>
      {/* The sticky canvas that stays fixed while user scrolls through */}
      <div className="cinematic-canvas">
{/* Scroll indicator */}
<div className="scroll-indicator">
  <span className="scroll-indicator-line"></span>
  <span className="scroll-indicator-text">Scroll</span>
</div>
        {/* z-1: Majestic snowy mountain */}
        <img
          ref={mountainRef}
          className="cin-layer cin-mountain"
          src={mountainImg}
          alt="Mountain"
          draggable={false}
        />

        {/* z-2: Cave interior / rocky floor from below */}
        <img
          ref={interiorRef}
          className="cin-layer cin-interior"
          src={caveInteriorImg}
          alt=""
          draggable={false}
        />

        {/* z-3: Man silhouette standing, gazing at mountain */}
        <img
          ref={manRef}
          className="cin-layer cin-man"
          src={manImg}
          alt="Silhouette"
          draggable={false}
        />

        {/* z-4: Cave top arch – comes down to frame the view */}
        <img
          ref={caveTopRef}
          className="cin-layer cin-cave-top"
          src={caveTopImg}
          alt=""
          draggable={false}
        />

        {/* z-5: Cave left rock – slides from top-left corner */}
        <img
          ref={caveLeftRef}
          className="cin-layer cin-cave-left"
          src={caveLeftImg}
          alt=""
          draggable={false}
        />

        {/* z-6: Cave right rock – slides from top-right corner */}
        <img
          ref={caveRightRef}
          className="cin-layer cin-cave-right"
          src={caveRightImg}
          alt=""
          draggable={false}
        />

        {/* Cinematic quote — minimal, appears mid-scene then dissolves into the dark ending */}
        <div ref={quoteRef} className="cin-quote">
  <p className="cin-quote-line">The deeper you go,</p>
  <p className="cin-quote-line cin-quote-em">the higher you climb.</p>
</div>

        {/* Dark fade-out overlay */}
        <div ref={overlayRef} className="cin-overlay" />

        {/* Scroll prompt */}
        {/* <div ref={labelRef} className="cin-scroll-hint">
          <div className="cin-scroll-line" />
          <span>scroll</span>
        </div> */}

      </div>
    </div>
  );
};

export default WorkNewHero;