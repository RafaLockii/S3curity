import type { AppProps } from 'next/app'

import '../styles/globals.css'
import { Header } from '@/components/Header';
import SignIn from './login';
//import { Carousel } from '@/components/Carousel';

export default function App({ Component, pageProps }: AppProps) {
  return(
    <>
      <Component {...pageProps} />
    </>
    )}
