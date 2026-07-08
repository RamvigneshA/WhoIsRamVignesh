import React from 'react';
import SoftAurora from '../SoftAurora';
import carImage from '../../assets/carpart.png'
import codeEditor from '../../assets/ai-code-orchestrator.png'
import onboardpng from '../../assets/onboard.png'

const Projects = ({ onBack }) => {
  const projects = [
    { 
      title: "Interactive Car Part Selector", 
      category: "React Component Library", 
      year: "2026", 
      accent: "#34d399",
      description: "An interactive React component library for selecting and capturing car parts from an SVG diagram. Includes full i18n support.",
      link: "https://car-part-seletor-website.vercel.app/",
      image: carImage// Replace with the actual image path
    },
    { 
      title: "Onboard-Map CLI", 
      category: "CLI Tool", 
      year: "2026", 
      accent: "#f97316",
      description: "A CLI tool that generates topological reading pathways and identifies risk hotspots for staff architects in repositories.",
      link: "https://onboard-map-website.vercel.app/", // Replace with the actual link
      image: onboardpng // Replace with the actual image path
    },
    {
      title: "CodeOrchestrator",
      category: "AI-Powered Editor",
      year: "2026",
      accent: "#ff6b6b",
      description: "CodeOrchestrator is an AI-powered editor, It generates structured actions executed through a controlled tool layer.",
      link: "https://github.com/RamvigneshA/ai-code-orchestrator", // Replace with the actual link
      image:codeEditor // Replace with the actual image path
    },
  ];

  return (
    <section 
      className="premium-section projects-section" 
      style={{ position: "relative", padding: "40px 20px", backgroundColor: "#111" }}
    >
      <div className="section-bg">
        <SoftAurora 
          speed={0.15} 
          scale={1.3} 
          brightness={0.3}
          color1="#111" 
          color2="#000"
          enableMouseInteraction={false}
        />
      </div>

      <div 
        className="section-container" 
        style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 2 }}
      >
        <header 
          className="section-header" 
          style={{ textAlign: "center", marginBottom: "40px", color: "#fff" }}
        >
          <span 
            className="section-tagline" 
            style={{ display: "block", fontSize: "14px", fontWeight: "bold", color: "#888" }}
          >
            SELECTED WORK
          </span>
          <h1 
            className="section-title" 
            style={{ fontSize: "36px", fontWeight: "bold", color: "#fff" }}
          >
            Case Studies
          </h1>
        </header>

        <div 
          className="projects-grid" 
          style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
            gap: "20px" 
          }}
        >
          {projects.map((project, index) => (
            <div 
              key={index} 
              className="project-card glass" 
              style={{ 
                position: "relative", 
                borderRadius: "12px", 
                overflow: "hidden", 
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", 
                backgroundColor: "#222", 
                display: "flex", 
                flexDirection: "column", 
                minHeight: "400px" // Set a minimum height for all cards
              }}
            >
              <div 
                className="project-preview" 
                style={{ 
                  position: "relative", 
                  overflow: "hidden", 
                  flex: "1 0 auto" // Ensure the image section takes up available space
                }}
              >
                <div 
                  className="preview-mesh" 
                  style={{ 
                    position: "absolute", 
                    top: 0, 
                    left: 0, 
                    width: "100%", 
                    height: "100%", 
                    background: `radial-gradient(circle at 50% 50%, ${project.accent}11 0%, transparent 80%)`, 
                    zIndex: 1 
                  }}
                ></div>
                {project.image && (
                  <img 
                    src={project.image} 
                    alt={`${project.title} preview`} 
                    className="project-image" 
                    style={{ 
                      width: "100%", 
                      height: "100%", 
                      objectFit: "cover", // Ensure the image covers the area
                      zIndex: 0 
                    }}
                  />
                )}
                <div 
                  className="view-badge" 
                  style={{ 
                    position: "absolute", 
                    bottom: "16px", 
                    right: "16px", 
                    backgroundColor: "rgba(0, 0, 0, 0.7)", 
                    color: "#fff", 
                    padding: "8px 16px", 
                    borderRadius: "4px", 
                    fontSize: "14px", 
                    fontWeight: "bold", 
                    textTransform: "uppercase", 
                    textAlign: "center", 
                    zIndex: 2 
                  }}
                >
                  <a 
                    href={project.link || "#"} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ color: "#fff", textDecoration: "none" }}
                  >
                    View Project
                  </a>
                </div>
              </div>
              <div 
                className="project-info" 
                style={{ 
                  padding: "16px", 
                  backgroundColor: "#333", 
                  color: "#fff", 
                  flexShrink: 0 // Ensure the content area doesn't shrink
                }}
              >
                <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "8px" }}>
                  {project.title}
                </h3>
                <div 
                  className="project-meta" 
                  style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    fontSize: "14px", 
                    color: "#aaa" 
                  }}
                >
                  <span className="cat">{project.category}</span>
                  <span className="year">{project.year}</span>
                </div>
                {project.description && (
                  <p 
                    className="project-description" 
                    style={{ 
                      marginTop: "12px", 
                      fontSize: "14px", 
                      lineHeight: "1.6", 
                      color: "#ccc" 
                    }}
                  >
                    {project.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <button 
          className="premium-back-btn" 
          onClick={onBack} 
          style={{ 
            marginTop: "40px", 
            padding: "12px 24px", 
            backgroundColor: "#444", 
            color: "#fff", 
            border: "none", 
            borderRadius: "4px", 
            cursor: "pointer", 
            fontSize: "16px" 
          }}
        >
          <span className="btn-arrow" style={{ marginRight: "8px" }}>←</span> Return to Hero
        </button>
      </div>
    </section>
  );
};

export default Projects;