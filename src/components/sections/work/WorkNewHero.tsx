import { useEffect, useRef } from "react";

import cloudImg from '../../../assets/cloudBehindTheMountain.webp';
import mountainImg from '../../../assets/mainMountain.webp';
import caveInteriorImg from '../../../assets/caveInterior.webp';
import manImg from '../../../assets/manStanding.webp';
import caveTopImg from '../../../assets/caveTop.webp';

const WorkNewHero = () => {
  const mountainRef = useRef(null);

  useEffect(() => {
    let target = 0;
    let current = 0;

    const handleScroll = () => {
      target = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);

    const animate = () => {
      // cinematic smoothing
      current += (target - current) * 0.08;

      const progress = Math.min(current / window.innerHeight, 1);

      if (mountainRef.current) {
        const scale = 1 + progress * 1.3;

        mountainRef.current.style.transform = `
          scale(${scale})
          translateY(${progress * -100}px)
        `;
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section className="work-new-hero">
      <div className="layers">
        <img className="layer-bg" src={cloudImg} alt="" />
        <img
          ref={mountainRef}
          className="layer-mountain"
          src={mountainImg}
          alt=""
        />
        <img className="layer-cave-interior" src={caveInteriorImg} alt="" />
        <img className="layer-cave-top" src={caveTopImg} alt="" />
        <img className="layer-man" src={manImg} alt="" />
      </div>
    </section>
  );
};

export default WorkNewHero;