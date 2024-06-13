// components/Footer.js

const Footer = () => {
  return (
    <footer className="d p-4 text-center mx-auto ">
      <nav className="max-w-[680px] p-3 flex justify-between m-auto text-link pb-3 border-b-2 mb-3 border-border"></nav>
      <div>
        <h1 className="text-center text-2xl font-bold mb-4"></h1>
        <div className="flex justify-center text-center mb-4" >
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
      </div>
      <p>&copy; {new Date().getFullYear()} Crypto Weekly. Thank you for reading.</p>
    </footer>
  );
};

export default Footer;
