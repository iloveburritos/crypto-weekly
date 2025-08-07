import Link from 'next/link';
import TerminalLogo from './TerminalLogo';

const Navbar = () => {
  return (
    <nav className="sticky top-0 max-w-[680px] p-5 flex flex-col sm:flex-row justify-between items-center m-auto text-link pb-3 border-b-2 mb-3 border-border bg-[#FAF9F6] z-10">
      <header className=" w-full flex justify-center">
        <h1 className="text-center sm:text-left">
          <Link href="/" className="hover:opacity-80 transition-opacity duration-200">
            <TerminalLogo size="32" />
          </Link>
        </h1>
      </header>
      <div className="order-1 sm:order-2 flex gap-5 justify-center sm:justify-end w-full sm:w-auto items-center">
        <Link className="hover:underline text-xl" href="/about">About</Link>
        <Link className="hover:underline text-xl" href="/posts">Archive</Link>
        <Link className="p-1" href="https://github.com/iloveburritos/crypto-weekly">
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" height="20" width="20">
            <path d="M12 0C5.371 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.385.6.111.82-.261.82-.577 0-.285-.01-1.041-.015-2.042-3.338.726-4.042-1.615-4.042-1.615-.546-1.387-1.332-1.756-1.332-1.756-1.089-.744.083-.729.083-.729 1.204.084 1.838 1.237 1.838 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.304.761-1.605-2.665-.304-5.467-1.334-5.467-5.932 0-1.311.469-2.381 1.236-3.22-.124-.303-.535-1.527.117-3.181 0 0 1.008-.322 3.3 1.23.957-.267 1.982-.4 3.003-.404 1.021.004 2.046.137 3.004.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.654.242 2.878.118 3.181.769.839 1.236 1.909 1.236 3.22 0 4.61-2.807 5.624-5.479 5.921.43.372.813 1.104.813 2.227 0 1.607-.014 2.903-.014 3.293 0 .32.217.694.825.577C20.565 21.796 24 17.3 24 12 24 5.373 18.627 0 12 0z" />
          </svg>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;