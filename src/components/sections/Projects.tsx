import React from 'react';
import SoftAurora from '../SoftAurora';
import './Projects.css';

const Projects = ({ onBack }) => {
  const projects = [
    { title: "Neo Nexus", category: "Web Ecosystem", year: "2024", accent: "#c084fc" },
    { title: "Fluid UI", category: "Design System", year: "2023", accent: "#60a5fa" },
    { title: "Aether OS", category: "Internal Tooling", year: "2023", accent: "#fbbf24" },
    { title: "Flux Media", category: "Entertainment", year: "2022", accent: "#f87171" }
  ];

  return (
    <section className="premium-section projects-section">
      <div className="section-bg">
        <SoftAurora 
          speed={0.15} scale={1.3} brightness={0.3}
          color1="#111" color2="#000"
          enableMouseInteraction={false}
        />
      </div>

      <div className="section-container">
        <header className="section-header">
          <span className="section-tagline">SELECTED WORK</span>
          <h1 className="section-title">Case Studies</h1>
        </header>

        <div className="projects-grid">
          {projects.map((project, index) => (
            <div key={index} className="project-card glass">
              <div className="project-preview">
                <div className="preview-mesh" style={{ background: `radial-gradient(circle at 50% 50%, ${project.accent}11 0%, transparent 80%)` }}></div>
                <div className="view-badge">View Project</div>
              </div>
              <div className="project-info">
                <h3>{project.title}</h3>
                <div className="project-meta">
                  <span className="cat">{project.category}</span>
                  <span className="year">{project.year}</span>
                </div>
              </div>
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

export default Projects;
