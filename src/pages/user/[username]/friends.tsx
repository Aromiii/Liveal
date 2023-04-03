import Navbar from "../../../components/navs/navbar";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { prisma } from "../../../server/db";
import ConnectionOrChatCard from "../../../components/feed/connectionOrChatCard";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../server/auth";

const Friends = ({ friends }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return <>
    <Navbar>
      <main>
        <ul className="bg-white p-3 pb-1 rounded-lg">
          {
            friends.map(friend => {
              return <ConnectionOrChatCard image={friend.image} text={friend.name} link={`/user/${friend.username}`}/>
            })
          }
        </ul>
      </main>
    </Navbar>
  </>
}

export default Friends;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  const user = await prisma.user.findFirst({
    where: { username: context.query.username }
  })

  const friends = await prisma.friendship.findMany({
    where: {
      OR: [
        { user1Id: user.id },
        { user2Id: user.id }
      ]
    },
    select: {
      user1: {
        select: {
          name: true,
          username: true,
          image: true,
        }
      },
      user2: {
        select: {
          name: true,
          username: true,
          image: true,
        }
      }
    }
  })

  const formattedFriends = friends.map(friend => {
    if (friend.user1.id != session?.user.id) {
      return friend.user2
    } else {
      return friend.user1
    }
  });

  return {
    props: {
      friends: formattedFriends
    }
  }
}
