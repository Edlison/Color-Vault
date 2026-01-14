import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

console.log('Color-Vault: main.tsx loaded');

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Color-Vault: Could not find root element!');
} else {
  console.log('Color-Vault: Rendering app...');
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
  console.log('Color-Vault: App rendered');
}
