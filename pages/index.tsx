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

      <header className="py-4 px-4 md:px-6 shadow-sm">
        <nav className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <img src="/logo.png" alt="RAMPA logo" className="logo" />
            <span className="font-bold text-xl ml-2">rampa.cash</span>
          </div>
          
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
          
          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button 
              className="bg-indigo-600 text-white px-3 py-1 text-sm rounded-md font-medium hover:bg-indigo-700 transition mr-3"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              Menu
            </button>
            <Link href="/start" className="bg-indigo-600 text-white px-3 py-1 text-sm rounded-md font-medium hover:bg-indigo-700 transition">
              Send Money
            </Link>
          </div>
          
          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex space-x-3">
            <Link 
              href="/whatsapp-transfer" 
              className="flex items-center bg-green-600 text-white px-4 py-2 rounded-md font-medium hover:bg-green-700 transition"
            >
              <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" clipRule="evenodd" d="M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652c1.746.943 3.71 1.444 5.71 1.447h.006c6.585 0 11.946-5.336 11.949-11.896 0-3.176-1.24-6.165-3.495-8.411l.015-.039zM12.042 21.785h-.004c-1.78 0-3.524-.478-5.038-1.377l-.361-.214-3.741.975 1.001-3.648-.239-.379c-.986-1.568-1.504-3.379-1.503-5.26.004-5.431 4.438-9.849 9.893-9.849 2.64 0 5.122 1.03 6.988 2.898 1.866 1.869 2.893 4.352 2.892 6.994-.003 5.442-4.431 9.86-9.885 9.86h-.002z" />
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
          <div className="md:hidden bg-white py-4 px-4 border-t">
            <div className="flex flex-col space-y-4">
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
              <Link 
                href="/whatsapp-transfer" 
                className="flex items-center font-medium text-green-600 hover:text-green-700"
              >
                <svg className="w-5 h-5 mr-1" viewBox="0 0 448 512" fill="currentColor">
                  <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zM223.9 438.7c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                </svg>
                Send via WhatsApp
              </Link>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-12 md:py-20 text-center px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
              Send money globally.
              <br />
              Fast. Secure. Easy.
            </h1>
            <Link href="/start" className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700 transition text-lg mt-4">
              Start Sending Money
            </Link>
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
            <p className="mb-4">© {new Date().getFullYear()} Rampa.cash</p>
            
            <div className="flex items-center">
              <span className="mr-2">Follow us on</span>
              <a 
                href="https://x.com/rampa_cash" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-gray-700 hover:text-indigo-600 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span className="ml-1">@rampa_cash</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
