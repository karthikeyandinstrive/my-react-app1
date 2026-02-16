import { useEffect } from 'react';
import { usePresentation } from '../context/PresentationContext';
import { useHistory } from '../context/HistoryContext';

/**
 * This component connects the HistoryContext with PresentationContext.
 * It sets up the history recorder so that presentation actions are recorded.
 */
function HistoryIntegration() {
  const { setHistoryRecorder } = usePresentation();
  const { recordHistory } = useHistory();

  useEffect(() => {
    // Connect the history recorder to the presentation context
    setHistoryRecorder(recordHistory);

    // Cleanup on unmount
    return () => {
      setHistoryRecorder(null);
    };
  }, [setHistoryRecorder, recordHistory]);

  return null; // This component doesn't render anything
}

export default HistoryIntegration;
