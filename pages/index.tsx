import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import Image from "next/image";
import Head from "next/head";

export default function Home() {
  return (
    <>
      {/* SEO Meta Tags */}
      <Head>
        <title>rampa.cash - Fast, Secure Remittances</title>
        <meta name="description" content="Send money globally with rampa.cash. Fast, secure, and regulated remittances powered by blockchain." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Navbar */}
      <nav className="flex items-center justify-between p-6 bg-white shadow-md w-full">
        <div className="flex items-center space-x-4">
          <Image src="/logo.png" alt="rampa.cash logo" width={40} height={40} />
          <span className="text-xl font-bold text-gray-900">rampa.cash</span>
        </div>
        <div className="hidden md:flex space-x-6">
          <a href="#" className="text-gray-700 hover:text-gray-900">Home</a>
          <a href="#how-it-works" className="text-gray-700 hover:text-gray-900">How It Works</a>
          <a href="#pricing" className="text-gray-700 hover:text-gray-900">Pricing</a>
          <a href="#about" className="text-gray-700 hover:text-gray-900">About Us</a>
        </div>
      </nav>

      <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-50">
        {/* Hero Section */}
        <section className="text-center space-y-6 mt-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-gray-900"
          >
            Send Money Globally with rampa.cash
          </motion.h1>
          <p className="text-lg text-gray-600">
            Fast, secure, and regulated remittances. Powered by blockchain.
          </p>
          <Button className="px-6 py-3 text-lg">Start Sending</Button>
        </section>

        {/* How it Works */}
        <section id="how-it-works" className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          {[
            { title: "Create Account", description: "Sign up in minutes with your email and ID." },
            { title: "Deposit Funds", description: "Securely deposit using your local bank or crypto." },
            { title: "Send Money", description: "Send remittances globally at the best rates." },
          ].map((step, index) => (
            <Card key={index} className="shadow-lg">
              <CardContent className="p-6 text-center">
                <h2 className="text-2xl font-semibold mb-2">{step.title}</h2>
                <p className="text-gray-600">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Placeholder for Pricing Section */}
        <section id="pricing" className="mt-24 text-center">
          <h2 className="text-3xl font-bold mb-4">Pricing</h2>
          <p className="text-gray-600">Best exchange rates. Minimal fees. Coming soon!</p>
        </section>

        {/* Placeholder for About Us Section */}
        <section id="about" className="mt-24 text-center">
          <h2 className="text-3xl font-bold mb-4">About Us</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            At rampa.cash, we believe sending money should be simple, fast, and accessible for everyone. Based in Germany, we combine blockchain technology with financial regulation to offer the best remittance experience.
          </p>
        </section>

        {/* Footer */}
        <footer className="mt-24 text-gray-500">
          &copy; {new Date().getFullYear()} rampa.cash - All rights reserved.
        </footer>
      </main>
    </>
  );
}
