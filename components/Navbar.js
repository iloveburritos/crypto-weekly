// components/NavBar.js

import Link from 'next/link';


const Navbar = () => {
  return (
    <nav className="max-w-[680px] p-4 flex flex-col sm:flex-row justify-between items-center m-auto text-link pb-3 border-b-2 mb-3 border-border">
      <header className="sm:order-1 w-full sm:w-auto mb-4 sm:mb-0">
        <h1 className="font-bold text-center sm:text-left">
          <Link href="/" className="font-bold whitespace-nowrap">Crypto Weekly</Link>
        </h1>
      </header>
      <div className="order-1 sm:order-2 flex gap-4 justify-center sm:justify-end w-full sm:w-auto ">
        <Link href="/about">About</Link>
        <Link href="/posts">Posts</Link>
        <Link href="/subscribe">Subscribe</Link>
      </div>
    </nav>
  );
};


export default Navbar;
