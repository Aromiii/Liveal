import type { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../server/auth";
import { z } from "zod";

const handler = async (req: NextRequest, res: NextResponse) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ message: "You must be logged in" });
  }

  if (req.method == "POST") {
    const schema = z.object({
      displayName: z.string().min(3).max(50),
      username: z.string().min(3).max(50),
      description: z.string().max(1000).optional()
    });

    const body = schema.safeParse(JSON.parse(req.body))

    if (!body.success) {
      res.status(400).json({ message: "Data you provided is not in correct format"})
    }
  }

};

export default handler;