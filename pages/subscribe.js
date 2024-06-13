// pages/subscribe.js

import Navbar from '../components/Navbar';

const Subscribe = () => {
  return (
    <div>
      <Navbar>
      </Navbar>
      <h1 className="max-w-[680px] text-center text-2xl font-bold mb-4"></h1>
        <div className="flex mx-auto justify-center max-w-[680px] ">
          <iframe
            title="Substack Signup"
            src="https://thisweekincrypto.substack.com/embed"
            width="100%"
            height="300"
            style={{ border: "0px solid #EEE", background: "white" }}
            frameBorder="0"
            scrolling="no"
          ></iframe>
          </div>
          <footer className="p-4 text-center mx-auto"> 
      <p>&copy; {new Date().getFullYear()} Crypto Weekly. Thank you for reading.</p>
      </footer>
    </div>
  );
};

export default Subscribe;
