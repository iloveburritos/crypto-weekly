// components/Footer.js
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="text-center mx-auto ">
      <nav className="max-w-[680px] p-3 flex justify-between m-auto text-link border-b-2 mb-3"></nav>
      <div>
      <div className="flex gap-4 justify-center sm:w-auto">
        <div className="flex p-1.5 gap-5">
          <Link href="https://twitter.com/maariabajwa">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" height="20" width="20">
              <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-2.719 0-4.92 2.201-4.92 4.917 0 .386.044.763.128 1.124-4.09-.205-7.719-2.165-10.141-5.144-.424.729-.666 1.574-.666 2.476 0 1.709.869 3.213 2.188 4.096-.806-.026-1.566-.247-2.228-.616v.062c0 2.386 1.698 4.374 3.946 4.828-.413.111-.849.171-1.296.171-.314 0-.621-.029-.918-.085.621 1.934 2.422 3.342 4.558 3.382-1.67 1.309-3.778 2.088-6.066 2.088-.394 0-.779-.023-1.158-.067 2.162 1.389 4.729 2.2 7.488 2.2 8.984 0 13.894-7.438 13.894-13.894 0-.211-.004-.422-.013-.632.953-.688 1.78-1.548 2.437-2.526z" />
            </svg>
          </Link>
          <Link href="https://github.com/iloveburritos">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" height="20" width="20">
              <path d="M12 0C5.371 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.385.6.111.82-.261.82-.577 0-.285-.01-1.041-.015-2.042-3.338.726-4.042-1.615-4.042-1.615-.546-1.387-1.332-1.756-1.332-1.756-1.089-.744.083-.729.083-.729 1.204.084 1.838 1.237 1.838 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.304.761-1.605-2.665-.304-5.467-1.334-5.467-5.932 0-1.311.469-2.381 1.236-3.22-.124-.303-.535-1.527.117-3.181 0 0 1.008-.322 3.3 1.23.957-.267 1.982-.4 3.003-.404 1.021.004 2.046.137 3.004.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.654.242 2.878.118 3.181.769.839 1.236 1.909 1.236 3.22 0 4.61-2.807 5.624-5.479 5.921.43.372.813 1.104.813 2.227 0 1.607-.014 2.903-.014 3.293 0 .32.217.694.825.577C20.565 21.796 24 17.3 24 12 24 5.373 18.627 0 12 0z" />
            </svg>
          </Link>
          <Link href="https://www.linkedin.com/in/maariab">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" height="20" width="20">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.784 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
          </Link>
        </div>
      </div>
        <h1 className="text-center text-2xl font-bold mb-1"></h1>
        <div className="flex justify-center text-center" >
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
