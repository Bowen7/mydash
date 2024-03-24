import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { SWRConfig } from 'swr';
import { ThemeProvider } from '@/components/theme-provider';
import { THEME_STORAGE_KEY, BASE_URL } from './config';
import { router } from './router';
import './index.css';

const fetcher = (resource: RequestInfo, init: RequestInit) =>
  fetch(typeof resource === 'string' ? BASE_URL + resource : resource, init).then((res) => res.json());

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="light" storageKey={THEME_STORAGE_KEY}>
      <SWRConfig value={{ fetcher, revalidateOnFocus: false }}>
        <BrowserRouter>{router}</BrowserRouter>
      </SWRConfig>
    </ThemeProvider>
  </React.StrictMode>
);
