import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import { WaitlistAdmin } from '../../features/waitlist';

const WaitlistAdminPage = (): JSX.Element => {
    return <WaitlistAdmin />;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale ?? 'en', ['common'])),
        },
    };
};

export default WaitlistAdminPage;
