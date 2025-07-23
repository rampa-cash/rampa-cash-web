import type { NextPage } from 'next'
import WaitlistSignup from '../components/WaitlistSignup'

const Home: NextPage = () => {
  return (
    <>
       <section id="home" className="py-8 md:py-16 text-center px-4">
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 md:mb-6 leading-tight">
            Turning everyday remittances into engines of shared prosperity.
            <br className="hidden sm:block" />
            <span className="sm:inline"> Empowering families with Web3 finance.</span>
            </h1>
            <div className="mt-12">
            <WaitlistSignup 
                title="🚀 Get Early Access"
                description="Join 500+ people waiting for the full RAMPA launch"
                className="max-w-lg mx-auto"
            />
            </div>
        </div>
        </section>
        <section id="how-it-works" className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-16">How It Works</h2>
            
            <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm relative">
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold mb-4">
                1
                </div>
                <h3 className="text-xl font-bold mb-2">Create an account</h3>
                <p className="text-gray-600">Set up your account easily with your phone number.</p>
            </div>
            
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm relative">
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold mb-4">
                2
                </div>
                <h3 className="text-xl font-bold mb-2">MPC Wallet created automatically</h3>
                <p className="text-gray-600">Your secure multi-party computation wallet is generated instantly for maximum security and control.</p>
            </div>
            
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm relative">
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold mb-4">
                3
                </div>
                <h3 className="text-xl font-bold mb-2">Add a recipient from your contacts</h3>
                <p className="text-gray-600">Choose the recipient and add the amount you want to send.</p>
            </div>
            
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm relative">
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold mb-4">
                4
                </div>
                <h3 className="text-xl font-bold mb-2">Confirm and send</h3>
                <p className="text-gray-600">And that&apos;s it: your family gets more of what they deserve.</p>
            </div>
            </div>
        </div>
        </section>
        <section id="pricing" className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Pricing</h2>
            <p className="text-lg md:text-xl mb-6 md:mb-8 max-w-3xl mx-auto text-gray-700">
            Exchange rate without hidden fees and with low commissions.
            </p>
            
            <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto mt-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="text-2xl font-bold text-green-600 mb-2">Real-time rates</div>
                <p className="text-gray-600">Live market exchange rates updated every minute</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="text-2xl font-bold text-blue-600 mb-2">No hidden fees</div>
                <p className="text-gray-600">What you see is what you pay - complete transparency</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="text-2xl font-bold text-purple-600 mb-2">Low commission</div>
                <p className="text-gray-600">Minimal fees to keep more money in your pocket</p>
            </div>
            </div>
        </div>
        </section>
        <section id="about-us" className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">About Us</h2>
            <p className="text-lg md:text-xl mb-6 md:mb-8 max-w-3xl mx-auto text-gray-700">
            Bringing Web3 and decentralized apps to real people, making it so simple that they don&apos;t realize they&apos;re using them. Rampa is an On-chain remittance platform
            that turns stablecoin transfers into shared prosperity, empowering families to thrive trough financial education and a tokenized investment portfolio, so the money they
            send home today grows into collective wealth.
            </p>
            
            <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto mt-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                </div>
                <h3 className="text-lg font-bold mb-2">Web3 Simplified</h3>
                <p className="text-gray-600">Powerful blockchain technology hidden behind an intuitive interface</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                </div>
                <h3 className="text-lg font-bold mb-2">For Real People</h3>
                <p className="text-gray-600">Built for everyday users sending money to family and friends</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                </div>
                <h3 className="text-lg font-bold mb-2">Invisible Innovation</h3>
                <p className="text-gray-600">Advanced security and speed without the complexity</p>
            </div>
            </div>
        </div>
        </section>
        <section id="waitlist" className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Transform Money Transfers?</h2>
            <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto text-gray-700">
            Be among the first to experience the future of cross-border payments. 
            Join our waitlist and get exclusive early access when we launch.
            </p>
            
            <WaitlistSignup 
            title="🎯 Reserve Your Spot"
            description="Get notified the moment RAMPA MVP goes live + exclusive launch bonuses"
            />
            
            <div className="grid gap-4 sm:grid-cols-3 max-w-2xl mx-auto mt-8 text-sm text-gray-600">
            <div className="flex items-center justify-center">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Early access
            </div>
            <div className="flex items-center justify-center">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Launch bonuses
            </div>
            <div className="flex items-center justify-center">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                No spam ever
            </div>
            </div>
        </div>
        </section>
    </>
  )
}

export default Home
