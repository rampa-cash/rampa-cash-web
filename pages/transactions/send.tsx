import type { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import { SendMoney } from '../../features/transactions';

const SendPage: NextPage = () => {
    return <SendMoney />;
};

export default SendPage;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale ?? 'en', ['common'])),
        },
    };
};
