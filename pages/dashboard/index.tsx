import type { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import { Dashboard } from '../../features/dashboard';
import { AuthGuard } from '../../features/auth';

const DashboardPage: NextPage = () => {
    return (
        <AuthGuard>
            <Dashboard />
        </AuthGuard>
    );
};

export default DashboardPage;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale ?? 'en', ['common'])),
        },
    };
};
