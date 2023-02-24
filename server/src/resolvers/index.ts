import { getBottles } from "./bottles";

export const resolvers = {
  Query: {
    bottles: getBottles,
  },
};
