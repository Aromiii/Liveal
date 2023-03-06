import type { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../server/auth";
import { z } from "zod";

const handler = async (req: NextRequest, res: NextResponse) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ message: "You must be logged in" });
    return;
  }

  if (req.method == "POST") {
    const schema = z.object({
      displayName: z.string().min(3).max(50),
      username: z.string().min(3).max(50),
      description: z.string().max(1000).optional()
    });

    try {
      const body = schema.parse(JSON.parse(req.body));
      res.status(200).json({ message: "200" });
      return;

    } catch (error) {
      res.status(400).json({ message: "Values you provided are invalid" });
      return;
    }
  }

};

export default handler;