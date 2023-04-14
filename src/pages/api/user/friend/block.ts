import { getServerSession } from "next-auth";
import { authOptions } from "../../../../server/auth";
import { z } from "zod";
import { prisma } from "../../../../server/db";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);

  const schema = z.object({
    userId: z.string()
  });

  if (!session) {
    return {
      status: 401,
      json: { message: "You must be logged in" }
    };
  }

  const body = schema.safeParse(req.body);

  if (!body.success) {
    return {
      status: 400,
      json: { message: "Data you provided is not in correct format" }
    };
  }

  if (req.method == "PUT") {
    try {
      await prisma.friendship.updateMany({
        where: {
          OR: [
            { user1Id: session.user.id, user2Id: body.data.userId },
            { user1Id: body.data.userId, user2Id: session.user.id }
          ]
        },
        data: {
          blocked: true
        }
      });

      res.status(200).json({ message: "Person blocked" });
      return;

    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong" });
      return;
    }
  }

  if (req.method == "DELETE") {
    try {
      await prisma.friendship.updateMany({
        where: {
          OR: [
            { user1Id: session.user.id, user2Id: body.data.userId },
            { user1Id: body.data.userId, user2Id: session.user.id }
          ]
        },
        data: {
          blocked: false
        }
      });

      res.status(200).json({ message: "Block removed" });
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