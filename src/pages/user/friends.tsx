import Navbar from "../../components/navs/navbar";
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import ConnectionOrChatCard from "../../components/feed/connectionOrChatCard";
import { getServerSession } from "next-auth/next";
import getFriends from "../../utils/getFriends";
import { authOptions } from "../../server/auth";
import { prisma } from "../../server/db";

const Friends = ({ friends, friendSuggestions }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return <>
    <Navbar />
    <aside className="bg-white absolute left-0 p-2 md:w-[200px] w-1/2 h-[calc(100%-80px)]">
      <ul>
        {
          friends.map(friend => {
            return <ConnectionOrChatCard image={friend.image} text={friend.name} link={`/user/${friend.username}`} />;
          })
        }
      </ul>
    </aside>
    <div className="ml-[200px] flex m-3 gap-5">
      <main className="gap-3 h-fit grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {
          friendSuggestions.map(suggestion => {
            return <>
              <div className="bg-white w-full rounded-lg flex place-items-center flex-col">
                <img className="w-24 h-24 rounded-full object-cover m-2" alt="Profile picture"
                     src={suggestion.image} />
                <h1 className="m-2 font-bold text-lg break-words max-w-[80%]">{suggestion.name}</h1>
              </div>
            </>
          })
        }
      </main>
      <aside className="bg-white h-[calc(100vh-80px-2.75rem)] w-1/2 rounded-lg">

      </aside>
    </div>
  </>;
};

export default Friends;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);
  const friends = await getFriends(session.user.id);

  const friendSuggestions = await prisma.user.findMany({
    where: { NOT: { id: session.user.id } },
    select: {
      username: true,
      name: true,
      image: true
    }
  });

  return {
    props: {
      friendSuggestions: friendSuggestions,
      friends: friends
    }
  };
};