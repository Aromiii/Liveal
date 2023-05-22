import {prisma} from "../server/db";
import type Friend from "../types/friend";

export default async function getFriends(id: string): Promise<Friend[]> {
  try {
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

    if (!friends) {
      return []
    }

    return friends.map(friend => {
      if (friend.user1.id == id) {
        return {
          id: friend.user2.id,
          name: friend.user2.name || "Error",
          username: friend.user2.username || "Error",
          image: friend.user2.image || "Error",
          blocked: friend.blocked || true
        }
      } else {
        return {
          id: friend.user1.id,
          name: friend.user1.name || "Error",
          username: friend.user1.username || "Error",
          image: friend.user1.image || "Error",
          blocked: friend.blocked != undefined ? friend.blocked : true
        }
      }
    });
  } catch (e) {
    console.log(e)
    return []
  }
}