import { type GetServerSidePropsContext, type NextPage } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../server/auth";

const Edit: NextPage = () => {
  return <>
    <div>

    </div>
  </>
};

export default Edit;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions)

  return {
    props: {

    }
  };
}