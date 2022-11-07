import React from 'react';
import { GetServerSidePropsContext } from 'next';
import { MainScreen } from '../client/components/Shared/MainScreen';
import { MainView } from '../client/components/MainView';
import { UserInfo } from '../types/UserInfo';
import { getUserFromPropsContext } from '../server/authentication';

type IndexProps = {
  userInfo: UserInfo;
}

const Main = (props: IndexProps) => {
  return (
      <MainScreen userInfo={props.userInfo}>
        <MainView />
      </MainScreen>
  );
};

export default Main;

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
