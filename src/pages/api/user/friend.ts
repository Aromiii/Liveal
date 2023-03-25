import type { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../server/auth";
import { z } from "zod";
import { prisma } from "../../../server/db";

const handler = async (req: NextRequest, res: NextResponse) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ message: "You must be logged in" });
  }

  const schema = z.object({
    userId: z.string()
  });

  const body = schema.safeParse(JSON.parse(req.body));

  if (!body.success) {
    res.status(400).json({ message: "Data you provided is not in correct format" });
    return;
  }

  if (req.method == "POST") {
    try {
      const result = await prisma.friendship.findFirst({
        where: {
          OR: [
            { user1Id: session.user.id, user2Id: body.data.userId },
            { user1Id: body.data.userId, user2Id: session.user.id }
          ]
        }
      });

      if (result) {
        res.status(400).json({ message: "Friendship between two of you exists already" });
        return;
      }

      await prisma.friendship.create({
        data: {
          user1Id: session.user.id,
          user2Id: body.data.userId
        }
      });

      res.status(200).json({ message: "You are now friends" });
      return;

    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong" });
      return;
    }
  }

  if (req.method == "DELETE") {
    try {
      await prisma.friendship.deleteMany({
        where: {
          OR: [
            { user1Id: session.user.id, user2Id: body.data.userId },
            { user1Id: body.data.userId, user2Id: session.user.id }
          ]
        }
      });

      res.status(200).json({ message: "You are no longer friends" });
      return;

    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong" });
      return;
    }
  }

  res.status(405).json({ message: "method not allowed" });
  return;
};

export default handler;