import Head from 'next/head'
import Link from 'next/link'
import type { NextPage } from 'next'

const Home: NextPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>RAMPA - Fast, Secure Money Transfers</title>
        <meta name="description" content="Send money globally with RAMPA" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="py-4 px-6 md:px-16">
        <nav className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <img src="/logo.png" alt="RAMPA logo" className="logo" />
            <span className="font-bold text-xl ml-2">rampa.cash</span>
          </div>
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
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 transition">
            Start Sending Money
          </button>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-20 text-center px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Send money globally.
              <br />
              Fast. Secure. Regulated.
            </h1>
            <button className="bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700 transition text-lg mt-6">
              Start Sending Money
            </button>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 md:px-8">
            <h2 className="text-3xl font-bold text-center mb-16">How It Works</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-sm relative">
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold mb-4">
                  1
                </div>
                <h3 className="text-xl font-bold mb-2">Create an account</h3>
                <p className="text-gray-600">Fill in account details to set up your account.</p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-sm relative">
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold mb-4">
                  2
                </div>
                <h3 className="text-xl font-bold mb-2">Enter recipient details</h3>
                <p className="text-gray-600">Provide a confirmation and confirm email.</p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-sm relative">
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
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Pricing</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">Best exchange rates. Minimal fees.</p>
          </div>
        </section>

        {/* About Us Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 md:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">About Us</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              We are dedicated to providing secure and efficient global transfers.
            </p>
          </div>
        </section>
      </main>

      <footer className="py-8 border-t">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2024 Rampa.cash</p>
        </div>
      </footer>
    </div>
  )
}

export default Home
