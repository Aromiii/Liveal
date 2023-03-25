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

  const formattedFriends = friends.map(friend => {
    if (friend.user1.id == id) {
      return friend.user2;
    } else {
      return friend.user1
    }
  });

  return formattedFriends;
}