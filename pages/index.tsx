import { LoadingContainer } from "components/LoadingContainer";
import { Login } from "components/Login";
import { WeedMainScreen } from "components/WeedMainScreen";
import { GlobalContextComponent } from "context/GlobalContext.component";
import { GetServerSideProps } from "next";
import { Session } from "next-auth";
import { getSession, useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession()
  const loading = status === 'loading';

  if (loading) {
    return <LoadingContainer />;

  } else if (session != null) {
    return (
      <GlobalContextComponent>
        <WeedMainScreen />
      </GlobalContextComponent>
    );
  } else {
    return <Login />
  }
}

export const getServerSideProps: GetServerSideProps<{
  session: Session | null
}> = async (context) => {
  return {
    props: {
      session: await getSession(context),
    },
  }
}