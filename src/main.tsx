import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnarToaster } from '@/components/ui/sonner';
import App from './App.tsx';
import './index.css';
import { queryClient } from './lib/query-client.ts';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster />
        <SonnarToaster position="bottom-left" />
      </QueryClientProvider>
    </HelmetProvider>
  </StrictMode>,
);
