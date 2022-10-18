import React from 'react';
import { GetServerSidePropsContext } from 'next';
import { WeedMainScreen } from '../client/components/WeedMainScreen';
import { MainView } from '../client/views/MainView';
import { UserInfo } from '../types/UserInfo';
import { getUserFromPropsContext } from '../server/authentication';

type IndexProps = {
  userInfo: UserInfo;
}

export default (props: IndexProps) => {
  return (
      <WeedMainScreen userInfo={props.userInfo}>
        <MainView />
      </WeedMainScreen>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const userInfo = await getUserFromPropsContext(ctx);
  if (userInfo) {
    return {
      props: { userInfo },
    };
  }
  return {
    redirect: {
      permanent: false,
      destination: "/login",
    },
    props: {} as never,
  };
}
