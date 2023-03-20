import type { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../server/auth";
import { z } from "zod";
import { prisma } from "../../../server/db";

const handler = async (req: NextRequest, res: NextResponse) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ message: "You must be logged in" });
    return;
  }

  const schema = z.object({
    postId: z.string()
  });

  const body = schema.safeParse(JSON.parse(req.body));

  if (!body.success) {
    res.status(400).json({ message: "Data you provided is not in correct format" });
    return;
  }

  if (req.method == "POST") {
    try {
      await prisma.post.update({
        where: { id: body.data.postId },
        data: {
          likes: { increment: 1 }
        }
      });

      await prisma.like.create({
        data: {
          userId: session.user.id,
          postId: body.data.postId
        }
      });

    } catch (error) {
      res.status(400).json({ message: "Wasn't not able to like" });
      return;
    }

    res.status(200).json({ message: "Post liked" });
    return;
  }

  if (req.method == "DELETE") {
    try {
      await prisma.post.update({
        where: { id: body.data.postId },
        data: {
          likes: { decrement: 1 }
        }
      });

      await prisma.like.deleteMany({
        where: {
          postId: body.data.postId,
          userId: session.user.id
        }
      })
    } catch (error) {
      console.log(error)
      res.status(400).json({ message: "Could not remove like" });
      return
    }

    res.status(200).json({ message: "Like removed" });
    return;
  }


  res.status(405).json({ message: "Method not allowed" });
  return;
};

export default handler;