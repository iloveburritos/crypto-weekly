// components/Meta.js

import Head from 'next/head';

const Meta = ({ title, description }) => {
  return (
    <Head>
      <link rel="preload" href="/fonts/GT-America-Mono-Medium.woff2" as="font" crossOrigin="" />
      <link rel="preload" href="/fonts/GT-America-Mono-Light.woff2" as="font" crossOrigin="" />
      <link rel="preload" href="/fonts/GT-America-Mono-Regular.woff2" as="font" crossOrigin="" />
      <title>{title}</title>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
      <meta name="description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://thisweekincrypto.substack.com/" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};

Meta.defaultProps = {
  title: 'Crypto Weekly by Maaria B.',
  description: 'A weekly summary of crypto news',
};

export default Meta;