import Head from 'next/head'
import Link from 'next/link'
import type { NextPage } from 'next'
import { useState } from 'react'

const Home: NextPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>RAMPA - Fast, Secure Money Transfers</title>
        <meta name="description" content="Send money globally with RAMPA" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/logo.png" type="image/png" />
      </Head>

      <header className="py-3 px-4 md:py-4 md:px-6 shadow-sm">
        <nav className="container mx-auto flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <img src="/logo.png" alt="RAMPA logo" className="w-8 h-8 md:w-10 md:h-10" />
              <span className="font-bold text-lg md:text-xl ml-2">rampa</span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="font-medium text-gray-800 hover:text-indigo-600">
              Home
            </Link>
            <Link href="/how-it-works" className="font-medium text-gray-800 hover:text-indigo-600">
              How It Works
            </Link>
            <Link href="/pricing" className="font-medium text-gray-800 hover:text-indigo-600">
              Pricing
            </Link>
            <Link href="/about-us" className="font-medium text-gray-800 hover:text-indigo-600">
              About Us
            </Link>
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
                <path d="M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652c1.746.943 3.71 1.444 5.71 1.447h.006c6.585 0 11.946-5.336 11.949-11.896 0-3.176-1.24-6.165-3.495-8.411l.015-.039zM12.042 21.785h-.004c-1.78 0-3.524-.478-5.038-1.377l-.361-.214-3.741.975 1.001-3.648-.239-.379c-.986-1.568-1.504-3.379-1.503-5.26.004-5.431 4.438-9.849 9.893-9.849 2.64 0 5.122 1.03 6.988 2.898 1.866 1.869 2.893 4.352 2.892 6.994-.003 5.442-4.431 9.86-9.885 9.86h-.002z" />
              </svg>
              Send via WhatsApp
            </Link>
            
            <Link href="/start" className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 transition">
              Send via App
            </Link>
          </div>
        </nav>
        
        {/* Mobile Menu - Improved for mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white py-3 px-4 border-t">
            <div className="flex flex-col space-y-3">
              <Link href="/" className="font-medium text-gray-800 hover:text-indigo-600">
                Home
              </Link>
              <Link href="/how-it-works" className="font-medium text-gray-800 hover:text-indigo-600">
                How It Works
              </Link>
              <Link href="/pricing" className="font-medium text-gray-800 hover:text-indigo-600">
                Pricing
              </Link>
              <Link href="/about-us" className="font-medium text-gray-800 hover:text-indigo-600">
                About Us
              </Link>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* Hero Section - Mobile optimized */}
        <section className="py-8 md:py-16 text-center px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 md:mb-6 leading-tight">
              No Hidden Fees. No Delays.
              <br className="hidden sm:block" />
              <span className="sm:inline"> Just Money Home.</span>
            </h1>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-3 mt-4">
              <Link 
                href="/whatsapp-transfer" 
                className="w-full sm:w-auto flex items-center justify-center bg-green-600 text-white px-4 py-2 rounded-md font-medium hover:bg-green-700 transition"
              >
                <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652c1.746.943 3.71 1.444 5.71 1.447h.006c6.585 0 11.946-5.336 11.949-11.896 0-3.176-1.24-6.165-3.495-8.411l.015-.039z" />
                </svg>
                Send via WhatsApp
              </Link>
              
              <Link 
                href="/start" 
                className="w-full sm:w-auto bg-indigo-600 text-white px-6 py-2 rounded-md font-medium hover:bg-indigo-700 transition text-lg"
              >
                Send via App
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="container mx-auto px-4 md:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-16">How It Works</h2>
            
            <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm relative">
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold mb-4">
                  1
                </div>
                <h3 className="text-xl font-bold mb-2">Create an account</h3>
                <p className="text-gray-600">Fill in account details to set up your account.</p>
              </div>
              
              <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm relative">
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold mb-4">
                  2
                </div>
                <h3 className="text-xl font-bold mb-2">Enter recipient details</h3>
                <p className="text-gray-600">Provide a confirmation and confirm email.</p>
              </div>
              
              <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm relative sm:col-span-2 lg:col-span-1">
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold mb-4">
                  3
                </div>
                <h3 className="text-xl font-bold mb-2">Confirm and send</h3>
                <p className="text-gray-600">Make secure, easy and fast payment.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 md:px-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Pricing</h2>
            <p className="text-lg md:text-xl mb-6 md:mb-8 max-w-2xl mx-auto">Best exchange rates. Minimal fees.</p>
          </div>
        </section>

        {/* About Us Section */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="container mx-auto px-4 md:px-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">About Us</h2>
            <p className="text-lg md:text-xl mb-6 md:mb-8 max-w-3xl mx-auto">
              We are dedicated to providing secure and efficient global transfers.
            </p>
          </div>
        </section>
      </main>

      <footer className="py-6 md:py-8 border-t">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <div className="flex flex-col items-center justify-center">
            <p className="mb-3 md:mb-4 text-sm md:text-base">© {new Date().getFullYear()} Rampa.cash</p>
            
            <div className="flex flex-wrap items-center justify-center">
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
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
