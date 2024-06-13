// pages/_app.js

import '../styles/globals.css'; 
import { Analytics } from "@vercel/analytics/react"

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Analytics />
      <Component {...pageProps} />
    </>
  );
}
