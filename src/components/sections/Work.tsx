import React from 'react';
import SoftAurora from '../SoftAurora';
import './Work.css';

const Work = ({ onBack }) => {
  const skills = [
    { title: "React Architecture", desc: "Building scalable, high-performance web applications with modern state management and clean component logic." },
    { title: "GSAP & Motion", desc: "Crafting fluid, natural interactions and animations that bring digital interfaces to life with kinetic energy." },
    { title: "Visual Identity", desc: "Creating minimalist, premium aesthetics focused on clarity, impact, and high-end brand feel." },
    { title: "Lead Systems", desc: "Architecting backend solutions and system logic that handle massive complexity with elegant performance." }
  ];

  return (
    <section className="premium-section work-section">
      <div className="section-bg">
        <SoftAurora 
          speed={0.2} scale={1.2} brightness={0.35}
          color1="#0d1117" color2="#000000"
          enableMouseInteraction={false}
        />
      </div>

      <div className="section-container">
        <header className="section-header">
          <span className="section-tagline">STRENGTHS & SKILLS</span>
          <h1 className="section-title">Core Expertise</h1>
        </header>

        <div className="skills-grid">
          {skills.map((skill, index) => (
            <div key={index} className="skill-card glass">
              <div className="card-bloom"></div>
              <div className="skill-icon">
                <span className="icon-num">0{index + 1}</span>
              </div>
              <h3>{skill.title}</h3>
              <p>{skill.desc}</p>
            </div>
          ))}
        </div>

        <button className="premium-back-btn" onClick={onBack}>
          <span className="btn-arrow">←</span> Return to Hero
        </button>
      </div>

    </section>
  );
};

export default Work;
