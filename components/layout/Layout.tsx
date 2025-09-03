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
                <title>rampa - Empowering families with Web3 finance</title>
                <meta name="description" content="Financial empowerment platform for families" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="icon" href="/logo.png" type="image/png" />
                {/* Open Graph Meta Tags for social media previews */}
                <meta property="og:title" content="rampa - Empowering families with Web3 finance" />
                <meta property="og:description" content="Financial empowerment platform for families." />
                <meta property="og:image" content="https://www.rampa.cash/logo.png" />
                <meta property="og:url" content="https://www.rampa.cash" />
                <meta property="og:type" content="website" />
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