import Header from './Header';
import Footer from './Footer';
import Head from 'next/head';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps): JSX.Element => (
  <div className="min-h-screen bg-white flex flex-col">
    <div className="min-h-screen bg-white">
        <Head>
            <title>RAMPA - Empowering families with Web3 finance</title>
            <meta name="description" content="Send money globally with RAMPA" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link rel="icon" href="/logo.png" type="image/png" />
        </Head>
        <Header />
        <main className="flex-1 pt-16">
            {children}
        </main>
        <Footer />
    </div>
  </div>
);

export default Layout;