import React from 'react';
import { GetServerSidePropsContext } from 'next';
import nookies from "nookies";
import { firebaseAdmin } from '../server/firebaseAdmin';
import { WeedMainScreen } from '../client/components/WeedMainScreen';
import { MainView } from '../client/views/MainView';

export default () => {
  return (
    <WeedMainScreen>
      <MainView />
    </WeedMainScreen>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  try {
    const cookies = nookies.get(ctx);
    await firebaseAdmin.auth().verifyIdToken(cookies.token);
    // the user is authenticated!
    return {
      props: {},
    };
  } catch (err) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
      props: {} as never,
    };
  }
};
