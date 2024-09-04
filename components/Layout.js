// components/Layout.js

import Navbar from './Navbar';
import Footer from './Footer';
import Meta from './Meta';

const Layout = ({ children }) => {
  return (
    <>
    <Meta />
      <Navbar />
      <main >{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
