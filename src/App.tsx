import { useEffect, useState } from 'react';
import { PresentationProvider, usePresentation } from './context/PresentationContext';
import SlideBuilder from './components/SlideBuilder/SlideBuilder';
import AiContentDemo from './components/AiContent/AiContentDemo';
import './App.css';

function AppContent() {
  const { state, actions } = usePresentation();
  const [showDemo, setShowDemo] = useState(false);

  useEffect(() => {
    if (!state.presentation) {
      actions.createNewPresentation('My Presentation');
    }
  }, []);

  return (
    <>
      {!showDemo && (
        <button
          onClick={() => setShowDemo(true)}
          style={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            zIndex: 9999,
            background: '#4A90E2',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            padding: '8px 16px',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          }}
        >
          AI Response
        </button>
      )}
      {showDemo
        ? <AiContentDemo onClose={() => setShowDemo(false)} />
        : <SlideBuilder />
      }
    </>
  );
}

function App() {
  return (
    <PresentationProvider>
      <AppContent />
    </PresentationProvider>
  );
}

export default App;
