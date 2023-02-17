import { type GetServerSidePropsContext, type NextPage } from "next";
import Navbar from "../components/navs/navbar";
import { getServerSession } from "next-auth/next"
import { authOptions } from "../server/auth";
import { useSession } from "next-auth/react"
import ChatsNav from "../components/navs/chatsNav";
import FriendsNav from "../components/navs/friendsNav";
import Link from "next/link";

const Feed: NextPage = () => {
  const { status } = useSession()

  if (status == "authenticated") {
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

  return (
    <>
      <Navbar />
      <div className="flex mt-5 gap-5">
        <main className="w-1/2 mx-auto">

        </main>
      </div>
      <footer className="absolute h-20 w-screen bottom-0 left-0 bg-red-500 flex place-items-center">
        <h1 className="text-white text-4xl p-5 mr-auto">
          Don't be left alone - Be conneted to your community
        </h1>
        <Link href="/auth/signin" className="text-white text-2xl m-5 p-2 px-5 rounded-lg bg-white text-black">
          Sing in
        </Link>
      </footer>
    </>
  )
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