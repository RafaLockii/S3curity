import type { AppProps } from 'next/app'

import '../styles/globals.css'
//import { Carousel } from '@/components/Carousel';

export default function App({ Component, pageProps }: AppProps) {
  return(
    <>
      <Component {...pageProps} />
    </>
    )}
