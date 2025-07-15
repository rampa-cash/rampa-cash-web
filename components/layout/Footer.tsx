// components/Footer.tsx
const Footer = () => (
    <footer className="py-6 md:py-8 border-t">
      <div className="container mx-auto px-4 text-center text-gray-600">
        <div className="flex flex-col items-center justify-center">
          <p className="mb-3 md:mb-4 text-sm md:text-base">© {new Date().getFullYear()} Rampa.cash</p>
          <div className="flex flex-wrap items-center justify-center mb-4">
            <span className="mr-2 text-sm md:text-base">Follow us on</span>
            <a 
              href="https://x.com/rampa_cash" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-gray-700 hover:text-indigo-600 transition-colors"
            >
              <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span className="ml-1 text-sm md:text-base">@rampa_cash</span>
            </a>
          </div>
          <div className="flex items-center justify-center">
            <a 
              href="/impressum" 
              className="text-sm md:text-base text-gray-600 hover:text-indigo-600 transition-colors"
            >
              Impressum
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
  
  export default Footer;