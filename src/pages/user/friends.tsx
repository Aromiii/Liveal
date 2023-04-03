import Navbar from "../../components/navs/navbar";
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth/next";
import getFriends from "../../utils/getFriends";
import { authOptions } from "../../server/auth";
import { prisma } from "../../server/db";
import { useState } from "react";
import Link from "next/link";

const Friends = ({ friends, friendSuggestions }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [selectedFriend, setSelectedFriend] = useState(0);

  const removeFriend = async (event: any) => {
    event.preventDefault();

    const response = await fetch("/api/user/friend", {
      method: "DELETE",
      credentials: "include",
      body: JSON.stringify({
        userId: friends[selectedFriend].id
      })
    });
    const body = await response.json();
    alert(body.message);
  };

  const blockFriend = async (event: any) => {
    event.preventDefault();
    console.log(friends[selectedFriend])

    const response = await fetch("/api/user/friend/block", {
      method: "PUT",
      credentials: "include",
      body: JSON.stringify({
        userId: friends[selectedFriend].id
      })
    });
    const body = await response.json();
    alert(body.message);
  };

  const unblockFriend = async (event: any) => {
    event.preventDefault();
    console.log(friends[selectedFriend])

    const response = await fetch("/api/user/friend/block", {
      method: "DELETE",
      credentials: "include",
      body: JSON.stringify({
        userId: friends[selectedFriend].id
      })
    });
    const body = await response.json();
    alert(body.message);
  };

  return <>
    <Navbar>
      <aside className="bg-white top-[80px] absolute left-0 p-2 md:w-[200px] w-2/5 h-[calc(100vh-80px)]">
        <ul>
          {
            friends.map((friend, key) => {
              return <li
                className={selectedFriend == key ? "mb-2 bg-gray-300 rounded-lg p-1 shadow shadow-red-500" : "mb-2 bg-gray-300 rounded-lg p-1 shadow"}>
                <button className="flex place-items-center gap-2 w-full" onClick={() => setSelectedFriend(key)}>
                  <img className="object-cover w-12 h-12 rounded-full" src={friend.image} />
                  <p className="break-words w-[calc(100%-3rem-0.5rem)]">{friend.name}</p>
                </button>
              </li>;
            })
          }
        </ul>
      </aside>
      <div className="md:ml-[200px] ml-[calc(40%+1rem)] flex md:m-3 gap-5">
        <main className="gap-3 h-fit md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 hidden md:grid">
          {
            friendSuggestions.map(suggestion => {
              return <>
                <Link href={`/user/${suggestion.username}`} className="w-full h-full">
                  <div className="bg-white w-full rounded-lg flex place-items-center flex-col h-full">
                    <img className="w-24 h-24 rounded-full object-cover m-2" alt="Profile picture"
                         src={suggestion.image} />
                    <h1 className="m-2 font-bold text-lg break-words max-w-[80%]">{suggestion.name}</h1>
                  </div>
                </Link>
              </>;
            })
          }
        </main>
        <aside className="bg-white min-h-[calc(100vh-160px-2.5rem)] md:w-1/2 w-full rounded-lg relative flex flex-col">
          <img className="h-[15vh] object-cover w-full rounded-lg"
               src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.forestryengland.uk%2Fsites%2Fdefault%2Ffiles%2Fmedia%2FSavernake.jpg&f=1&nofb=1&ipt=bdec4b84b78ef7739a8e5d24a31ffe772381fae3ac10d3f2b9dfcd4068340f18&ipo=images" />
          <div
            className="bg-white md:w-1/2 w-[calc(100%-2.5rem)] rounded-lg flex place-items-center flex-col absolute top-5 left-5 shadow md:min-w-[120px]">
            <img className="w-24 h-24 rounded-full object-cover m-2" alt="Profile picture"
                 src={friends[selectedFriend].image} />
            <h1 className="m-2 font-bold text-lg break-words max-w-[80%]">{friends[selectedFriend].name}</h1>
          </div>
          <div className="m-2 mt-auto">
            {friends[selectedFriend].blocked ?
              <button className="liveal-button bg-white text-black border w-full" onClick={unblockFriend}>
                Unblock
              </button> :
              <button className="liveal-button bg-white text-black border w-full" onClick={blockFriend}>
                Block
              </button>
            }
          </div>
          <div className="m-2 mt-1">
            <button className="liveal-button w-full" onClick={removeFriend}>
              Remove friend
            </button>
          </div>
        </aside>
      </div>
    </Navbar>
  </>;
};

export default Friends;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/signin",
        permanent: true
      }
    }
  }

  const friends = await getFriends(session.user.id);

  const friendSuggestions = await prisma.user.findMany({
    where: { NOT: { id: session.user.id } },
    select: {
      id: true,
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