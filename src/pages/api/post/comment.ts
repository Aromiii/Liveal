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

  const schema = z.object({
    text: z.string().min(1).max(200)
  })

  const body = schema.safeParse(JSON.parse(req.body));

  if (!body.success) {
    res.status(400).json({ message: "Data you provided is not in correct format" });
    return;
  }

  if (req.method == "POST") {

  }


  res.status(405).json({ message: "method not allowed" });
  return;
};

export default handler;