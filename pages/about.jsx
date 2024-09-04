// pages/about.jsx

import React from 'react';
import Layout from '../components/Layout';

const About = () => {
  return (
    <>
      <Layout>
        <div className="max-w-[680px] mx-auto p-3">
          <div className="my-4">
            <p className="whitespace-pre-wrap">
              A weekly newsletter written by <a href="https://maaria.com" className="hover:underline skyblue-link"><strong>Maaria Bajwa</strong></a> since 2017. I'm a co-founder of Timespan Ventures, an early stage venture fund investing in emerging tech like crypto. 
              
              {'\n\n'}
              Prior to Timespan, I was investing at Sound Ventures (co-founded by Ashton Kutcher and Guy Oseary). 

              {'\n\n'}
              Crypto Weekly is a public resource for the community. There will never be a subscription fee. No ads. No sponsorship.

              {'\n\n'}
              All posts are archived on GitHub here: <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:underline skyblue-link">https://github.com/iloveburritos/crypto-weekly</a>.

              {'\n\n'}
              I started writing Crypto Weekly in 2017 as a resource for a small group of friends. It has since grown to over 5k readers.

              {'\n\n'}
              <a href="https://x.com/serdaveeth_" target="_blank" rel="noopener noreferrer" className="hover:underline skyblue-link">@serdave</a> has been co-authoring the newsletter in 2023.
            </p>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default About;