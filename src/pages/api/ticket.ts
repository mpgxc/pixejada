import type { NextApiRequest, NextApiResponse } from "next";
import { Ticket } from "@prisma/client";
import { createTicket, listTickets } from "../../lib/repository";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<Ticket | Ticket[]>
) => {
  switch (req.method) {
    case "POST":
      const values = req.body;

      const ticket = await createTicket({
        title: values.title,
        value: Number(values.value),
        image: values.image,
      });

      return res.status(201).json(ticket);
    case "GET":
      const tickets = await listTickets();
      return res.status(200).json(
        tickets.map(({ priceInCents, ...rest }) => ({
          ...rest,
          priceInCents,
          price: priceInCents / 100,
        }))
      );
  }
};

export default handler;
