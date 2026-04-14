import { useState } from 'react'
import Hero from './components/sections/Hero'
import Signaturecomp from './components/sections/signaturecomp'



function App() {
  const [page, setPage] = useState('home');

  return (
    <div className="app-container">
      {page === 'home' && (
        <>
          <Hero onNavigate={setPage} />
          <Signaturecomp />
        </>
      )}

      {page === 'about' && (
        <section className="section-placeholder about">
          <div className="content">
            <h1>About Me</h1>
            <p>I build experiences that move.</p>
            <button className="back-btn" onClick={() => setPage('home')}>Return to Hero</button>
          </div>
        </section>
      )}

      {page === 'work' && (
        <section className="section-placeholder work">
          <div className="content">
            <h1>Expertise</h1>
            <p>What I actually do, every day.</p>
            <button className="back-btn" onClick={() => setPage('home')}>Return to Hero</button>
          </div>
        </section>
      )}

      {page === 'projects' && (
        <section className="section-placeholder projects">
          <div className="content">
            <h1>Showcase</h1>
            <p>Real products built with care.</p>
            <button className="back-btn" onClick={() => setPage('home')}>Return to Hero</button>
          </div>
        </section>
      )}

      {page === 'contact' && (
        <section className="section-placeholder contact">
          <div className="content">
            <h1>Let's Talk</h1>
            <p>Ready to build something amazing?</p>
            <button className="back-btn" onClick={() => setPage('home')}>Return to Hero</button>
          </div>
        </section>
      )}

      <style>{`
        .section-placeholder {
          height: 100vh;
          width: 100vw;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #000;
          color: #fff;
          font-family: 'Geist', sans-serif;
          overflow: hidden;
        }
        .content {
          text-align: center;
          animation: fadeInUp 0.8s ease-out;
        }
        h1 {
          font-size: clamp(3rem, 8vw, 6rem);
          margin-bottom: 0.5rem;
          background: linear-gradient(180deg, #fff 0%, #aaa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        p {
          font-size: 1.2rem;
          color: #888;
          margin-bottom: 2rem;
        }
        .back-btn {
          background: transparent;
          border: 1px solid #333;
          color: #fff;
          padding: 12px 24px;
          border-radius: 99px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .back-btn:hover {
          background: #fff;
          color: #000;
          border-color: #fff;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default App
