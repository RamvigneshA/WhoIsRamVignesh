import { useEffect, useRef } from 'react';

interface LayerConfig {
  selector: string;
  startAt: number;   // 0–1: when in scroll progress this layer begins animating
  dur: number;       // 0–1: how much of scroll progress the animation spans
  speed?: number;    // parallax drift speed (for bg/mountain)
  fromY?: number;    // initial Y offset in px (slides in from bottom)
  fromX?: number;    // initial X offset in % (slides in from sides)
  fade?: boolean;    // whether to fade in
}

const LAYERS: LayerConfig[] = [
  { selector: '.layer-bg',            startAt: 0,    dur: 1,    speed: 0.08 },
  { selector: '.layer-mountain',      startAt: 0,    dur: 1,    speed: 0.22 },
  { selector: '.layer-cave-interior', startAt: 0.15, dur: 0.35, fromY: 120 },
  { selector: '.layer-man',           startAt: 0.35, dur: 0.28, fromY: 50, fade: true },
  { selector: '.layer-cave-left',     startAt: 0.52, dur: 0.32, fromX: -100 },
  { selector: '.layer-cave-right',    startAt: 0.52, dur: 0.32, fromX: 100 },
];

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function clamp(val: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, val));
}

export function useParallax(sectionRef: React.RefObject<HTMLElement>) {
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const tick = () => {
      const section = sectionRef.current;
      if (!section) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const { top, height } = section.getBoundingClientRect();
      // 0 = section just entered viewport top, 1 = section fully scrolled past
      const progress = clamp(-top / (height - window.innerHeight));

      for (const cfg of LAYERS) {
        const el = section.querySelector(cfg.selector) as HTMLElement | null;
        if (!el) continue;

        // Local progress for this layer's animation window
        const raw = (progress - cfg.startAt) / cfg.dur;
        const local = easeInOut(clamp(raw));

        let tx = 0;
        let ty = 0;
        let opacity = 1;

        // Parallax drift (bg, mountain)
        if (cfg.speed !== undefined) {
          ty = -progress * cfg.speed * window.innerHeight * 0.5;
        }

        // Slide in from bottom
        if (cfg.fromY !== undefined) {
          ty = cfg.fromY * (1 - local);
        }

        // Slide in from sides (% based)
        if (cfg.fromX !== undefined) {
          tx = cfg.fromX * (1 - local);
        }

        // Fade in
        if (cfg.fade) {
          opacity = local;
        }

        el.style.transform = `translate(${tx}${cfg.fromX !== undefined ? '%' : 'px'}, ${ty}px)`;
        el.style.opacity = String(opacity);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [sectionRef]);
}