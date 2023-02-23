import type { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../server/auth";
import { prisma } from "../../../server/db";
import { z } from "zod";

const handler = async (req: NextRequest, res: NextResponse) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ message: "You must be logged in" });
    return;
  }

  if (req.method == "POST") {
    try {
      const schema = z.object({
        postText: z.string().min(1).max(5000)
      });

      const body = schema.parse(JSON.parse(req.body));

      const post = await prisma.post.create({
        data: {
          content: body.postText,
          author: {
            connect: {
              id: session.user.id
            }
          }
        }
      });

      res.status(201).json({ message: "Post created" });
      return;

    } catch (e) {
      res.status(400).json({ message: "Bad request" });
      return;
    }
  }

  res.status(405).json({ message: "method not allowed" });
  return;
};

export default handler;