import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'next-i18next';
import LanguageSwitcher from '../LanguageSwitcher';

const Header = (): JSX.Element => {
	const { t } = useTranslation('common');
	const [activeSection, setActiveSection] = useState('home');
  	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	// Match your actual sections - wrapped in useMemo to prevent re-creation
	const menuItems = useMemo(() => [
		{ id: 'home', label: t('navigation.home') },
		{ id: 'how-it-works', label: t('navigation.howItWorks') },
		{ id: 'pricing', label: t('navigation.pricing') },
		{ id: 'about-us', label: t('navigation.aboutUs') },
	], [t]);

	const scrollToSection = (sectionId: string): void => {
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
		const handleScroll = (): void => {
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
  }, [menuItems]);

  return (
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-50">
      <nav className="container mx-auto flex items-center justify-between py-3 px-4 md:py-4 md:px-6">
        <Link href="/">
          <div className="flex items-center cursor-pointer">
            <Image src="/logo.png" alt="RAMPA logo" width={40} height={40} className="w-8 h-8 md:w-10 md:h-10" />
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
          <LanguageSwitcher />
        </div>
        {/* Mobile Menu Button and CTA */}
        <div className="flex items-center md:hidden">
          <LanguageSwitcher />
          <button 
            className="bg-indigo-600 text-white px-2 py-1 text-xs rounded-md font-medium hover:bg-indigo-700 transition ml-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            Menu
          </button>
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

export default Header;