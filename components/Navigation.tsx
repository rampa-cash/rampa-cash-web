import Link from 'next/link';
import { useState, useEffect } from 'react';

const Navigation = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Match your actual sections
  const menuItems = [
    { id: 'home', label: 'Home' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'about-us', label: 'About Us' },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start' 
      });
    }
  };

  // Update active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = menuItems.map(item => item.id);
      const scrollPosition = window.scrollY + 100; // Offset for header height

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-50">
      <nav className="container mx-auto flex items-center justify-between py-3 px-4 md:py-4 md:px-6">
        <Link href="/">
          <div className="flex items-center cursor-pointer">
            <img src="/logo.png" alt="RAMPA logo" className="w-8 h-8 md:w-10 md:h-10" />
            <span className="font-bold text-lg md:text-xl ml-2">rampa</span>
          </div>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`font-medium transition-colors hover:text-indigo-600 ${
                activeSection === item.id 
                  ? 'text-indigo-600 border-b-2 border-indigo-600 pb-1' 
                  : 'text-gray-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        
        {/* Mobile Menu Button and CTA */}
        <div className="flex items-center md:hidden">
          <button 
            className="bg-indigo-600 text-white px-2 py-1 text-xs rounded-md font-medium hover:bg-indigo-700 transition mr-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            Menu
          </button>
          <Link 
            href="/whatsapp-transfer" 
            className="flex items-center bg-green-600 text-white px-2 py-1 text-xs rounded-md font-medium hover:bg-green-700 transition mr-2"
          >
            <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652c1.746.943 3.71 1.444 5.71 1.447h.006c6.585 0 11.946-5.336 11.949-11.896 0-3.176-1.24-6.165-3.495-8.411l.015-.039z" />
            </svg>
            WA
          </Link>
          <Link 
            href="/start" 
            className="bg-indigo-600 text-white px-2 py-1 text-xs rounded-md font-medium hover:bg-indigo-700 transition"
          >
            App
          </Link>
        </div>
        
        {/* Desktop CTA Buttons */}
        <div className="hidden md:flex space-x-3">
          <Link 
            href="/whatsapp-transfer" 
            className="flex items-center bg-green-600 text-white px-4 py-2 rounded-md font-medium hover:bg-green-700 transition"
          >
            <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652c1.746.943 3.71 1.444 5.71 1.447h.006c6.585 0 11.946-5.336 11.949-11.896 0-3.176-1.24-6.165-3.495-8.411l.015-.039z" />
            </svg>
            Send via WhatsApp
          </Link>
          
          <Link href="/start" className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 transition">
            Send via App
          </Link>
        </div>
      </nav>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white py-3 px-4 border-t">
          <div className="flex flex-col space-y-3">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  scrollToSection(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left font-medium transition-colors hover:text-indigo-600 ${
                  activeSection === item.id ? 'text-indigo-600' : 'text-gray-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navigation;