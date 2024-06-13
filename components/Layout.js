// components/Layout.js

import Navbar from './Navbar';
import Footer from './Footer';
import SearchBar from './SearchBar';
import Meta from './Meta';

const Layout = ({ children }) => {
  return (
    <>
    <Meta />
      <Navbar />
      <main >{children}</main>
      <SearchBar />
      <Footer />
    </>
  );
};

export default Layout;
