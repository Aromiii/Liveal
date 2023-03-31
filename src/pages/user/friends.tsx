import Navbar from "../../components/navs/navbar";
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth/next";
import getFriends from "../../utils/getFriends";
import { authOptions } from "../../server/auth";
import { prisma } from "../../server/db";
import { useState } from "react";

const Friends = ({ friends, friendSuggestions }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [selectedFriend, setSelectedFriend] = useState()

  return <>
    <Navbar />
    <aside className="bg-white absolute left-0 p-2 md:w-[200px] w-2/5 h-[calc(100%-80px)]">
      <ul>
        {
          friends.map((friend, key) => {
            return <li className={selectedFriend == key ? "mb-2 bg-gray-300 rounded-lg p-1 shadow shadow-red-500" : "mb-2 bg-gray-300 rounded-lg p-1 shadow"}>
              <button className="flex place-items-center gap-2 w-full" onClick={() => setSelectedFriend(key)}>
                <img className="object-cover w-12 h-12 rounded-full" src={friend.image}/>
                <p className="break-words w-[calc(100%-3rem-0.5rem)]">{friend.name}</p>
              </button>
            </li>
          })
        }
      </ul>
    </aside>
    <div className="md:ml-[200px] ml-[calc(40%+1rem)] flex md:m-3 my-3 gap-5">
      <main className="gap-3 h-fit md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 hidden md:grid">
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
      <aside className="bg-white h-[calc(100vh-80px-2.75rem)] md:w-1/2 w-full rounded-lg">

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