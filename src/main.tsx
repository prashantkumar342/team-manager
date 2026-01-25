import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from './components/ui/sonner.tsx';
import { ThemeProvider } from './themes/ThemeProvider.tsx';
import { SidebarProvider } from './components/ui/sidebar.tsx';
import { ConfirmProvider } from './provider/ConfirmProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider defaultTheme="light">
        <ConfirmProvider>
          <SidebarProvider>
            <App />
            <Toaster position="top-center" />
          </SidebarProvider>
        </ConfirmProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
