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
          
          {/* Desktop CTA Button */}
          <div className="hidden md:block">
            <Link href="/start" className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 transition">
              Start Sending Money
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
