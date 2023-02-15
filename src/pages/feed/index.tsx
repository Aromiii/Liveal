import { type GetServerSidePropsContext, type NextPage } from "next";
import Navbar from "../../components/navs/navbar";
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../server/auth";
import { useSession } from "next-auth/react"
import ChatsNav from "../../components/navs/chatsNav";
import FriendsNav from "../../components/navs/friendsNav";

const Feed: NextPage = () => {
  const { data: session } = useSession()

  if (session) {
    return (
      <>
        <Navbar />
        <div className="flex mt-5 gap-5">
          <FriendsNav />
          <main className="w-1/2 mx-auto">

          </main>
          <ChatsNav />
        </div>
      </>
    )
  }
  return <p>Access Denied</p>
};

export default Feed;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      session: await getServerSession(
        context.req,
        context.res,
        authOptions
      ),
    },
  }
}