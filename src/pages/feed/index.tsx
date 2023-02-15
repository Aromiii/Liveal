import { type GetServerSidePropsContext, type NextPage } from "next";
import Navbar from "../../components/navbar";
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../server/auth";
import { useSession } from "next-auth/react"

const Feed: NextPage = () => {
  const { data: session } = useSession()

  if (session) {
    return (
      <>
        <Navbar />
        <div className="flex mt-5 gap-5">
          <aside className="w-1/6">
            <div className="h-36 bg-white rounded-lg flex place-items-center flex-col">
              <img className="w-24 h-24 rounded-full object-cover m-2" alt="Profile picture" src="src/pages/feed/index" />
              <h1 className="font-bold text-lg"></h1>
            </div>
            <div className="bg-white rounded-lg mt-5 p-1">
              <h1>
                Friends
              </h1>
              <ul>

              </ul>
            </div>
          </aside>
          <main className="w-1/2 mx-auto">

          </main>
          <aside className="w-1/6 h-fit bg-white rounded-lg p-1">
            <h1>
              Chats
            </h1>
            <ul>
            </ul>
          </aside>
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