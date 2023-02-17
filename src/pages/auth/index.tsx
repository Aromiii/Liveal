import { type GetServerSidePropsContext, type NextPage } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../server/auth";
import { useSession } from "next-auth/react";

const Auth: NextPage = () => {
  const { data: session } = useSession();

  if (session) {
    return (
      <>

      </>
    );
  }
  return <p>Access Denied</p>;
};

export default Auth;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      session: await getServerSession(
        context.req,
        context.res,
        authOptions
      )
    }
  };
}