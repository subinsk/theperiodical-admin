import { Topic } from "@prisma/client";

export type Gist = {
  id: string;
  title: string;
  description: string;
  topics: Topic[];
  from: Date;
  to: Date;
  createdAt: Date;
  updatedAt: Date;
};
