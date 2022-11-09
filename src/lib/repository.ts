import { Ticket } from "@prisma/client";
import { ObjectId } from "bson";

import { repository } from "./prisma";

type TicketInput = {
  title: string;
  value: number;
  image: string;
};

async function createTicket(data: TicketInput): Promise<Ticket> {
  return repository.ticket.create({
    data: {
      id: new ObjectId().toHexString(),
      priceInCents: data.value,
      slug: data.title.replace(/\s/g, "-").toLowerCase(),
      title: data.title,
      image: data.image,
    },
  });
}

async function listTickets(): Promise<Ticket[]> {
  return repository.ticket.findMany();
}

export { createTicket, listTickets };
