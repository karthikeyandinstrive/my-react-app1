import { useEffect, useState } from 'react';
import { PresentationProvider, usePresentation } from './context/PresentationContext';
import { HistoryProvider } from './context/HistoryContext';
import HistoryIntegration from './components/HistoryIntegration';
import AppLayout from './components/Layout/AppLayout';
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
            bottom: 120,
            right: 20,
            zIndex: 9999,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '10px 16px',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
          }}
        >
          AI Content
        </button>
      )}
      {showDemo
        ? <AiContentDemo onClose={() => setShowDemo(false)} />
        : <AppLayout />
      }
    </>
  );
}

function App() {
  return (
    <HistoryProvider>
      <PresentationProvider>
        <HistoryIntegration />
        <AppContent />
      </PresentationProvider>
    </HistoryProvider>
  );
}

export default App;
