import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { gql } from "graphql-tag";
import { resolvers } from "../../resolvers";

const typeDefs = gql`
  type Bottle {
    _id: String
    title: String
    price: Float
    website: String
    link: String
    fresh: Boolean
  }

  enum SortDir {
    asc
    desc
  }

  type Query {
    bottles(
      fresh: Boolean
      limit: Int
      rangeStart: Float
      rangeEnd: Float
      search: String
      skip: Int
      sortDir: SortDir
      sortKey: String
    ): [Bottle]
    countBottles(
      fresh: Boolean
      search: String
      rangeStart: Float
      rangeEnd: Float
    ): Int
  }
`;

const server = new ApolloServer({
  resolvers,
  typeDefs,
});

export default startServerAndCreateNextHandler(server);
