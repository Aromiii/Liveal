import { getServerSession } from "next-auth";
import { authOptions } from "../../../server/auth";
import { prisma } from "../../../server/db";
import { z } from "zod";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
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

      const body = schema.parse(req.body);

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

  if (req.method == "PUT") {
    try {
      const schema = z.object({
        postText: z.string().min(1).max(5000),
        postId: z.string()
      });

      const body = schema.parse(req.body);

      const result = await prisma.post.findFirst({
        select: {
          author: {
            select: {
              id: true
            }
          }
        },
        where: {
          id: body.postId
        }
      });

      if (session.user.id != result?.author.id) {
        res.status(403).json({ message: "your not the author of the post" });
        return;
      }

      const post = await prisma.post.update({
        where: {
          id: body.postId
        },
        data: {
          content: body.postText
        }
      });

      console.log(post);

      res.status(201).json({ message: "Post updated" });
      return;

    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Bad request" });
      return;
    }
  }

  res.status(405).json({ message: "method not allowed" });
  return;
};

export default handler;