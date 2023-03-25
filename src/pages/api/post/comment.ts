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

  if (req.method == "POST") {
    const body = z.object({
      text: z.string().min(1).max(200),
      postId: z.string()
    })
      .safeParse(JSON.parse(req.body));

    if (!body.success) {
      res.status(400).json({ message: "Data you provided is not in correct format" });
      return;
    }

    try {
      await prisma.comment.create({
        data: {
          content: body.data.text,
          userId: session.user.id,
          postId: body.data.postId
        }
      });

      res.status(200).json({ message: "Commented" });
      return;

    } catch (error) {
      console.error(error);

      res.status(400).json({ message: "Could not create comment" });
      return;
    }
  }

  if (req.method == "DELETE") {
    const body = z.object({
      commentId: z.string()
    })
      .safeParse(JSON.parse(req.body));

    if (!body.success) {
      res.status(400).json({ message: "Data you provided is not in correct format" });
      return;
    }

    try {
      await prisma.comment.deleteMany({
        where: {
          id: body.data.commentId,
          userId: session.user.id
        }
      });
    } catch (error) {
      console.error(error)
      res.status(403).json({ message: "You are not the owner of comment" })
      return
    }

    res.status(200).json({ message: "Comment deleted" });
    return;
  }

  res.status(405).json({ message: "Method not allowed" });
  return;
};

export default handler;