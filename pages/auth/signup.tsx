import type { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Signup: NextPage = () => {
    const router = useRouter();

    useEffect(() => {
        // Redirect to home page since signup is now handled via Web3Auth in the header
        router.push('/');
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Redirecting...</p>
            </div>
        </div>
    );
};

export default Signup;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale ?? 'en', ['common'])),
        },
    };
};
