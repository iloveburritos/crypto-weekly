// pages/about.jsx

import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Crypto Weekly',
  url: 'https://thisweekincrypto.substack.com',
  description:
    'A free weekly cryptocurrency and blockchain newsletter curating the biggest news since 2017. Written by Maaria Bajwa.',
  author: {
    '@type': 'Person',
    name: 'Maaria Bajwa',
    url: 'https://maaria.com',
    sameAs: [
      'https://twitter.com/maariabajwa',
      'https://www.linkedin.com/in/maariab',
    ],
    jobTitle: 'Angel Investor',
  },
  publisher: {
    '@type': 'Person',
    name: 'Maaria Bajwa',
  },
};

const About = () => {
  return (
    <>
      <Head>
        <title>About Crypto Weekly — Free Weekly Crypto &amp; Blockchain Newsletter</title>
        <meta
          name="description"
          content="Crypto Weekly is a free weekly newsletter delivering the most important cryptocurrency and blockchain news since 2017. No ads, no sponsors — just curated crypto news for 5,000+ readers."
        />
        <link rel="canonical" href="https://thisweekincrypto.substack.com/about" />
        <meta property="og:title" content="About Crypto Weekly — Free Weekly Crypto & Blockchain Newsletter" />
        <meta
          property="og:description"
          content="Crypto Weekly is a free weekly newsletter delivering the most important cryptocurrency and blockchain news since 2017. No ads, no sponsors — just curated crypto news for 5,000+ readers."
        />
        <meta property="og:url" content="https://thisweekincrypto.substack.com/about" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:creator" content="@maariabajwa" />
        <meta name="twitter:title" content="About Crypto Weekly — Free Weekly Crypto & Blockchain Newsletter" />
        <meta
          name="twitter:description"
          content="Free weekly crypto newsletter curating the biggest blockchain and cryptocurrency news since 2017."
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <Layout>
        <article className="max-w-[680px] mx-auto p-3">
          <div className="my-4">
            {/* Social links */}
            <div className="flex gap-4 justify-left sm:w-auto mb-5">
              <div className="flex p-1.5 gap-3">
                <Link href="https://twitter.com/maariabajwa">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" height="20" width="20">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-2.719 0-4.92 2.201-4.92 4.917 0 .386.044.763.128 1.124-4.09-.205-7.719-2.165-10.141-5.144-.424.729-.666 1.574-.666 2.476 0 1.709.869 3.213 2.188 4.096-.806-.026-1.566-.247-2.228-.616v.062c0 2.386 1.698 4.374 3.946 4.828-.413.111-.849.171-1.296.171-.314 0-.621-.029-.918-.085.621 1.934 2.422 3.342 4.558 3.382-1.67 1.309-3.778 2.088-6.066 2.088-.394 0-.779-.023-1.158-.067 2.162 1.389 4.729 2.2 7.488 2.2 8.984 0 13.894-7.438 13.894-13.894 0-.211-.004-.422-.013-.632.953-.688 1.78-1.548 2.437-2.526z" />
                  </svg>
                </Link>
                <Link href="https://www.linkedin.com/in/maariab">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" height="20" width="20">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.784 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Main heading */}
            <h1 className="text-2xl font-bold mb-4">About Crypto Weekly</h1>

            <p className="mb-4">
              Crypto Weekly is a free weekly newsletter delivering the most important cryptocurrency and blockchain news in one concise digest. Published every week since 2017, it's one of the longest-running crypto newsletters — covering markets, protocols, regulations, stablecoins, DeFi, NFTs, and other emerging crypto trends so you don't have to spend hours tracking it all yourself.
            </p>

            <p className="mb-4">
              No subscription fee. No ads. No sponsors. Just crypto news, curated independently.
            </p>

            <h2 className="text-xl font-bold mt-8 mb-3">Why subscribe?</h2>

            <p className="mb-4">
              What started as a weekly email for a small group of friends has grown to over 5,000 readers. Crypto Weekly is a public resource for the community —{' '}
              <Link href="/subscribe" className="hover:underline skyblue-link font-semibold">
                subscribe
              </Link>{' '}
              to get weekly updates in your inbox, or{' '}
              <Link href="/posts" className="hover:underline skyblue-link font-semibold">
                browse the full archive
              </Link>{' '}
              to read past issues.
            </p>

            <h2 className="text-xl font-bold mt-8 mb-3">Open Source</h2>

            <p className="mb-4">
              All posts are archived on GitHub:{' '}
              <a
                href="https://github.com/iloveburritos/crypto-weekly"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline skyblue-link"
              >
                github.com/iloveburritos/crypto-weekly
              </a>
            </p>
          </div>
        </article>
      </Layout>
    </>
  );
};

export default About;
