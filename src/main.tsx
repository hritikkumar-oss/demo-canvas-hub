import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeNavigationTracking } from './lib/navigationStack'

// Initialize navigation tracking
initializeNavigationTracking();

createRoot(document.getElementById("root")!).render(<App />);
