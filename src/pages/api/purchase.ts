import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Purchase } from "@prisma/client";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<Purchase[]>
) => {
  const client = new PrismaClient();

  const purchases = await client.purchase.findMany();

  return res.status(200).json(purchases);
};

export default handler;
