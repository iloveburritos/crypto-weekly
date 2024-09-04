// components/Layout.js

import Navbar from './Navbar';
import Footer from './Footer';
import Meta from './Meta';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';

const Layout = ({ children }) => {
  return (
    <>
    <Meta />
      <Navbar />
      <main >{children}</main>
      <Analytics />
      <SpeedInsights /> 
      <Footer />
    </>
  );
};

export default Layout;
