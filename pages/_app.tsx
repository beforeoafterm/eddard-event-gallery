import type { AppProps } from "next/app";
import "../styles/index.css";
import { Bangers, Dekko } from 'next/font/google'

const bangers = Bangers({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-bangers',
})

const dekko = Dekko({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-dekko',
})


export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
