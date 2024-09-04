// components/Footer.js
import Link from 'next/link';
import SearchBar from './SearchBar';

const Footer = () => {
  return (
    <footer className="text-center mx-auto ">
      <nav className="max-w-[680px] flex m-auto text-link border-b-2 mb-7"></nav>
      <div>
      <div className="flex gap-4 justify-center sm:w-auto">
      <div className="mb-6" >
          <SearchBar />
        </div>
        
      </div>

        <div className="flex justify-center text-center mt-5 mb-10" >
          <iframe
            title="Substack Signup"
            src="https://thisweekincrypto.substack.com/embed"
            width="400px"
            height="140px"
            color="black"
            style={{ border: '0px', justifyContent: 'center', borderRadius: '10px' }}
            frameBorder="0"
            scrolling="no"
          ></iframe>

        </div>
        <p>&copy; {new Date().getFullYear()} Crypto Weekly. Thank you for reading.</p>
      </div>
      
    </footer>
  );
};

export default Footer;
