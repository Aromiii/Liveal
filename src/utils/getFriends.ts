import { prisma } from "../server/db";

export default async function getFriends(id: string) {
  const friends = await prisma.friendship.findMany({
    where: {
      OR: [
        { user1Id: id },
        { user2Id: id }
      ]
    },
    select: {
      blocked: true,
      user1: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true
        }
      },
      user2: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true
        }
      }
    }
  });

  console.log(friends)

  const formattedFriends = friends.map(friend => {
    if (friend.user1.id == id) {
      return {
        blocked: friend.blocked,
        ...friend.user2
      }
    } else {
      return {
        blocked: friend.blocked,
        ...friend.user1
      }
    }
  });

  return formattedFriends;
}