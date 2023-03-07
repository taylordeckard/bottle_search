import { countBottles } from "./countBottles";
import { getBottles } from "./bottles";

export const resolvers = {
  Query: {
    countBottles,
    bottles: getBottles,
  },
};
