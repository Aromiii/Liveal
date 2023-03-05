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

  }

};

export default handler;