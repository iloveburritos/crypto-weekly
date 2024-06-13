// pages/about.jsx

import React from 'react';
import Layout from '../components/Layout';

const About = () => {
  return (
    <>
      <Layout >
        <div className="max-w-[680px] mx-auto p-3">
          <div className="my-4">
            <p className="mb-5">Crypto Weekly is a newsletter that summarizes the biggest blockchain and crypto news stories of the week. <a href="https://www.linkedin.com/in/maariab" className="hover:underline skyblue-link"><strong>Maaria Bajwa</strong></a> has been writing the newsletter since 2017. </p>
            <p className="mb-5">I am currently a venture capitalist at <a href="https://timespan.vc" target="_blank" rel="noopener noreferrer" className="hover:underline skyblue-link"><strong>Timespan Ventures</strong></a>, deeply interested in blockchain and crypto technology. </p>
            <p className="mb-5">Crypto Weekly has always been (and forever will be) free. No advertisements or paid stories included. That means even though we try to get it out every Sunday, we&aposll occasionally skip a week or send a day late.</p>
            <p className="mb-5">Co-authored by <a href="https://www.linkedin.com/in/david-blumenfeld-b2a9335a/" target="_blank" rel="noopener noreferrer" className="hover:underline skyblue-link"><strong>David Blumenfeld</strong></a> since 2022.</p>
            <p className="mb-5">All Crypto Weekly archives are also available on GitHub <a href="https://www.github.com/iloveburritos" className="hover:underline skyblue-link"><strong>HERE</strong></a></p>
            <div className="flex flex-col mt-4">
              <p className="mb-4">Questions? Comments? Email me at <a href="mailto:maariabajwa@gmail.com" className="hover:underline skyblue-link"><strong>maariabajwa@gmail.com</strong></a></p>
            </div>
          </div>
        </div>
      </Layout >
    </>
  );
};


export default About;
