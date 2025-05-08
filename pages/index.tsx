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
            <Link 
              href="/whatsapp-transfer" 
              className="flex items-center font-medium text-green-600 hover:text-green-700"
            >
              <svg className="w-5 h-5 mr-1" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6.531 16.983c-.484 1.488-2.376 2.716-4.587 3.068-1.713.271-3.434.075-4.887-.611-1.115-.529-1.988-1.116-2.796-1.898-1.967-1.905-3.092-4.614-2.849-7.273.13-1.428.716-2.722 1.706-3.7 1.262-1.247 2.97-1.896 4.746-1.896.58 0 1.152.077 1.707.23.278.077 2.09.563 2.582.845 1.177.674 2.128 1.613 2.802 2.775 1.023 1.772 1.308 3.932.798 6.072-.415 1.739-1.144 3.023-2.216 3.767-.358.248-.828.172-1.064-.174-.236-.348-.137-.819.223-1.064.894-.612 1.319-1.834 1.467-2.494.34-1.518.175-3.219-.467-4.702-.456-1.05-1.2-1.972-2.052-2.544-.394-.265-.854-.437-1.297-.505-.14-.02-.294-.026-.444-.026-1.326 0-2.505.834-2.98 2.085-.197.517-.274 1.085-.228 1.674.037.48.186.909.406 1.27.179.292.38.563.59.82.089.11.167.51.298.87.205.057.435.01.499-.167.591-1.412 1.022-1.8 1.596-2.11.425-.23.905-.364 1.384-.409.176-.017.356-.014.533.01.161.022.324.055.483.098.067.018.057-.038.09-.094.013-.022.04-.066.073-.12.034-.056.073-.12.112-.184.08-.132.16-.264.166-.294.013-.067-.048-.13-.126-.173-.077-.043-.186-.087-.308-.118-.123-.032-.192-.076-.301-.118-.109-.042-.23-.103-.317-.155-.087-.051-.122-.071-.122-.071l-.058-.034c-.801-.46-1.943-.818-2.996-.846-.97-.026-2.25.206-3.07.843-.821.637-1.228 1.24-1.664 2.125-.435.886-.801 1.404-1.154 2.316-.352.913-.411 1.89-.264 2.786.147.896.5 1.768 1.038 2.486.538.719 1.167 1.14 1.692 1.56.526.419 1.424.83 2.21 1.093.786.262 1.302.288 2.133.321.83.033 1.841-.085 2.793-.462.952-.376 1.793-.877 2.512-1.62.718-.745 1.192-1.584 1.285-2.545.092-.961-.059-1.891-.43-2.66-.371-.77-.95-1.33-1.586-1.669-.318-.169-.842-.32-.985-.344-.142-.024-.681-.012-.681-.012-.435-.067-.821.052-1.171.312-.35.26-.672.521-.965.812-.148.146-.287.299-.416.458-.13.159-.249.324-.341.499-.09.171-.154.356-.167.553-.011.168.005.342.054.502.048.16.131.301.232.421.101.12.224.218.355.294.132.076.394.171.516.204.61.166 1.02.209 1.463.214.109.001.217-.003.324-.01.106-.007.154-.059.249-.11l.014-.008c.123-.068.24-.152.348-.249.324-.292.548-.677.617-1.082.068-.405-.016-.829-.222-1.172-.103-.171-.238-.323-.394-.446-.156-.122-.333-.215-.52-.269-.186-.055-.507-.093-.605-.093-.098 0-.432.038-.432.038-.234.035-.456.112-.656.226-.2.114-.385.244-.554.402-.338.316-.601.747-.736 1.212-.134.465-.151.959-.028 1.425.123.466.385.896.742 1.228.178.166.513.36.764.468.251.108.523.176.801.199.278.023.559.002.828-.05.269-.052.529-.142.764-.254.235-.111.444-.242.632-.39.189-.148.357-.311.505-.488.148-.176.276-.365.387-.564.111-.198.206-.405.284-.617.063-.174.114-.352.154-.533.039-.18.066-.364.08-.55.007-.091.01-.183.01-.274 0-1.031-.459-2.058-.907-2.791-.448-.732-1.147-1.37-1.914-1.772-.767-.403-1.786-.78-2.698-.819z" fillRule="evenodd" clipRule="evenodd"/>
              </svg>
              Send via WhatsApp
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
              <Link 
                href="/whatsapp-transfer" 
                className="flex items-center font-medium text-green-600 hover:text-green-700"
              >
                <svg className="w-5 h-5 mr-1" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6.531 16.983c-.484 1.488-2.376 2.716-4.587 3.068-1.713.271-3.434.075-4.887-.611-1.115-.529-1.988-1.116-2.796-1.898-1.967-1.905-3.092-4.614-2.849-7.273.13-1.428.716-2.722 1.706-3.7 1.262-1.247 2.97-1.896 4.746-1.896.58 0 1.152.077 1.707.23.278.077 2.09.563 2.582.845 1.177.674 2.128 1.613 2.802 2.775 1.023 1.772 1.308 3.932.798 6.072-.415 1.739-1.144 3.023-2.216 3.767-.358.248-.828.172-1.064-.174-.236-.348-.137-.819.223-1.064.894-.612 1.319-1.834 1.467-2.494.34-1.518.175-3.219-.467-4.702-.456-1.05-1.2-1.972-2.052-2.544-.394-.265-.854-.437-1.297-.505-.14-.02-.294-.026-.444-.026-1.326 0-2.505.834-2.98 2.085-.197.517-.274 1.085-.228 1.674.037.48.186.909.406 1.27.179.292.38.563.59.82.089.11.167.51.298.87.205.057.435.01.499-.167.591-1.412 1.022-1.8 1.596-2.11.425-.23.905-.364 1.384-.409.176-.017.356-.014.533.01.161.022.324.055.483.098.067.018.057-.038.09-.094.013-.022.04-.066.073-.12.034-.056.073-.12.112-.184.08-.132.16-.264.166-.294.013-.067-.048-.13-.126-.173-.077-.043-.186-.087-.308-.118-.123-.032-.192-.076-.301-.118-.109-.042-.23-.103-.317-.155-.087-.051-.122-.071-.122-.071l-.058-.034c-.801-.46-1.943-.818-2.996-.846-.97-.026-2.25.206-3.07.843-.821.637-1.228 1.24-1.664 2.125-.435.886-.801 1.404-1.154 2.316-.352.913-.411 1.89-.264 2.786.147.896.5 1.768 1.038 2.486.538.719 1.167 1.14 1.692 1.56.526.419 1.424.83 2.21 1.093.786.262 1.302.288 2.133.321.83.033 1.841-.085 2.793-.462.952-.376 1.793-.877 2.512-1.62.718-.745 1.192-1.584 1.285-2.545.092-.961-.059-1.891-.43-2.66-.371-.77-.95-1.33-1.586-1.669-.318-.169-.842-.32-.985-.344-.142-.024-.681-.012-.681-.012-.435-.067-.821.052-1.171.312-.35.26-.672.521-.965.812-.148.146-.287.299-.416.458-.13.159-.249.324-.341.499-.09.171-.154.356-.167.553-.011.168.005.342.054.502.048.16.131.301.232.421.101.12.224.218.355.294.132.076.394.171.516.204.61.166 1.02.209 1.463.214.109.001.217-.003.324-.01.106-.007.154-.059.249-.11l.014-.008c.123-.068.24-.152.348-.249.324-.292.548-.677.617-1.082.068-.405-.016-.829-.222-1.172-.103-.171-.238-.323-.394-.446-.156-.122-.333-.215-.52-.269-.186-.055-.507-.093-.605-.093-.098 0-.432.038-.432.038-.234.035-.456.112-.656.226-.2.114-.385.244-.554.402-.338.316-.601.747-.736 1.212-.134.465-.151.959-.028 1.425.123.466.385.896.742 1.228.178.166.513.36.764.468.251.108.523.176.801.199.278.023.559.002.828-.05.269-.052.529-.142.764-.254.235-.111.444-.242.632-.39.189-.148.357-.311.505-.488.148-.176.276-.365.387-.564.111-.198.206-.405.284-.617.063-.174.114-.352.154-.533.039-.18.066-.364.08-.55.007-.091.01-.183.01-.274 0-1.031-.459-2.058-.907-2.791-.448-.732-1.147-1.37-1.914-1.772-.767-.403-1.786-.78-2.698-.819z" fillRule="evenodd" clipRule="evenodd"/>
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
