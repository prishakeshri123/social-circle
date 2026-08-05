import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '@/app/App';
import '@/styles/globals.css';
import '@/styles/animations.css';

async function bootstrap() {
  if (import.meta.env.VITE_USE_MOCK !== 'false') {
    await import('@/services/mockAdapter');
  }

  const rootElement = document.getElementById('root');
  if (!rootElement) throw new Error('Root element not found');

  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

void bootstrap();
