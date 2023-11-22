import type { AppProps } from 'next/app';
import { UserProvider } from '@/context/UserContext';

import '../styles/globals.css';
import '../styles/Slider.css';
import { ImageProvider } from '@/context/imagesContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <ImageProvider>
        <Component {...pageProps} />
      </ImageProvider>
    </UserProvider>
  );
}

export default MyApp;
