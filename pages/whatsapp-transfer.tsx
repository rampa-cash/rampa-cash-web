import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const WhatsAppTransfer = () => {
  const [amount, setAmount] = useState('200');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+34'); // Default to Spain
  const [selectedRecipientCountry, setSelectedRecipientCountry] = useState('MXN');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  
  // Exchange rates (for demo purposes - in production, these would come from an API)
  const exchangeRates = {
    MXN: 18.50,  // EUR to MXN
    COP: 4200,   // EUR to COP
    BRL: 5.45,   // EUR to BRL
    ARS: 950,    // EUR to ARS
    PEN: 4.15    // EUR to PEN
  };
  
  // Calculate recipient amount based on selected currency
  const calculatedAmount = (parseFloat(amount) || 0) * (exchangeRates[selectedRecipientCountry] || 0);
  
  // Latin American currencies
  const recipientCurrencies = [
    { currency: 'MXN', country: 'Mexico', flag: '🇲🇽' },
    { currency: 'COP', country: 'Colombia', flag: '🇨🇴' },
    { currency: 'BRL', country: 'Brazil', flag: '🇧🇷' },
    { currency: 'ARS', country: 'Argentina', flag: '🇦🇷' },
    { currency: 'PEN', country: 'Peru', flag: '🇵🇪' },
  ];

  // Country codes array
  const countryCodes = [
    // European Union countries first (for Europe-LatAm corridor focus)
    { code: '+34', country: 'Spain', flag: '🇪🇸' },
    { code: '+33', country: 'France', flag: '🇫🇷' },
    { code: '+49', country: 'Germany', flag: '🇩🇪' },
    { code: '+39', country: 'Italy', flag: '🇮🇹' },
    { code: '+351', country: 'Portugal', flag: '🇵🇹' },
    
    // Other EU countries
    { code: '+43', country: 'Austria', flag: '🇦🇹' },
    { code: '+32', country: 'Belgium', flag: '🇧🇪' },
    { code: '+359', country: 'Bulgaria', flag: '🇧🇬' },
    { code: '+385', country: 'Croatia', flag: '🇭🇷' },
    { code: '+357', country: 'Cyprus', flag: '🇨🇾' },
    { code: '+420', country: 'Czech Republic', flag: '🇨🇿' },
    { code: '+45', country: 'Denmark', flag: '🇩🇰' },
    { code: '+372', country: 'Estonia', flag: '🇪🇪' },
    { code: '+358', country: 'Finland', flag: '🇫🇮' },
    { code: '+30', country: 'Greece', flag: '🇬🇷' },
    { code: '+36', country: 'Hungary', flag: '🇭🇺' },
    { code: '+353', country: 'Ireland', flag: '🇮🇪' },
    { code: '+371', country: 'Latvia', flag: '🇱🇻' },
    { code: '+370', country: 'Lithuania', flag: '🇱🇹' },
    { code: '+352', country: 'Luxembourg', flag: '🇱🇺' },
    { code: '+356', country: 'Malta', flag: '🇲🇹' },
    { code: '+31', country: 'Netherlands', flag: '🇳🇱' },
    { code: '+48', country: 'Poland', flag: '🇵🇱' },
    { code: '+40', country: 'Romania', flag: '🇷🇴' },
    { code: '+421', country: 'Slovakia', flag: '🇸🇰' },
    { code: '+386', country: 'Slovenia', flag: '🇸🇮' },
    { code: '+46', country: 'Sweden', flag: '🇸🇪' },
    
    // Latin American countries
    { code: '+52', country: 'Mexico', flag: '🇲🇽' },
    { code: '+57', country: 'Colombia', flag: '🇨🇴' },
    { code: '+55', country: 'Brazil', flag: '🇧🇷' },
    { code: '+54', country: 'Argentina', flag: '🇦🇷' },
    { code: '+51', country: 'Peru', flag: '🇵🇪' },
    
    // Other popular codes
    { code: '+44', country: 'UK', flag: '🇬🇧' },
    { code: '+1', country: 'USA/Canada', flag: '🇺🇸' },
  ];
  
  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>Send Money via WhatsApp | RAMPA</title>
        <meta name="description" content="Transfer money from Europe to Latin America quickly and securely using WhatsApp" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/logo.png" type="image/png" />
      </Head>

      <header className="py-4 px-4 md:px-6 shadow-sm">
        <nav className="container mx-auto flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <img src="/logo.png" alt="RAMPA logo" className="w-8 h-8 md:w-10 md:h-10" />
              <span className="font-bold text-lg md:text-xl ml-2">rampa</span>
            </div>
          </Link>
          
          <Link href="/" className="font-medium text-gray-800 hover:text-indigo-600">
            Back to Home
          </Link>
        </nav>
      </header>

      <main>
        <section className="py-8 md:py-12 px-4">
          <div className="container mx-auto max-w-2xl">
            <div className="flex items-center justify-center mb-6 md:mb-8">
              <svg className="w-8 h-8 md:w-10 md:h-10 text-green-600 mr-2 md:mr-3" viewBox="0 0 448 512" fill="currentColor">
                <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
              </svg>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">Send Money via WhatsApp</h1>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-5 md:p-8">
              <div className="flex flex-col md:flex-row items-center justify-center mb-6">
                <div className="border border-indigo-200 rounded-md p-3 w-full md:w-auto mb-4 md:mb-0">
                  <div className="text-sm text-gray-500 mb-1">You send</div>
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={amount}
                      onChange={(e) => {
                        // Only allow numbers and decimal point
                        const value = e.target.value.replace(/[^0-9.]/g, '');
                        setAmount(value);
                      }}
                      className="text-2xl font-medium outline-none w-24 text-right"
                    />
                    <span className="text-2xl font-medium ml-2">EUR</span>
                  </div>
                </div>
                
                <div className="mx-2 md:mx-4 text-indigo-600 mb-4 md:mb-0">
                  <svg className="w-6 h-6 transform rotate-90 md:rotate-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </div>
                
                <div className="border border-indigo-200 rounded-md p-3 w-full md:w-auto">
                  <div className="text-sm text-gray-500 mb-1">Recipient gets</div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-medium">{calculatedAmount.toFixed(2)}</span>
                    
                    <div className="relative ml-2">
                      <div 
                        onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                        className="flex items-center cursor-pointer bg-gray-100 hover:bg-gray-200 transition rounded-md px-2 py-1"
                      >
                        <span className="mr-1">{recipientCurrencies.find(c => c.currency === selectedRecipientCountry)?.flag}</span>
                        <span>{selectedRecipientCountry}</span>
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </div>
                      
                      {showCurrencyDropdown && (
                        <div className="absolute right-0 mt-1 bg-white shadow-lg border border-gray-200 rounded-md z-10 w-48">
                          {recipientCurrencies.map((item) => (
                            <div 
                              key={item.currency}
                              className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                              onClick={() => {
                                setSelectedRecipientCountry(item.currency);
                                setShowCurrencyDropdown(false);
                              }}
                            >
                              <span className="inline-block mr-2">{item.flag}</span>
                              <span className="font-medium mr-1">{item.currency}</span>
                              <span className="text-gray-500 text-sm">- {item.country}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 mb-1">Your WhatsApp</label>
                <div className="flex relative">
                  <div 
                    className="bg-gray-100 px-3 py-2 rounded-l-md flex items-center text-gray-700 cursor-pointer hover:bg-gray-200 transition"
                    onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                  >
                    <span className="inline-block mr-1">
                      {countryCodes.find(c => c.code === countryCode)?.flag}
                    </span>
                    <span className="inline-block">{countryCode}</span>
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                  
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="Enter phone number"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  
                  {showCountryDropdown && (
                    <div className="absolute top-full left-0 mt-1 bg-white shadow-lg border border-gray-200 rounded-md z-10 max-h-60 overflow-y-auto w-64">
                      <input
                        type="text"
                        placeholder="Search countries..."
                        className="w-full px-4 py-2 border-b border-gray-200 focus:outline-none"
                        onClick={(e) => e.stopPropagation()}
                      />
                      {countryCodes.map((country) => (
                        <div 
                          key={country.code}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                          onClick={() => {
                            setCountryCode(country.code);
                            setShowCountryDropdown(false);
                          }}
                        >
                          <span className="inline-block mr-2 text-lg">{country.flag}</span>
                          <span className="font-medium mr-2">{country.code}</span>
                          <span className="text-gray-600">{country.country}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">Your WhatsApp number with country code</p>
              </div>
              
              {/* Exchange rate information */}
              <div className="bg-gray-50 rounded-md p-3 mb-4 text-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Exchange rate</span>
                  <span className="font-medium">1 EUR = {exchangeRates[selectedRecipientCountry].toFixed(2)} {selectedRecipientCountry}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Fee</span>
                  <span className="text-green-600 font-medium">FREE (first transaction)</span>
                </div>
              </div>
              
              <button
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md font-medium hover:bg-indigo-700 transition flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Send money now
              </button>
              
              <div className="mt-4 text-xs text-center text-gray-500">
                By continuing, you accept the <a href="#" className="text-indigo-600">terms of use</a> and{' '}
                <a href="#" className="text-indigo-600">privacy policies</a> of Rampa.cash
              </div>
            </div>
            
            {/* Benefits section */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 text-center">
                <div className="text-indigo-600 flex justify-center mb-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-medium">Fast Transfers</h3>
                <p className="text-sm text-gray-600 mt-1">Money arrives within minutes</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 text-center">
                <div className="text-indigo-600 flex justify-center mb-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-medium">Secure & Reliable</h3>
                <p className="text-sm text-gray-600 mt-1">End-to-end encrypted transfers</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 text-center">
                <div className="text-indigo-600 flex justify-center mb-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-medium">Competitive Rates</h3>
                <p className="text-sm text-gray-600 mt-1">Great exchange rates & low fees</p>
              </div>
            </div>
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
  );
};

export default WhatsAppTransfer;