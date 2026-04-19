import { useState } from 'react'
import Hero from './components/sections/Hero'
import Signaturecomp from './components/sections/signaturecomp'
import About from './components/sections/About'
import Work from './components/sections/work/Work'
import Projects from './components/sections/Projects'
import Contact from './components/sections/Contact'

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

      {page === 'about' && <About onBack={() => setPage('home')} />}
      {page === 'work' && <Work onBack={() => setPage('home')} />}
      {page === 'projects' && <Projects onBack={() => setPage('home')} />}
      {page === 'contact' && <Contact onBack={() => setPage('home')} />}
    </div>
  );
}

export default App
