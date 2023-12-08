'use client'

import type { AppProps } from 'next/app';
// import { UserProvider } from '@/context/UserContext';

import '../styles/globals.css';
import '../styles/Slider.css';
import { ImageProvider } from '@/context/imagesContext';
import { ModuloProvider } from '@/context/moduloContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    // <UserProvider>
      <ImageProvider>
        <ModuloProvider>
          <Component {...pageProps} />
        </ModuloProvider>
      </ImageProvider>
    // </UserProvider>
  );
}

export default MyApp;
